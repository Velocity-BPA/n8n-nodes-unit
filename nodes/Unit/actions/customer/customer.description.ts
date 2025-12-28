/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';
import { US_STATES } from '../../constants';

export const customerOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['customer'],
      },
    },
    options: [
      {
        name: 'Add Authorized Users',
        value: 'addAuthorizedUsers',
        description: 'Add authorized users to a business customer',
        action: 'Add authorized users to a customer',
      },
      {
        name: 'Archive',
        value: 'archive',
        description: 'Archive a customer',
        action: 'Archive a customer',
      },
      {
        name: 'Create Business',
        value: 'createBusiness',
        description: 'Create a new business customer',
        action: 'Create a business customer',
      },
      {
        name: 'Create Individual',
        value: 'createIndividual',
        description: 'Create a new individual customer',
        action: 'Create an individual customer',
      },
      {
        name: 'Create Token',
        value: 'createToken',
        description: 'Create a customer API token',
        action: 'Create a customer token',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a customer by ID',
        action: 'Get a customer',
      },
      {
        name: 'Get by Email',
        value: 'getByEmail',
        description: 'Get a customer by email address',
        action: 'Get a customer by email',
      },
      {
        name: 'Get Limits',
        value: 'getLimits',
        description: 'Get customer limits',
        action: 'Get customer limits',
      },
      {
        name: 'Get Tags',
        value: 'getTags',
        description: 'Get customer tags',
        action: 'Get customer tags',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List all customers',
        action: 'List all customers',
      },
      {
        name: 'Remove Authorized Users',
        value: 'removeAuthorizedUsers',
        description: 'Remove authorized users from a business customer',
        action: 'Remove authorized users from a customer',
      },
      {
        name: 'Restore',
        value: 'restore',
        description: 'Restore an archived customer',
        action: 'Restore a customer',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a customer',
        action: 'Update a customer',
      },
      {
        name: 'Update Tags',
        value: 'updateTags',
        description: 'Update customer tags',
        action: 'Update customer tags',
      },
    ],
    default: 'get',
  },
];

