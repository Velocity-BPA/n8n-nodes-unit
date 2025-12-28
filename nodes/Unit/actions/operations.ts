/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { unitApiRequest, buildJsonApiBody, buildRelationship } from '../transport/unitClient';
import { toCents } from '../utils/validationUtils';

/**
 * Application Operations
 */
export async function createIndividualApplication(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const fullName = this.getNodeParameter('fullName', index) as IDataObject;
  const email = this.getNodeParameter('email', index) as string;
  const phone = this.getNodeParameter('phone', index) as string;
  const dateOfBirth = this.getNodeParameter('dateOfBirth', index) as string;
  const ssn = this.getNodeParameter('ssn', index) as string;
  const address = this.getNodeParameter('address', index) as IDataObject;

  const attributes: IDataObject = {
    fullName: { first: fullName.firstName, last: fullName.lastName },
    email,
    phone: { countryCode: '1', number: phone.replace(/\D/g, '') },
    dateOfBirth,
    ssn,
    address: {
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country || 'US',
    },
  };

  const body = buildJsonApiBody('individualApplication', attributes);
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: '/applications', body }, index);
  return [{ json: response as IDataObject }];
}

export async function getApplication(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const applicationId = this.getNodeParameter('applicationId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: `/applications/${applicationId}` }, index);
  return [{ json: response as IDataObject }];
}

export async function listApplications(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: '/applications' }, index);
  return [{ json: response as IDataObject }];
}

export async function approveApplication(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const applicationId = this.getNodeParameter('applicationId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: `/applications/${applicationId}/approve` }, index);
  return [{ json: response as IDataObject }];
}

export async function denyApplication(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const applicationId = this.getNodeParameter('applicationId', index) as string;
  const reason = this.getNodeParameter('reason', index) as string;
  const body = buildJsonApiBody('applicationDeny', { reason });
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: `/applications/${applicationId}/deny`, body }, index);
  return [{ json: response as IDataObject }];
}

/**
 * Transaction Operations
 */
export async function getTransaction(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const transactionId = this.getNodeParameter('transactionId', index) as string;
  const accountId = this.getNodeParameter('accountId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: `/accounts/${accountId}/transactions/${transactionId}` }, index);
  return [{ json: response as IDataObject }];
}

export async function listTransactions(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: '/transactions', filters: filters as Record<string, string> }, index);
  return [{ json: response as IDataObject }];
}

/**
 * Card Operations
 */
export async function createIndividualDebitCard(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const shippingAddress = this.getNodeParameter('shippingAddress', index, {}) as IDataObject;
  
  const attributes: IDataObject = {};
  if (Object.keys(shippingAddress).length > 0) {
    attributes.shippingAddress = shippingAddress;
  }

  const body = buildJsonApiBody('individualDebitCard', attributes, {
    account: buildRelationship('depositAccount', accountId),
  });
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: '/cards', body }, index);
  return [{ json: response as IDataObject }];
}

export async function getCard(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const cardId = this.getNodeParameter('cardId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: `/cards/${cardId}` }, index);
  return [{ json: response as IDataObject }];
}

export async function listCards(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: '/cards', filters: filters as Record<string, string> }, index);
  return [{ json: response as IDataObject }];
}

export async function activateCard(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const cardId = this.getNodeParameter('cardId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: `/cards/${cardId}/activate` }, index);
  return [{ json: response as IDataObject }];
}

export async function freezeCard(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const cardId = this.getNodeParameter('cardId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: `/cards/${cardId}/freeze` }, index);
  return [{ json: response as IDataObject }];
}

export async function unfreezeCard(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const cardId = this.getNodeParameter('cardId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: `/cards/${cardId}/unfreeze` }, index);
  return [{ json: response as IDataObject }];
}

export async function closeCard(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const cardId = this.getNodeParameter('cardId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: `/cards/${cardId}/close` }, index);
  return [{ json: response as IDataObject }];
}

/**
 * Counterparty Operations
 */
export async function createCounterparty(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as string;
  const name = this.getNodeParameter('name', index) as string;
  const routingNumber = this.getNodeParameter('routingNumber', index) as string;
  const accountNumber = this.getNodeParameter('accountNumber', index) as string;
  const accountType = this.getNodeParameter('accountType', index) as string;
  const type = this.getNodeParameter('type', index) as string;

  const attributes: IDataObject = { name, routingNumber, accountNumber, accountType, type };
  const body = buildJsonApiBody('achCounterparty', attributes, {
    customer: buildRelationship('customer', customerId),
  });
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: '/counterparties', body }, index);
  return [{ json: response as IDataObject }];
}

export async function getCounterparty(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const counterpartyId = this.getNodeParameter('counterpartyId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: `/counterparties/${counterpartyId}` }, index);
  return [{ json: response as IDataObject }];
}

export async function listCounterparties(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index, '') as string;
  const filters = customerId ? { customerId } : {};
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: '/counterparties', filters }, index);
  return [{ json: response as IDataObject }];
}

