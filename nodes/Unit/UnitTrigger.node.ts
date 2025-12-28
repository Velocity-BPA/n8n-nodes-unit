/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
  IHookFunctions,
  IDataObject,
} from 'n8n-workflow';
import { handleUnitWebhook, getEventTypeOptions } from './transport/webhookHandler';

export class UnitTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Unit Trigger',
    name: 'unitTrigger',
    icon: 'file:unit.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["events"].join(", ")}}',
    description: 'Receive Unit webhook events',
    defaults: {
      name: 'Unit Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'unitApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        required: true,
        default: [],
        options: getEventTypeOptions(),
        description: 'Select the events to listen for',
      },
      {
        displayName: 'Verify Signature',
        name: 'verifySignature',
        type: 'boolean',
        default: true,
        description: 'Whether to verify the webhook signature using the webhook secret',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Include Raw Body',
            name: 'includeRawBody',
            type: 'boolean',
            default: false,
            description: 'Whether to include the raw webhook body in the output',
          },
          {
            displayName: 'Include Headers',
            name: 'includeHeaders',
            type: 'boolean',
            default: false,
            description: 'Whether to include the webhook headers in the output',
          },
        ],
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        // For manual webhook setup, always return true
        return true;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        // Webhook needs to be configured manually in Unit dashboard
        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        // Webhook cleanup happens manually
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const events = this.getNodeParameter('events') as string[];
    const verifySignature = this.getNodeParameter('verifySignature') as boolean;
    const options = this.getNodeParameter('options') as IDataObject;

    try {
      const result = await handleUnitWebhook.call(this, { verifySignature });
      
      // Filter events based on selected event types
      if (events.length > 0) {
        const filteredData = result[0].filter((item) => {
          const eventType = item.json.eventType as string;
          return events.some((e) => eventType.startsWith(e.replace('.*', '')));
        });

        if (filteredData.length === 0) {
          return { noWebhookResponse: true };
        }

        // Add optional data
        if (options.includeRawBody) {
          const bodyData = this.getBodyData();
          filteredData.forEach((item) => {
            item.json.rawBody = bodyData;
          });
        }

        if (options.includeHeaders) {
          const headerData = this.getHeaderData();
          filteredData.forEach((item) => {
            item.json.webhookHeaders = headerData;
          });
        }

        return {
          workflowData: [filteredData],
        };
      }

      return {
        workflowData: result,
      };
    } catch (error) {
      // Return error but don't fail the webhook
      return {
        workflowData: [[{
          json: {
            error: (error as Error).message,
            timestamp: new Date().toISOString(),
          },
        }]],
      };
    }
  }
}