export const customerFields: INodeProperties[] = [
  // Customer ID field for operations that need it
  {
    displayName: 'Customer ID',
    name: 'customerId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: [
          'get',
          'update',
          'archive',
          'restore',
          'addAuthorizedUsers',
          'removeAuthorizedUsers',
          'getLimits',
          'getTags',
          'updateTags',
          'createToken',
        ],
      },
    },
    description: 'The ID of the customer',
  },

  // Create Individual Customer Fields
  {
    displayName: 'First Name',
    name: 'firstName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['createIndividual'],
      },
    },
    description: 'First name of the customer',
  },
  {
    displayName: 'Last Name',
    name: 'lastName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['createIndividual'],
      },
    },
    description: 'Last name of the customer',
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@email.com',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['createIndividual', 'getByEmail'],
      },
    },
    description: 'Email address of the customer',
  },
  {
    displayName: 'Phone',
    name: 'phone',
    type: 'string',
    required: true,
    default: '',
    placeholder: '5551234567',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['createIndividual', 'createBusiness'],
      },
    },
    description: 'Phone number (10 digits)',
  },
  {
    displayName: 'Date of Birth',
    name: 'dateOfBirth',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'YYYY-MM-DD',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['createIndividual'],
      },
    },
    description: 'Date of birth in YYYY-MM-DD format',
  },
  {
    displayName: 'SSN',
    name: 'ssn',
    type: 'string',
    required: true,
    default: '',
    placeholder: '123456789',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['createIndividual'],
      },
    },
    description: 'Social Security Number (9 digits, no dashes)',
  },
  {
    displayName: 'Address',
    name: 'address',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: false,
    },
    required: true,
    default: {},
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['createIndividual', 'createBusiness'],
      },
    },
    options: [
      {
        displayName: 'Address',
        name: 'addressFields',
        values: [
          {
            displayName: 'Street',
            name: 'street',
            type: 'string',
            default: '',
            required: true,
            description: 'Street address',
          },
          {
            displayName: 'Street 2',
            name: 'street2',
            type: 'string',
            default: '',
            description: 'Additional street address (apt, suite, etc.)',
          },
          {
            displayName: 'City',
            name: 'city',
            type: 'string',
            default: '',
            required: true,
            description: 'City',
          },
          {
            displayName: 'State',
            name: 'state',
            type: 'options',
            options: US_STATES.map((s) => ({ name: s.name, value: s.value })),
            default: 'CA',
            required: true,
            description: 'State',
          },
          {
            displayName: 'Postal Code',
            name: 'postalCode',
            type: 'string',
            default: '',
            required: true,
            description: 'ZIP code',
          },
          {
            displayName: 'Country',
            name: 'country',
            type: 'string',
            default: 'US',
            description: 'Country code (default: US)',
          },
        ],
      },
    ],
    description: 'Customer address',
  },

  // Create Business Customer Fields
  {
    displayName: 'Business Name',
    name: 'businessName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['createBusiness'],
      },
    },
    description: 'Legal name of the business',
  },
  {
    displayName: 'DBA (Doing Business As)',
    name: 'dba',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['createBusiness'],
      },
    },
    description: 'Trade name of the business (optional)',
  },
  {
    displayName: 'EIN',
    name: 'ein',
    type: 'string',
    required: true,
    default: '',
    placeholder: '123456789',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['createBusiness'],
      },
    },
    description: 'Employer Identification Number (9 digits)',
  },
  {
    displayName: 'Entity Type',
    name: 'entityType',
    type: 'options',
    required: true,
    default: 'LLC',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['createBusiness'],
      },
    },
    options: [
      { name: 'Corporation', value: 'Corporation' },
      { name: 'LLC', value: 'LLC' },
      { name: 'Partnership', value: 'Partnership' },
      { name: 'Sole Proprietorship', value: 'SoleProprietorship' },
      { name: 'Not For Profit', value: 'NotForProfit' },
    ],
    description: 'Type of business entity',
  },
  {
    displayName: 'State of Incorporation',
    name: 'stateOfIncorporation',
    type: 'options',
    options: US_STATES.map((s) => ({ name: s.name, value: s.value })),
    required: true,
    default: 'DE',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['createBusiness'],
      },
    },
    description: 'State where the business is incorporated',
  },
  {
    displayName: 'Contact',
    name: 'contact',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: false,
    },
    required: true,
    default: {},
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['createBusiness'],
      },
    },
    options: [
      {
        displayName: 'Contact',
        name: 'contactFields',
        values: [
          {
            displayName: 'First Name',
            name: 'firstName',
            type: 'string',
            default: '',
            required: true,
            description: 'Contact first name',
          },
          {
            displayName: 'Last Name',
            name: 'lastName',
            type: 'string',
            default: '',
            required: true,
            description: 'Contact last name',
          },
          {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            placeholder: 'name@email.com',
            default: '',
            required: true,
            description: 'Contact email',
          },
          {
            displayName: 'Phone',
            name: 'phone',
            type: 'string',
            default: '',
            required: true,
            description: 'Contact phone number',
          },
        ],
      },
    ],
    description: 'Primary contact for the business',
  },

  // Additional Fields for Create
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['createIndividual', 'createBusiness'],
      },
    },
    options: [
      {
        displayName: 'Nationality',
        name: 'nationality',
        type: 'string',
        default: 'US',
        description: 'ISO 3166-1 alpha-2 country code',
      },
      {
        displayName: 'Occupation',
        name: 'occupation',
        type: 'options',
        default: 'EmploymentOrPayrollSpecialist',
        options: [
          { name: 'Architect Or Engineer', value: 'ArchitectOrEngineer' },
          { name: 'Business Analyst', value: 'BusinessAnalystAccountantOrFinancialAdvisor' },
          { name: 'Community Services', value: 'CommunityAndSocialServicesWorker' },
          { name: 'Construction', value: 'ConstructionMechanicOrMaintenanceWorker' },
          { name: 'Doctor', value: 'Doctor' },
          { name: 'Educator', value: 'Educator' },
          { name: 'Payroll Specialist', value: 'EmploymentOrPayrollSpecialist' },
          { name: 'Executive', value: 'ExecutiveOrManager' },
          { name: 'Government Official', value: 'GovernmentOfficial' },
          { name: 'Homemaker', value: 'Homemaker' },
          { name: 'Hospitality', value: 'HospitalityOfficeOrAdministrativeSupportWorker' },
          { name: 'Household Staff', value: 'HouseholdManager' },
          { name: 'Janitor', value: 'JanitorHousekeeperLandscaper' },
          { name: 'Lawyer', value: 'Lawyer' },
          { name: 'Manufacturing', value: 'ManufacturingOrProductionWorker' },
          { name: 'Military', value: 'MilitaryOrPublicSafety' },
          { name: 'Nurse', value: 'Nurse' },
          { name: 'Personal Care', value: 'PersonalCareOrServiceWorker' },
          { name: 'Pilot', value: 'PilotDriverOperator' },
          { name: 'Sales', value: 'SalesRepresentativeBrokerAgent' },
          { name: 'Scientist', value: 'ScientistOrTechnologist' },
          { name: 'Student', value: 'Student' },
        ],
        description: 'Occupation of the customer',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'json',
        default: '{}',
        description: 'Custom tags as JSON object',
      },
      {
        displayName: 'Idempotency Key',
        name: 'idempotencyKey',
        type: 'string',
        default: '',
        description: 'Unique key to prevent duplicate creation',
      },
      {
        displayName: 'Website',
        name: 'website',
        type: 'string',
        default: '',
        description: 'Business website URL',
      },
    ],
  },

  // Update Fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        default: '',
        description: 'New email address',
      },
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        description: 'New phone number',
      },
      {
        displayName: 'Address',
        name: 'address',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: false,
        },
        default: {},
        options: [
          {
            displayName: 'Address',
            name: 'addressFields',
            values: [
              {
                displayName: 'Street',
                name: 'street',
                type: 'string',
                default: '',
                description: 'Street address',
              },
              {
                displayName: 'City',
                name: 'city',
                type: 'string',
                default: '',
                description: 'City',
              },
              {
                displayName: 'State',
                name: 'state',
                type: 'options',
                options: US_STATES.map((s) => ({ name: s.name, value: s.value })),
                default: 'CA',
                description: 'State',
              },
              {
                displayName: 'Postal Code',
                name: 'postalCode',
                type: 'string',
                default: '',
                description: 'ZIP code',
              },
            ],
          },
        ],
        description: 'New address',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'json',
        default: '{}',
        description: 'Custom tags as JSON object',
      },
    ],
  },

  // List Filters
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['list'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 100,
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['list'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 1000,
    },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Offset',
    name: 'offset',
    type: 'number',
    default: 0,
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['list'],
        returnAll: [false],
      },
    },
    description: 'Number of results to skip',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Filter by email address',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        default: 'Active',
        options: [
          { name: 'Active', value: 'Active' },
          { name: 'Archived', value: 'Archived' },
        ],
        description: 'Filter by customer status',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Filter by tags (comma-separated)',
      },
    ],
  },

  // Archive Reason
  {
    displayName: 'Reason',
    name: 'reason',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['archive'],
      },
    },
    description: 'Reason for archiving the customer',
  },

  // Authorized Users
  {
    displayName: 'Authorized Users',
    name: 'authorizedUsers',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    default: {},
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['addAuthorizedUsers'],
      },
    },
    options: [
      {
        displayName: 'User',
        name: 'user',
        values: [
          {
            displayName: 'First Name',
            name: 'firstName',
            type: 'string',
            default: '',
            required: true,
          },
          {
            displayName: 'Last Name',
            name: 'lastName',
            type: 'string',
            default: '',
            required: true,
          },
          {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            placeholder: 'name@email.com',
            default: '',
            required: true,
          },
          {
            displayName: 'Phone',
            name: 'phone',
            type: 'string',
            default: '',
            required: true,
          },
        ],
      },
    ],
    description: 'Authorized users to add',
  },
  {
    displayName: 'Authorized User Emails',
    name: 'authorizedUserEmails',
    type: 'string',
    typeOptions: {
      multipleValues: true,
    },
    default: [],
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['removeAuthorizedUsers'],
      },
    },
    description: 'Email addresses of authorized users to remove',
  },

  // Tags
  {
    displayName: 'Tags',
    name: 'tags',
    type: 'json',
    default: '{}',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['updateTags'],
      },
    },
    description: 'Tags to set on the customer (JSON object)',
  },

  // Token Scope
  {
    displayName: 'Scope',
    name: 'scope',
    type: 'multiOptions',
    default: ['accounts:read'],
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['createToken'],
      },
    },
    options: [
      { name: 'Accounts - Read', value: 'accounts:read' },
      { name: 'Accounts - Write', value: 'accounts:write' },
      { name: 'Cards - Read', value: 'cards:read' },
      { name: 'Cards - Sensitive Read', value: 'cards:sensitive:read' },
      { name: 'Cards - Write', value: 'cards:write' },
      { name: 'Check Deposits - Read', value: 'check-deposits:read' },
      { name: 'Check Deposits - Write', value: 'check-deposits:write' },
      { name: 'Counterparties - Read', value: 'counterparties:read' },
      { name: 'Counterparties - Write', value: 'counterparties:write' },
      { name: 'Customer - Read', value: 'customer:read' },
      { name: 'Customer - Write', value: 'customer:write' },
      { name: 'Payments - Read', value: 'payments:read' },
      { name: 'Payments - Write', value: 'payments:write' },
      { name: 'Payments - Write ACH', value: 'payments:write:ach' },
      { name: 'Payments - Write Book', value: 'payments:write:book' },
      { name: 'Payments - Write Counterparty', value: 'payments:write:counterparty' },
      { name: 'Recurring Payments - Read', value: 'recurring-payments:read' },
      { name: 'Recurring Payments - Write', value: 'recurring-payments:write' },
      { name: 'Rewards - Read', value: 'rewards:read' },
      { name: 'Statements - Read', value: 'statements:read' },
      { name: 'Transactions - Read', value: 'transactions:read' },
    ],
    description: 'Permission scopes for the customer token',
  },
  {
    displayName: 'Expires In (Seconds)',
    name: 'expiresIn',
    type: 'number',
    default: 3600,
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['createToken'],
      },
    },
    description: 'Token expiration time in seconds (default: 1 hour)',
  },
];