export async function deleteCounterparty(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const counterpartyId = this.getNodeParameter('counterpartyId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'DELETE', endpoint: `/counterparties/${counterpartyId}` }, index);
  return [{ json: response as IDataObject }];
}

/**
 * Statement Operations
 */
export async function getStatement(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const statementId = this.getNodeParameter('statementId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: `/statements/${statementId}` }, index);
  return [{ json: response as IDataObject }];
}

export async function listStatements(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index, '') as string;
  const filters = accountId ? { accountId } : {};
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: '/statements', filters }, index);
  return [{ json: response as IDataObject }];
}

export async function getStatementPdf(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const statementId = this.getNodeParameter('statementId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: `/statements/${statementId}/pdf` }, index);
  return [{ json: response as IDataObject }];
}

/**
 * Webhook Operations
 */
export async function createWebhook(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const url = this.getNodeParameter('url', index) as string;
  const label = this.getNodeParameter('label', index) as string;
  const contentType = this.getNodeParameter('contentType', index, 'Json') as string;
  const token = this.getNodeParameter('token', index, '') as string;

  const attributes: IDataObject = { url, label, contentType };
  if (token) attributes.token = token;

  const body = buildJsonApiBody('webhook', attributes);
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: '/webhooks', body }, index);
  return [{ json: response as IDataObject }];
}

export async function getWebhook(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const webhookId = this.getNodeParameter('webhookId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: `/webhooks/${webhookId}` }, index);
  return [{ json: response as IDataObject }];
}

export async function listWebhooks(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: '/webhooks' }, index);
  return [{ json: response as IDataObject }];
}

export async function deleteWebhook(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const webhookId = this.getNodeParameter('webhookId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'DELETE', endpoint: `/webhooks/${webhookId}` }, index);
  return [{ json: response as IDataObject }];
}

export async function enableWebhook(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const webhookId = this.getNodeParameter('webhookId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: `/webhooks/${webhookId}/enable` }, index);
  return [{ json: response as IDataObject }];
}

export async function disableWebhook(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const webhookId = this.getNodeParameter('webhookId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: `/webhooks/${webhookId}/disable` }, index);
  return [{ json: response as IDataObject }];
}

/**
 * Event Operations
 */
export async function getEvent(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const eventId = this.getNodeParameter('eventId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: `/events/${eventId}` }, index);
  return [{ json: response as IDataObject }];
}

export async function listEvents(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: '/events', filters: filters as Record<string, string> }, index);
  return [{ json: response as IDataObject }];
}

/**
 * Recurring Payment Operations
 */
export async function createRecurringPayment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const counterpartyId = this.getNodeParameter('counterpartyId', index) as string;
  const amount = this.getNodeParameter('amount', index) as number;
  const description = this.getNodeParameter('description', index) as string;
  const schedule = this.getNodeParameter('schedule', index) as IDataObject;

  const attributes: IDataObject = {
    amount: toCents(amount),
    description,
    schedule: {
      interval: schedule.interval,
      dayOfMonth: schedule.dayOfMonth,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    },
  };

  const body = buildJsonApiBody('recurringCreditAchPayment', attributes, {
    account: buildRelationship('depositAccount', accountId),
    counterparty: buildRelationship('counterparty', counterpartyId),
  });
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: '/recurring-payments', body }, index);
  return [{ json: response as IDataObject }];
}

export async function getRecurringPayment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const recurringPaymentId = this.getNodeParameter('recurringPaymentId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: `/recurring-payments/${recurringPaymentId}` }, index);
  return [{ json: response as IDataObject }];
}

export async function listRecurringPayments(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: '/recurring-payments' }, index);
  return [{ json: response as IDataObject }];
}

export async function disableRecurringPayment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const recurringPaymentId = this.getNodeParameter('recurringPaymentId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: `/recurring-payments/${recurringPaymentId}/disable` }, index);
  return [{ json: response as IDataObject }];
}

export async function enableRecurringPayment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const recurringPaymentId = this.getNodeParameter('recurringPaymentId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: `/recurring-payments/${recurringPaymentId}/enable` }, index);
  return [{ json: response as IDataObject }];
}

/**
 * Received Payment Operations
 */
