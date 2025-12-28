/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const accountOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['account'],
      },
    },
    options: [
      {
        name: 'Close',
        value: 'close',
        description: 'Close an account',
        action: 'Close an account',
      },
      {
        name: 'Create Credit Account',
        value: 'createCredit',
        description: 'Create a new credit account',
        action: 'Create a credit account',
      },
      {
        name: 'Create Deposit Account',
        value: 'createDeposit',
        description: 'Create a new deposit account',
        action: 'Create a deposit account',
      },
      {
        name: 'Freeze',
        value: 'freeze',
        description: 'Freeze an account',
        action: 'Freeze an account',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get an account by ID',
        action: 'Get an account',
      },
      {
        name: 'Get Balance',
        value: 'getBalance',
        description: 'Get account balance',
        action: 'Get account balance',
      },
      {
        name: 'Get by Customer',
        value: 'getByCustomer',
        description: 'Get accounts by customer ID',
        action: 'Get accounts by customer',
      },
      {
        name: 'Get End of Day Balances',
        value: 'getEndOfDayBalances',
        description: 'Get end of day balance history',
        action: 'Get end of day balances',
      },
      {
        name: 'Get Limits',
        value: 'getLimits',
        description: 'Get account limits',
        action: 'Get account limits',
      },
      {
        name: 'Get Statement',
        value: 'getStatement',
        description: 'Get account statement',
        action: 'Get account statement',
      },
      {
        name: 'Get Transactions',
        value: 'getTransactions',
        description: 'Get transactions for an account',
        action: 'Get account transactions',
      },
      {
        name: 'List',
        value: 'list',
        description: 'List all accounts',
        action: 'List all accounts',
      },
      {
        name: 'Reopen',
        value: 'reopen',
        description: 'Reopen a closed account',
        action: 'Reopen an account',
      },
      {
        name: 'Unfreeze',
        value: 'unfreeze',
        description: 'Unfreeze an account',
        action: 'Unfreeze an account',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an account',
        action: 'Update an account',
      },
    ],
    default: 'get',
  },
];

export const accountFields: INodeProperties[] = [
  // Account ID field
  {
    displayName: 'Account ID',
    name: 'accountId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: [
          'get',
          'close',
          'freeze',
          'unfreeze',
          'reopen',
          'getBalance',
          'getLimits',
          'update',
          'getTransactions',
          'getStatement',
          'getEndOfDayBalances',
        ],
      },
    },
    description: 'The ID of the account',
  },

  // Customer ID for create and list by customer
  {
    displayName: 'Customer ID',
    name: 'customerId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['createDeposit', 'createCredit', 'getByCustomer'],
      },
    },
    description: 'The ID of the customer',
  },

  // Deposit Product
  {
    displayName: 'Deposit Product',
    name: 'depositProduct',
    type: 'string',
    required: true,
    default: 'checking',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['createDeposit'],
      },
    },
    description: 'The deposit product type (e.g., checking, savings)',
  },

  // Credit Limit
  {
    displayName: 'Credit Limit',
    name: 'creditLimit',
    type: 'number',
    required: true,
    default: 1000,
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['createCredit'],
      },
    },
    description: 'Credit limit in dollars',
  },

  // Include Customer
  {
    displayName: 'Include Customer',
    name: 'includeCustomer',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['get'],
      },
    },
    description: 'Whether to include customer details in response',
  },

  // Close Reason
  {
    displayName: 'Reason',
    name: 'reason',
    type: 'options',
    required: true,
    default: 'ByCustomer',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['close'],
      },
    },
    options: [
      { name: 'By Customer', value: 'ByCustomer' },
      { name: 'Fraud', value: 'Fraud' },
      { name: 'Negative Balance', value: 'Negative' },
      { name: 'By Bank', value: 'ByBank' },
      { name: 'Program Change', value: 'ProgramChange' },
    ],
    description: 'Reason for closing the account',
  },
  {
    displayName: 'Fraud Reason',
    name: 'fraudReason',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['close'],
        reason: ['Fraud'],
      },
    },
    description: 'Additional details for fraud-related closure',
  },

  // Freeze Reason
  {
    displayName: 'Reason',
    name: 'reason',
    type: 'options',
    required: true,
    default: 'Other',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['freeze'],
      },
    },
    options: [
      { name: 'Fraud', value: 'Fraud' },
      { name: 'Other', value: 'Other' },
    ],
    description: 'Reason for freezing the account',
  },
  {
    displayName: 'Reason Text',
    name: 'reasonText',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['freeze'],
      },
    },
    description: 'Additional details for the freeze reason',
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
        resource: ['account'],
        operation: ['createDeposit', 'createCredit'],
      },
    },
    options: [
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
        resource: ['account'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'json',
        default: '{}',
        description: 'Custom tags as JSON object',
      },
      {
        displayName: 'Deposit Product',
        name: 'depositProduct',
        type: 'string',
        default: '',
        description: 'New deposit product type',
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
        resource: ['account'],
        operation: ['list', 'getTransactions'],
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
        resource: ['account'],
        operation: ['list', 'getTransactions'],
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
        resource: ['account'],
        operation: ['list', 'getTransactions'],
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
        resource: ['account'],
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'string',
        default: '',
        description: 'Filter by customer ID',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'multiOptions',
        default: [],
        options: [
          { name: 'Open', value: 'Open' },
          { name: 'Closed', value: 'Closed' },
          { name: 'Frozen', value: 'Frozen' },
        ],
        description: 'Filter by account status',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        default: '',
        options: [
          { name: 'All', value: '' },
          { name: 'Deposit Account', value: 'depositAccount' },
          { name: 'Credit Account', value: 'creditAccount' },
        ],
        description: 'Filter by account type',
      },
    ],
  },

  // Transaction Filters
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['getTransactions'],
      },
    },
    options: [
      {
        displayName: 'Since',
        name: 'since',
        type: 'dateTime',
        default: '',
        description: 'Filter transactions after this date',
      },
      {
        displayName: 'Until',
        name: 'until',
        type: 'dateTime',
        default: '',
        description: 'Filter transactions before this date',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'multiOptions',
        default: [],
        options: [
          { name: 'ACH', value: 'originatedAchTransaction' },
          { name: 'Book', value: 'bookTransaction' },
          { name: 'Card Purchase', value: 'purchaseTransaction' },
          { name: 'Wire', value: 'wireTransaction' },
          { name: 'Fee', value: 'feeTransaction' },
          { name: 'Interest', value: 'interestTransaction' },
        ],
        description: 'Filter by transaction type',
      },
    ],
  },

  // Statement Period
  {
    displayName: 'Period',
    name: 'period',
    type: 'string',
    required: true,
    default: '',
    placeholder: '2024-01',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['getStatement'],
      },
    },
    description: 'Statement period in YYYY-MM format',
  },

  // End of Day Date Range
  {
    displayName: 'Since',
    name: 'since',
    type: 'dateTime',
    default: '',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['getEndOfDayBalances'],
      },
    },
    description: 'Start date for balance history',
  },
  {
    displayName: 'Until',
    name: 'until',
    type: 'dateTime',
    default: '',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['getEndOfDayBalances'],
      },
    },
    description: 'End date for balance history',
  },
];
