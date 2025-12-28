/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

/**
 * Unit API Credentials
 *
 * Unit is an embedded banking platform that provides Banking-as-a-Service (BaaS).
 * This credential type handles authentication to the Unit API using Bearer tokens.
 *
 * Supports:
 * - Production environment
 * - Sandbox environment (for testing)
 * - Custom endpoints (for enterprise deployments)
 */
export class UnitApi implements ICredentialType {
  name = 'unitApi';
  displayName = 'Unit API';
  documentationUrl = 'https://docs.unit.co/';
  properties: INodeProperties[] = [
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      default: 'sandbox',
      options: [
        {
          name: 'Sandbox',
          value: 'sandbox',
          description: 'Use Unit sandbox environment for testing',
        },
        {
          name: 'Production',
          value: 'production',
          description: 'Use Unit production environment',
        },
        {
          name: 'Custom',
          value: 'custom',
          description: 'Use a custom Unit API endpoint',
        },
      ],
      description: 'Select the Unit environment to connect to',
    },
    {
      displayName: 'Custom API URL',
      name: 'customUrl',
      type: 'string',
      default: '',
      placeholder: 'https://api.custom.unit.co',
      description: 'Custom Unit API endpoint URL',
      displayOptions: {
        show: {
          environment: ['custom'],
        },
      },
    },
    {
      displayName: 'API Token',
      name: 'apiToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Unit API Bearer token for authentication',
    },
    {
      displayName: 'Org ID',
      name: 'orgId',
      type: 'string',
      default: '',
      required: true,
      description: 'Your Unit organization ID',
    },
    {
      displayName: 'User Token',
      name: 'userToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Optional: User token for customer-scoped operations',
    },
    {
      displayName: 'Webhook Secret',
      name: 'webhookSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Optional: Webhook secret for verifying webhook signatures',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiToken}}',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '={{$credentials.environment === "production" ? "https://api.unit.co" : $credentials.environment === "sandbox" ? "https://api.s.unit.sh" : $credentials.customUrl}}',
      url: '/users',
      method: 'GET',
    },
  };
}