export async function getReceivedPayment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const receivedPaymentId = this.getNodeParameter('receivedPaymentId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: `/received-payments/${receivedPaymentId}` }, index);
  return [{ json: response as IDataObject }];
}

export async function listReceivedPayments(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: '/received-payments' }, index);
  return [{ json: response as IDataObject }];
}

export async function advanceReceivedPayment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const receivedPaymentId = this.getNodeParameter('receivedPaymentId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: `/received-payments/${receivedPaymentId}/advance` }, index);
  return [{ json: response as IDataObject }];
}

/**
 * Reward Operations
 */
export async function createReward(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const amount = this.getNodeParameter('amount', index) as number;
  const description = this.getNodeParameter('description', index) as string;

  const attributes: IDataObject = { amount: toCents(amount), description };
  const body = buildJsonApiBody('reward', attributes, {
    receivingAccount: buildRelationship('depositAccount', accountId),
  });
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: '/rewards', body }, index);
  return [{ json: response as IDataObject }];
}

export async function getReward(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const rewardId = this.getNodeParameter('rewardId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: `/rewards/${rewardId}` }, index);
  return [{ json: response as IDataObject }];
}

export async function listRewards(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: '/rewards' }, index);
  return [{ json: response as IDataObject }];
}

/**
 * Fee Operations
 */
export async function createFee(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const amount = this.getNodeParameter('amount', index) as number;
  const description = this.getNodeParameter('description', index) as string;

  const attributes: IDataObject = { amount: toCents(amount), description };
  const body = buildJsonApiBody('fee', attributes, {
    account: buildRelationship('depositAccount', accountId),
  });
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: '/fees', body }, index);
  return [{ json: response as IDataObject }];
}

export async function reverseFee(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const feeId = this.getNodeParameter('feeId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: `/fees/${feeId}/reverse` }, index);
  return [{ json: response as IDataObject }];
}

/**
 * Check Deposit Operations
 */
export async function createCheckDeposit(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const amount = this.getNodeParameter('amount', index) as number;
  const description = this.getNodeParameter('description', index) as string;

  const attributes: IDataObject = { amount: toCents(amount), description };
  const body = buildJsonApiBody('checkDeposit', attributes, {
    account: buildRelationship('depositAccount', accountId),
  });
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: '/check-deposits', body }, index);
  return [{ json: response as IDataObject }];
}

export async function getCheckDeposit(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const checkDepositId = this.getNodeParameter('checkDepositId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: `/check-deposits/${checkDepositId}` }, index);
  return [{ json: response as IDataObject }];
}

export async function listCheckDeposits(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: '/check-deposits' }, index);
  return [{ json: response as IDataObject }];
}

/**
 * Document Operations
 */
export async function getDocument(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const documentId = this.getNodeParameter('documentId', index) as string;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: `/documents/${documentId}` }, index);
  return [{ json: response as IDataObject }];
}

export async function listDocuments(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: '/documents' }, index);
  return [{ json: response as IDataObject }];
}

/**
 * Sandbox Operations
 */
export async function simulateAchPayment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const amount = this.getNodeParameter('amount', index) as number;
  const direction = this.getNodeParameter('direction', index) as string;
  const description = this.getNodeParameter('description', index) as string;

  const attributes: IDataObject = {
    amount: toCents(amount),
    direction,
    description,
  };

  const body = buildJsonApiBody('achReceivedPayment', attributes, {
    account: buildRelationship('depositAccount', accountId),
  });
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: '/sandbox/received-payments', body }, index);
  return [{ json: response as IDataObject }];
}

export async function simulateCardTransaction(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const cardId = this.getNodeParameter('cardId', index) as string;
  const amount = this.getNodeParameter('amount', index) as number;
  const merchantName = this.getNodeParameter('merchantName', index) as string;
  const merchantType = this.getNodeParameter('merchantType', index, '5411') as string;

  const attributes: IDataObject = {
    amount: toCents(amount),
    merchantName,
    merchantType,
  };

  const body = buildJsonApiBody('purchaseTransaction', attributes, {
    card: buildRelationship('card', cardId),
  });
  const response = await unitApiRequest.call(this, { method: 'POST', endpoint: '/sandbox/authorizations', body }, index);
  return [{ json: response as IDataObject }];
}

/**
 * Utility Operations
 */
export async function validateRoutingNumber(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const routingNumber = this.getNodeParameter('routingNumber', index) as string;
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: `/institutions/${routingNumber}` }, index);
  return [{ json: response as IDataObject }];
}

export async function getApiStatus(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const response = await unitApiRequest.call(this, { method: 'GET', endpoint: '/users' }, index);
  return [{ json: { status: 'operational', timestamp: new Date().toISOString() } }];
}
