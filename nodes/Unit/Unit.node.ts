/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Customer operations
import {
  createIndividualCustomer,
  createBusinessCustomer,
  getCustomer,
  updateCustomer,
  listCustomers,
  archiveCustomer,
  restoreCustomer,
  getCustomerByEmail,
  addAuthorizedUsers,
  removeAuthorizedUsers,
  getCustomerLimits,
  getCustomerTags,
  updateCustomerTags,
  getCustomerToken,
} from './actions/customer/customer.operations';
import { customerOperations, customerFields } from './actions/customer/customer.description';

// Account operations
import {
  createDepositAccount,
  createCreditAccount,
  getAccount,
  listAccounts,
  closeAccount,
  freezeAccount,
  unfreezeAccount,
  reopenAccount,
  getAccountBalance,
  getAccountLimits,
  updateAccount,
  getAccountsByCustomer,
  getAccountTransactions,
  getAccountStatement,
  getEndOfDayBalances,
} from './actions/account/account.operations';
import { accountOperations, accountFields } from './actions/account/account.description';

// Payment operations
import {
  createAchPayment,
  createBookPayment,
  createWirePayment,
  createCheckPayment,
  getPayment,
  listPayments,
  cancelPayment,
  getPaymentStatus,
  createBatchPayment,
  getPaymentsByAccount,
  getPaymentsByCustomer,
  updatePayment,
} from './actions/payment/payment.operations';
import { paymentOperations, paymentFields } from './actions/payment/payment.description';

// Consolidated operations
import {
  createIndividualApplication,
  getApplication,
  listApplications,
  approveApplication,
  denyApplication,
  getTransaction,
  listTransactions,
  createIndividualDebitCard,
  getCard,
  listCards,
  activateCard,
  freezeCard,
  unfreezeCard,
  closeCard,
  createCounterparty,
  getCounterparty,
  listCounterparties,
  deleteCounterparty,
  getStatement,
  listStatements,
  getStatementPdf,
  createWebhook,
  getWebhook,
  listWebhooks,
  deleteWebhook,
  enableWebhook,
  disableWebhook,
  getEvent,
  listEvents,
  createRecurringPayment,
  getRecurringPayment,
  listRecurringPayments,
  disableRecurringPayment,
  enableRecurringPayment,
  getReceivedPayment,
  listReceivedPayments,
  advanceReceivedPayment,
  createReward,
  getReward,
  listRewards,
  createFee,
  reverseFee,
  createCheckDeposit,
  getCheckDeposit,
  listCheckDeposits,
  getDocument,
  listDocuments,
  simulateAchPayment,
  simulateCardTransaction,
  validateRoutingNumber,
  getApiStatus,
} from './actions/operations';

// Emit licensing notice once on node load
const LICENSING_NOTICE_EMITTED = Symbol.for('unit.licensing.notice');
if (!(global as Record<symbol, boolean>)[LICENSING_NOTICE_EMITTED]) {
  console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);
  (global as Record<symbol, boolean>)[LICENSING_NOTICE_EMITTED] = true;
}

