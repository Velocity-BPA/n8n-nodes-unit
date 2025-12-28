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
 * Unit Customer Token Credentials
 *
 * Customer tokens are scoped API tokens that provide access to a specific
 * customer's data. They are typically used in customer-facing applications
 * where the end user should only have access to their own banking data.
 *
 * Customer tokens have a limited lifespan and may need to be refreshed.
 */
export class UnitCustomerToken implements ICredentialType {
  name = 'unitCustomerToken';
  displayName = 'Unit Customer Token';
  documentationUrl = 'https://docs.unit.co/customer-api-tokens';
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
      displayName: 'Customer Token',
      name: 'customerToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Unit customer-scoped API token',
    },
    {
      displayName: 'Customer ID',
      name: 'customerId',
      type: 'string',
      default: '',
      required: true,
      description: 'The Unit customer ID associated with this token',
    },
    {
      displayName: 'Token Expiration',
      name: 'tokenExpiration',
      type: 'dateTime',
      default: '',
      description: 'When the customer token expires (for reference)',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.customerToken}}',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '={{$credentials.environment === "production" ? "https://api.unit.co" : $credentials.environment === "sandbox" ? "https://api.s.unit.sh" : $credentials.customUrl}}',
      url: '/customers/{{$credentials.customerId}}',
      method: 'GET',
    },
  };
}
