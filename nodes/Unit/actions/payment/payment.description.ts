/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const paymentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['payment'],
      },
    },
    options: [
      { name: 'Cancel', value: 'cancel', description: 'Cancel a payment', action: 'Cancel a payment' },
      { name: 'Create ACH Payment', value: 'createAch', description: 'Create an ACH payment', action: 'Create an ACH payment' },
      { name: 'Create Batch Payment', value: 'createBatch', description: 'Create batch payments', action: 'Create batch payments' },
      { name: 'Create Book Payment', value: 'createBook', description: 'Create a book transfer', action: 'Create a book payment' },
      { name: 'Create Check Payment', value: 'createCheck', description: 'Create a check payment', action: 'Create a check payment' },
      { name: 'Create Wire Payment', value: 'createWire', description: 'Create a wire transfer', action: 'Create a wire payment' },
      { name: 'Get', value: 'get', description: 'Get a payment by ID', action: 'Get a payment' },
      { name: 'Get by Account', value: 'getByAccount', description: 'Get payments by account', action: 'Get payments by account' },
      { name: 'Get by Customer', value: 'getByCustomer', description: 'Get payments by customer', action: 'Get payments by customer' },
      { name: 'Get Status', value: 'getStatus', description: 'Get payment status', action: 'Get payment status' },
      { name: 'List', value: 'list', description: 'List all payments', action: 'List all payments' },
      { name: 'Update', value: 'update', description: 'Update a payment', action: 'Update a payment' },
    ],
    default: 'get',
  },
];

export const paymentFields: INodeProperties[] = [
  {
    displayName: 'Payment ID',
    name: 'paymentId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['get', 'cancel', 'getStatus', 'update'],
      },
    },
    description: 'The ID of the payment',
  },
  {
    displayName: 'Account ID',
    name: 'accountId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['createAch', 'createBook', 'createWire', 'createCheck', 'createBatch', 'getByAccount'],
      },
    },
    description: 'The source account ID',
  },
  {
    displayName: 'Counterparty ID',
    name: 'counterpartyId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['createAch', 'createWire', 'createCheck'],
      },
    },
    description: 'The counterparty ID for the payment',
  },
  {
    displayName: 'Counterparty Account ID',
    name: 'counterpartyAccountId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['createBook'],
      },
    },
    description: 'The destination Unit account ID for book transfers',
  },
  {
    displayName: 'Customer ID',
    name: 'customerId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['getByCustomer'],
      },
    },
    description: 'The customer ID',
  },
  {
    displayName: 'Amount',
    name: 'amount',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['createAch', 'createBook', 'createWire', 'createCheck'],
      },
    },
    description: 'Payment amount in dollars',
  },
  {
    displayName: 'Direction',
    name: 'direction',
    type: 'options',
    required: true,
    default: 'Credit',
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['createAch'],
      },
    },
    options: [
      { name: 'Credit (Send Money)', value: 'Credit' },
      { name: 'Debit (Pull Money)', value: 'Debit' },
    ],
    description: 'Payment direction',
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['createAch', 'createBook', 'createWire', 'createCheck'],
      },
    },
    description: 'Payment description',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['createAch', 'createBook', 'createWire', 'createCheck'],
      },
    },
    options: [
      { displayName: 'Addenda', name: 'addenda', type: 'string', default: '', description: 'ACH addenda record' },
      { displayName: 'Idempotency Key', name: 'idempotencyKey', type: 'string', default: '' },
      { displayName: 'Memo', name: 'memo', type: 'string', default: '', description: 'Check memo line' },
      { displayName: 'Same Day', name: 'sameDay', type: 'boolean', default: false, description: 'Same-day ACH' },
      { displayName: 'SEC Code', name: 'secCode', type: 'options', default: 'WEB', options: [{ name: 'WEB', value: 'WEB' }, { name: 'PPD', value: 'PPD' }, { name: 'CCD', value: 'CCD' }] },
      { displayName: 'Send Date', name: 'sendDate', type: 'dateTime', default: '' },
      { displayName: 'Tags', name: 'tags', type: 'json', default: '{}' },
    ],
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['payment'], operation: ['list'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 100,
    displayOptions: { show: { resource: ['payment'], operation: ['list'], returnAll: [false] } },
  },
  {
    displayName: 'Offset',
    name: 'offset',
    type: 'number',
    default: 0,
    displayOptions: { show: { resource: ['payment'], operation: ['list'], returnAll: [false] } },
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: { show: { resource: ['payment'], operation: ['list'] } },
    options: [
      { displayName: 'Account ID', name: 'accountId', type: 'string', default: '' },
      { displayName: 'Customer ID', name: 'customerId', type: 'string', default: '' },
      { displayName: 'Status', name: 'status', type: 'multiOptions', default: [], options: [{ name: 'Pending', value: 'Pending' }, { name: 'Sent', value: 'Sent' }, { name: 'Canceled', value: 'Canceled' }, { name: 'Returned', value: 'Returned' }] },
      { displayName: 'Type', name: 'type', type: 'multiOptions', default: [], options: [{ name: 'ACH', value: 'achPayment' }, { name: 'Book', value: 'bookPayment' }, { name: 'Wire', value: 'wirePayment' }] },
    ],
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['payment'], operation: ['update'] } },
    options: [{ displayName: 'Tags', name: 'tags', type: 'json', default: '{}' }],
  },
  {
    displayName: 'Payments',
    name: 'payments',
    type: 'fixedCollection',
    typeOptions: { multipleValues: true },
    default: {},
    displayOptions: { show: { resource: ['payment'], operation: ['createBatch'] } },
    options: [{
      displayName: 'Payment',
      name: 'payment',
      values: [
        { displayName: 'Amount', name: 'amount', type: 'number', default: 0 },
        { displayName: 'Counterparty ID', name: 'counterpartyId', type: 'string', default: '' },
        { displayName: 'Description', name: 'description', type: 'string', default: '' },
        { displayName: 'Direction', name: 'direction', type: 'options', default: 'Credit', options: [{ name: 'Credit', value: 'Credit' }, { name: 'Debit', value: 'Debit' }] },
      ],
    }],
  },
];