export class Unit implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Unit',
    name: 'unit',
    icon: 'file:unit.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Unit embedded banking platform',
    defaults: {
      name: 'Unit',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'unitApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Account', value: 'account' },
          { name: 'Application', value: 'application' },
          { name: 'Card', value: 'card' },
          { name: 'Check Deposit', value: 'checkDeposit' },
          { name: 'Counterparty', value: 'counterparty' },
          { name: 'Customer', value: 'customer' },
          { name: 'Document', value: 'document' },
          { name: 'Event', value: 'event' },
          { name: 'Fee', value: 'fee' },
          { name: 'Payment', value: 'payment' },
          { name: 'Received Payment', value: 'receivedPayment' },
          { name: 'Recurring Payment', value: 'recurringPayment' },
          { name: 'Reward', value: 'reward' },
          { name: 'Sandbox', value: 'sandbox' },
          { name: 'Statement', value: 'statement' },
          { name: 'Transaction', value: 'transaction' },
          { name: 'Utility', value: 'utility' },
          { name: 'Webhook', value: 'webhook' },
        ],
        default: 'customer',
      },
      // Customer
      ...customerOperations,
      ...customerFields,
      // Account
      ...accountOperations,
      ...accountFields,
      // Payment
      ...paymentOperations,
      ...paymentFields,
      // Application operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['application'] } },
        options: [
          { name: 'Approve', value: 'approve', action: 'Approve an application' },
          { name: 'Create Individual', value: 'createIndividual', action: 'Create individual application' },
          { name: 'Deny', value: 'deny', action: 'Deny an application' },
          { name: 'Get', value: 'get', action: 'Get an application' },
          { name: 'List', value: 'list', action: 'List applications' },
        ],
        default: 'get',
      },
      // Application fields
      {
        displayName: 'Application ID',
        name: 'applicationId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['application'], operation: ['get', 'approve', 'deny'] } },
      },
      {
        displayName: 'Reason',
        name: 'reason',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['application'], operation: ['deny'] } },
      },
      {
        displayName: 'Full Name',
        name: 'fullName',
        type: 'fixedCollection',
        typeOptions: { multipleValues: false },
        default: {},
        displayOptions: { show: { resource: ['application'], operation: ['createIndividual'] } },
        options: [{
          displayName: 'Name',
          name: 'nameFields',
          values: [
            { displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
            { displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
          ],
        }],
      },
      // Transaction operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['transaction'] } },
        options: [
          { name: 'Get', value: 'get', action: 'Get a transaction' },
          { name: 'List', value: 'list', action: 'List transactions' },
        ],
        default: 'list',
      },
      {
        displayName: 'Transaction ID',
        name: 'transactionId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['transaction'], operation: ['get'] } },
      },
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['transaction'], operation: ['get'] } },
      },
      // Card operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['card'] } },
        options: [
          { name: 'Activate', value: 'activate', action: 'Activate a card' },
          { name: 'Close', value: 'close', action: 'Close a card' },
          { name: 'Create Individual Debit', value: 'createIndividualDebit', action: 'Create individual debit card' },
          { name: 'Freeze', value: 'freeze', action: 'Freeze a card' },
          { name: 'Get', value: 'get', action: 'Get a card' },
          { name: 'List', value: 'list', action: 'List cards' },
          { name: 'Unfreeze', value: 'unfreeze', action: 'Unfreeze a card' },
        ],
        default: 'get',
      },
      {
        displayName: 'Card ID',
        name: 'cardId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['card'], operation: ['get', 'activate', 'freeze', 'unfreeze', 'close'] } },
      },
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['card'], operation: ['createIndividualDebit'] } },
      },
      {
        displayName: 'Shipping Address',
        name: 'shippingAddress',
        type: 'fixedCollection',
        typeOptions: { multipleValues: false },
        default: {},
        displayOptions: { show: { resource: ['card'], operation: ['createIndividualDebit'] } },
        options: [{
          displayName: 'Address',
          name: 'addressFields',
          values: [
            { displayName: 'Street', name: 'street', type: 'string', default: '' },
            { displayName: 'City', name: 'city', type: 'string', default: '' },
            { displayName: 'State', name: 'state', type: 'string', default: '' },
            { displayName: 'Postal Code', name: 'postalCode', type: 'string', default: '' },
            { displayName: 'Country', name: 'country', type: 'string', default: 'US' },
          ],
        }],
      },
      // Counterparty operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['counterparty'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a counterparty' },
          { name: 'Delete', value: 'delete', action: 'Delete a counterparty' },
          { name: 'Get', value: 'get', action: 'Get a counterparty' },
          { name: 'List', value: 'list', action: 'List counterparties' },
        ],
        default: 'list',
      },
      {
        displayName: 'Counterparty ID',
        name: 'counterpartyId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['counterparty'], operation: ['get', 'delete'] } },
      },
      {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['counterparty'], operation: ['create', 'list'] } },
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['counterparty'], operation: ['create'] } },
      },
      {
        displayName: 'Routing Number',
        name: 'routingNumber',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['counterparty'], operation: ['create'] } },
      },
      {
        displayName: 'Account Number',
        name: 'accountNumber',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['counterparty'], operation: ['create'] } },
      },
      {
        displayName: 'Account Type',
        name: 'accountType',
        type: 'options',
        required: true,
        default: 'Checking',
        displayOptions: { show: { resource: ['counterparty'], operation: ['create'] } },
        options: [
          { name: 'Checking', value: 'Checking' },
          { name: 'Savings', value: 'Savings' },
        ],
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        required: true,
        default: 'Business',
        displayOptions: { show: { resource: ['counterparty'], operation: ['create'] } },
        options: [
          { name: 'Business', value: 'Business' },
          { name: 'Person', value: 'Person' },
        ],
      },
      // Statement operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['statement'] } },
        options: [
          { name: 'Get', value: 'get', action: 'Get a statement' },
          { name: 'Get PDF', value: 'getPdf', action: 'Get statement PDF' },
          { name: 'List', value: 'list', action: 'List statements' },
        ],
        default: 'list',
      },
      {
        displayName: 'Statement ID',
        name: 'statementId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['statement'], operation: ['get', 'getPdf'] } },
      },
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['statement'], operation: ['list'] } },
      },
      // Webhook operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['webhook'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a webhook' },
          { name: 'Delete', value: 'delete', action: 'Delete a webhook' },
          { name: 'Disable', value: 'disable', action: 'Disable a webhook' },
          { name: 'Enable', value: 'enable', action: 'Enable a webhook' },
          { name: 'Get', value: 'get', action: 'Get a webhook' },
          { name: 'List', value: 'list', action: 'List webhooks' },
        ],
        default: 'list',
      },
      {
        displayName: 'Webhook ID',
        name: 'webhookId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['webhook'], operation: ['get', 'delete', 'enable', 'disable'] } },
      },
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
      },
      {
        displayName: 'Label',
        name: 'label',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
      },
      {
        displayName: 'Content Type',
        name: 'contentType',
        type: 'options',
        default: 'Json',
        displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
        options: [
          { name: 'JSON', value: 'Json' },
          { name: 'JSON API', value: 'JsonApi' },
        ],
      },
      {
        displayName: 'Token',
        name: 'token',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['webhook'], operation: ['create'] } },
      },
      // Event operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['event'] } },
        options: [
          { name: 'Get', value: 'get', action: 'Get an event' },
          { name: 'List', value: 'list', action: 'List events' },
        ],
        default: 'list',
      },
      {
        displayName: 'Event ID',
        name: 'eventId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['event'], operation: ['get'] } },
      },
      // Recurring Payment operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['recurringPayment'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a recurring payment' },
          { name: 'Disable', value: 'disable', action: 'Disable a recurring payment' },
          { name: 'Enable', value: 'enable', action: 'Enable a recurring payment' },
          { name: 'Get', value: 'get', action: 'Get a recurring payment' },
          { name: 'List', value: 'list', action: 'List recurring payments' },
        ],
        default: 'list',
      },
      {
        displayName: 'Recurring Payment ID',
        name: 'recurringPaymentId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['recurringPayment'], operation: ['get', 'disable', 'enable'] } },
      },
      // Received Payment operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['receivedPayment'] } },
        options: [
          { name: 'Advance', value: 'advance', action: 'Advance a received payment' },
          { name: 'Get', value: 'get', action: 'Get a received payment' },
          { name: 'List', value: 'list', action: 'List received payments' },
        ],
        default: 'list',
      },
      {
        displayName: 'Received Payment ID',
        name: 'receivedPaymentId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['receivedPayment'], operation: ['get', 'advance'] } },
      },
      // Reward operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['reward'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a reward' },
          { name: 'Get', value: 'get', action: 'Get a reward' },
          { name: 'List', value: 'list', action: 'List rewards' },
        ],
        default: 'list',
      },
      {
        displayName: 'Reward ID',
        name: 'rewardId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['reward'], operation: ['get'] } },
      },
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['reward'], operation: ['create'] } },
      },
      {
        displayName: 'Amount',
        name: 'amount',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['reward', 'fee'], operation: ['create'] } },
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['reward', 'fee'], operation: ['create'] } },
      },
      // Fee operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['fee'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a fee' },
          { name: 'Reverse', value: 'reverse', action: 'Reverse a fee' },
        ],
        default: 'create',
      },
      {
        displayName: 'Fee ID',
        name: 'feeId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['fee'], operation: ['reverse'] } },
      },
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['fee'], operation: ['create'] } },
      },
      // Check Deposit operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['checkDeposit'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a check deposit' },
          { name: 'Get', value: 'get', action: 'Get a check deposit' },
          { name: 'List', value: 'list', action: 'List check deposits' },
        ],
        default: 'list',
      },
      {
        displayName: 'Check Deposit ID',
        name: 'checkDepositId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['checkDeposit'], operation: ['get'] } },
      },
      // Document operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['document'] } },
        options: [
          { name: 'Get', value: 'get', action: 'Get a document' },
          { name: 'List', value: 'list', action: 'List documents' },
        ],
        default: 'list',
      },
      {
        displayName: 'Document ID',
        name: 'documentId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['document'], operation: ['get'] } },
      },
      // Sandbox operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['sandbox'] } },
        options: [
          { name: 'Simulate ACH Payment', value: 'simulateAch', action: 'Simulate ACH payment' },
          { name: 'Simulate Card Transaction', value: 'simulateCard', action: 'Simulate card transaction' },
        ],
        default: 'simulateAch',
      },
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['sandbox'], operation: ['simulateAch'] } },
      },
      {
        displayName: 'Card ID',
        name: 'cardId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['sandbox'], operation: ['simulateCard'] } },
      },
      {
        displayName: 'Amount',
        name: 'amount',
        type: 'number',
        required: true,
        default: 100,
        displayOptions: { show: { resource: ['sandbox'] } },
      },
      {
        displayName: 'Direction',
        name: 'direction',
        type: 'options',
        default: 'Credit',
        displayOptions: { show: { resource: ['sandbox'], operation: ['simulateAch'] } },
        options: [
          { name: 'Credit', value: 'Credit' },
          { name: 'Debit', value: 'Debit' },
        ],
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: 'Simulated payment',
        displayOptions: { show: { resource: ['sandbox'], operation: ['simulateAch'] } },
      },
      {
        displayName: 'Merchant Name',
        name: 'merchantName',
        type: 'string',
        default: 'Test Merchant',
        displayOptions: { show: { resource: ['sandbox'], operation: ['simulateCard'] } },
      },
      {
        displayName: 'Merchant Type',
        name: 'merchantType',
        type: 'string',
        default: '5411',
        displayOptions: { show: { resource: ['sandbox'], operation: ['simulateCard'] } },
      },
      // Utility operations
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['utility'] } },
        options: [
          { name: 'Get API Status', value: 'getApiStatus', action: 'Get API status' },
          { name: 'Validate Routing Number', value: 'validateRoutingNumber', action: 'Validate routing number' },
        ],
        default: 'getApiStatus',
      },
      {
        displayName: 'Routing Number',
        name: 'routingNumber',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['utility'], operation: ['validateRoutingNumber'] } },
      },
      // Common filters
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: { show: { resource: ['transaction', 'card', 'event'], operation: ['list'] } },
        options: [
          { displayName: 'Account ID', name: 'accountId', type: 'string', default: '' },
          { displayName: 'Customer ID', name: 'customerId', type: 'string', default: '' },
          { displayName: 'Since', name: 'since', type: 'dateTime', default: '' },
          { displayName: 'Until', name: 'until', type: 'dateTime', default: '' },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i) as string;
        const operation = this.getNodeParameter('operation', i) as string;

        let result: INodeExecutionData[] = [];

        // Customer operations
        if (resource === 'customer') {
          switch (operation) {
            case 'createIndividual':
              result = await createIndividualCustomer.call(this, i);
              break;
            case 'createBusiness':
              result = await createBusinessCustomer.call(this, i);
              break;
            case 'get':
              result = await getCustomer.call(this, i);
              break;
            case 'update':
              result = await updateCustomer.call(this, i);
              break;
            case 'list':
              result = await listCustomers.call(this, i);
              break;
            case 'archive':
              result = await archiveCustomer.call(this, i);
              break;
            case 'restore':
              result = await restoreCustomer.call(this, i);
              break;
            case 'getByEmail':
              result = await getCustomerByEmail.call(this, i);
              break;
            case 'addAuthorizedUsers':
              result = await addAuthorizedUsers.call(this, i);
              break;
            case 'removeAuthorizedUsers':
              result = await removeAuthorizedUsers.call(this, i);
              break;
            case 'getLimits':
              result = await getCustomerLimits.call(this, i);
              break;
            case 'getTags':
              result = await getCustomerTags.call(this, i);
              break;
            case 'updateTags':
              result = await updateCustomerTags.call(this, i);
              break;
            case 'createToken':
              result = await getCustomerToken.call(this, i);
              break;
          }
        }

        // Account operations
        if (resource === 'account') {
          switch (operation) {
            case 'createDeposit':
              result = await createDepositAccount.call(this, i);
              break;
            case 'createCredit':
              result = await createCreditAccount.call(this, i);
              break;
            case 'get':
              result = await getAccount.call(this, i);
              break;
            case 'list':
              result = await listAccounts.call(this, i);
              break;
            case 'close':
              result = await closeAccount.call(this, i);
              break;
            case 'freeze':
              result = await freezeAccount.call(this, i);
              break;
            case 'unfreeze':
              result = await unfreezeAccount.call(this, i);
              break;
            case 'reopen':
              result = await reopenAccount.call(this, i);
              break;
            case 'getBalance':
              result = await getAccountBalance.call(this, i);
              break;
            case 'getLimits':
              result = await getAccountLimits.call(this, i);
              break;
            case 'update':
              result = await updateAccount.call(this, i);
              break;
            case 'getByCustomer':
              result = await getAccountsByCustomer.call(this, i);
              break;
            case 'getTransactions':
              result = await getAccountTransactions.call(this, i);
              break;
            case 'getStatement':
              result = await getAccountStatement.call(this, i);
              break;
            case 'getEndOfDayBalances':
              result = await getEndOfDayBalances.call(this, i);
              break;
          }
        }

        // Payment operations
        if (resource === 'payment') {
          switch (operation) {
            case 'createAch':
              result = await createAchPayment.call(this, i);
              break;
            case 'createBook':
              result = await createBookPayment.call(this, i);
              break;
            case 'createWire':
              result = await createWirePayment.call(this, i);
              break;
            case 'createCheck':
              result = await createCheckPayment.call(this, i);
              break;
            case 'get':
              result = await getPayment.call(this, i);
              break;
            case 'list':
              result = await listPayments.call(this, i);
              break;
            case 'cancel':
              result = await cancelPayment.call(this, i);
              break;
            case 'getStatus':
              result = await getPaymentStatus.call(this, i);
              break;
            case 'createBatch':
              result = await createBatchPayment.call(this, i);
              break;
            case 'getByAccount':
              result = await getPaymentsByAccount.call(this, i);
              break;
            case 'getByCustomer':
              result = await getPaymentsByCustomer.call(this, i);
              break;
            case 'update':
              result = await updatePayment.call(this, i);
              break;
          }
        }

        // Application operations
        if (resource === 'application') {
          switch (operation) {
            case 'createIndividual':
              result = await createIndividualApplication.call(this, i);
              break;
            case 'get':
              result = await getApplication.call(this, i);
              break;
            case 'list':
              result = await listApplications.call(this, i);
              break;
            case 'approve':
              result = await approveApplication.call(this, i);
              break;
            case 'deny':
              result = await denyApplication.call(this, i);
              break;
          }
        }

        // Transaction operations
        if (resource === 'transaction') {
          switch (operation) {
            case 'get':
              result = await getTransaction.call(this, i);
              break;
            case 'list':
              result = await listTransactions.call(this, i);
              break;
          }
        }

        // Card operations
        if (resource === 'card') {
          switch (operation) {
            case 'createIndividualDebit':
              result = await createIndividualDebitCard.call(this, i);
              break;
            case 'get':
              result = await getCard.call(this, i);
              break;
            case 'list':
              result = await listCards.call(this, i);
              break;
            case 'activate':
              result = await activateCard.call(this, i);
              break;
            case 'freeze':
              result = await freezeCard.call(this, i);
              break;
            case 'unfreeze':
              result = await unfreezeCard.call(this, i);
              break;
            case 'close':
              result = await closeCard.call(this, i);
              break;
          }
        }

        // Counterparty operations
        if (resource === 'counterparty') {
          switch (operation) {
            case 'create':
              result = await createCounterparty.call(this, i);
              break;
            case 'get':
              result = await getCounterparty.call(this, i);
              break;
            case 'list':
              result = await listCounterparties.call(this, i);
              break;
            case 'delete':
              result = await deleteCounterparty.call(this, i);
              break;
          }
        }

        // Statement operations
        if (resource === 'statement') {
          switch (operation) {
            case 'get':
              result = await getStatement.call(this, i);
              break;
            case 'list':
              result = await listStatements.call(this, i);
              break;
            case 'getPdf':
              result = await getStatementPdf.call(this, i);
              break;
          }
        }

        // Webhook operations
        if (resource === 'webhook') {
          switch (operation) {
            case 'create':
              result = await createWebhook.call(this, i);
              break;
            case 'get':
              result = await getWebhook.call(this, i);
              break;
            case 'list':
              result = await listWebhooks.call(this, i);
              break;
            case 'delete':
              result = await deleteWebhook.call(this, i);
              break;
            case 'enable':
              result = await enableWebhook.call(this, i);
              break;
            case 'disable':
              result = await disableWebhook.call(this, i);
              break;
          }
        }

        // Event operations
        if (resource === 'event') {
          switch (operation) {
            case 'get':
              result = await getEvent.call(this, i);
              break;
            case 'list':
              result = await listEvents.call(this, i);
              break;
          }
        }

        // Recurring Payment operations
        if (resource === 'recurringPayment') {
          switch (operation) {
            case 'create':
              result = await createRecurringPayment.call(this, i);
              break;
            case 'get':
              result = await getRecurringPayment.call(this, i);
              break;
            case 'list':
              result = await listRecurringPayments.call(this, i);
              break;
            case 'disable':
              result = await disableRecurringPayment.call(this, i);
              break;
            case 'enable':
              result = await enableRecurringPayment.call(this, i);
              break;
          }
        }

        // Received Payment operations
        if (resource === 'receivedPayment') {
          switch (operation) {
            case 'get':
              result = await getReceivedPayment.call(this, i);
              break;
            case 'list':
              result = await listReceivedPayments.call(this, i);
              break;
            case 'advance':
              result = await advanceReceivedPayment.call(this, i);
              break;
          }
        }

        // Reward operations
        if (resource === 'reward') {
          switch (operation) {
            case 'create':
              result = await createReward.call(this, i);
              break;
            case 'get':
              result = await getReward.call(this, i);
              break;
            case 'list':
              result = await listRewards.call(this, i);
              break;
          }
        }

        // Fee operations
        if (resource === 'fee') {
          switch (operation) {
            case 'create':
              result = await createFee.call(this, i);
              break;
            case 'reverse':
              result = await reverseFee.call(this, i);
              break;
          }
        }

        // Check Deposit operations
        if (resource === 'checkDeposit') {
          switch (operation) {
            case 'create':
              result = await createCheckDeposit.call(this, i);
              break;
            case 'get':
              result = await getCheckDeposit.call(this, i);
              break;
            case 'list':
              result = await listCheckDeposits.call(this, i);
              break;
          }
        }

        // Document operations
        if (resource === 'document') {
          switch (operation) {
            case 'get':
              result = await getDocument.call(this, i);
              break;
            case 'list':
              result = await listDocuments.call(this, i);
              break;
          }
        }

        // Sandbox operations
        if (resource === 'sandbox') {
          switch (operation) {
            case 'simulateAch':
              result = await simulateAchPayment.call(this, i);
              break;
            case 'simulateCard':
              result = await simulateCardTransaction.call(this, i);
              break;
          }
        }

        // Utility operations
        if (resource === 'utility') {
          switch (operation) {
            case 'validateRoutingNumber':
              result = await validateRoutingNumber.call(this, i);
              break;
            case 'getApiStatus':
              result = await getApiStatus.call(this, i);
              break;
          }
        }

        returnData.push(...result);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
