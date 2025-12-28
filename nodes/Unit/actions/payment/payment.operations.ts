/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { unitApiRequest, buildJsonApiBody, buildRelationship } from '../../transport/unitClient';
import { toCents } from '../../utils/validationUtils';

/**
 * Payment Resource Operations
 */

export async function createAchPayment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const counterpartyId = this.getNodeParameter('counterpartyId', index) as string;
  const amount = this.getNodeParameter('amount', index) as number;
  const direction = this.getNodeParameter('direction', index) as string;
  const description = this.getNodeParameter('description', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const attributes: IDataObject = {
    amount: toCents(amount),
    direction,
    description,
  };

  if (additionalFields.addenda) {
    attributes.addenda = additionalFields.addenda;
  }
  if (additionalFields.secCode) {
    attributes.secCode = additionalFields.secCode;
  }
  if (additionalFields.sameDay) {
    attributes.sameDay = additionalFields.sameDay;
  }
  if (additionalFields.idempotencyKey) {
    attributes.idempotencyKey = additionalFields.idempotencyKey;
  }
  if (additionalFields.tags) {
    attributes.tags = additionalFields.tags;
  }

  const body = buildJsonApiBody(
    'achPayment',
    attributes,
    {
      account: buildRelationship('depositAccount', accountId),
      counterparty: buildRelationship('counterparty', counterpartyId),
    },
  );

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: '/payments',
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function createBookPayment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const counterpartyAccountId = this.getNodeParameter('counterpartyAccountId', index) as string;
  const amount = this.getNodeParameter('amount', index) as number;
  const description = this.getNodeParameter('description', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const attributes: IDataObject = {
    amount: toCents(amount),
    description,
  };

  if (additionalFields.idempotencyKey) {
    attributes.idempotencyKey = additionalFields.idempotencyKey;
  }
  if (additionalFields.tags) {
    attributes.tags = additionalFields.tags;
  }

  const body = buildJsonApiBody(
    'bookPayment',
    attributes,
    {
      account: buildRelationship('depositAccount', accountId),
      counterpartyAccount: buildRelationship('depositAccount', counterpartyAccountId),
    },
  );

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: '/payments',
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function createWirePayment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const counterpartyId = this.getNodeParameter('counterpartyId', index) as string;
  const amount = this.getNodeParameter('amount', index) as number;
  const description = this.getNodeParameter('description', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const attributes: IDataObject = {
    amount: toCents(amount),
    description,
  };

  if (additionalFields.idempotencyKey) {
    attributes.idempotencyKey = additionalFields.idempotencyKey;
  }
  if (additionalFields.tags) {
    attributes.tags = additionalFields.tags;
  }

  const body = buildJsonApiBody(
    'wirePayment',
    attributes,
    {
      account: buildRelationship('depositAccount', accountId),
      counterparty: buildRelationship('counterparty', counterpartyId),
    },
  );

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: '/payments',
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function createCheckPayment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const counterpartyId = this.getNodeParameter('counterpartyId', index) as string;
  const amount = this.getNodeParameter('amount', index) as number;
  const description = this.getNodeParameter('description', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const attributes: IDataObject = {
    amount: toCents(amount),
    description,
  };

  if (additionalFields.memo) {
    attributes.memo = additionalFields.memo;
  }
  if (additionalFields.sendDate) {
    attributes.sendDate = additionalFields.sendDate;
  }
  if (additionalFields.idempotencyKey) {
    attributes.idempotencyKey = additionalFields.idempotencyKey;
  }
  if (additionalFields.tags) {
    attributes.tags = additionalFields.tags;
  }

  const body = buildJsonApiBody(
    'checkPayment',
    attributes,
    {
      account: buildRelationship('depositAccount', accountId),
      counterparty: buildRelationship('counterparty', counterpartyId),
    },
  );

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: '/check-payments',
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function getPayment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const paymentId = this.getNodeParameter('paymentId', index) as string;

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: `/payments/${paymentId}`,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function listPayments(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const filters = this.getNodeParameter('filters', index) as IDataObject;

  const filterParams: Record<string, string | number | boolean | string[] | undefined> = {};

  if (filters.accountId) {
    filterParams.accountId = filters.accountId as string;
  }
  if (filters.customerId) {
    filterParams.customerId = filters.customerId as string;
  }
  if (filters.status) {
    filterParams.status = filters.status as string[];
  }
  if (filters.type) {
    filterParams.type = filters.type as string[];
  }

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: '/payments',
      filters: filterParams,
      pagination: returnAll ? undefined : {
        limit: this.getNodeParameter('limit', index, 100) as number,
        offset: this.getNodeParameter('offset', index, 0) as number,
      },
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function cancelPayment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const paymentId = this.getNodeParameter('paymentId', index) as string;

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: `/payments/${paymentId}/cancel`,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function getPaymentStatus(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const paymentId = this.getNodeParameter('paymentId', index) as string;

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: `/payments/${paymentId}`,
    },
    index,
  );

  const data = response.data as IDataObject;
  const attributes = data.attributes as IDataObject;

  return [{
    json: {
      paymentId,
      status: attributes.status,
      createdAt: attributes.createdAt,
    },
  }];
}

export async function createBatchPayment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const paymentsData = this.getNodeParameter('payments', index) as IDataObject[];

  const payments = paymentsData.map((payment) => ({
    type: 'achPayment',
    attributes: {
      amount: toCents(payment.amount as number),
      direction: payment.direction,
      description: payment.description,
    },
    relationships: {
      counterparty: buildRelationship('counterparty', payment.counterpartyId as string),
    },
  }));

  const body = {
    data: {
      type: 'batchPayment',
      attributes: {},
      relationships: {
        account: buildRelationship('depositAccount', accountId),
      },
    },
    included: payments,
  };

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: '/batch-payments',
      body: body as IDataObject,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function getPaymentsByAccount(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: '/payments',
      filters: { accountId },
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function getPaymentsByCustomer(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as string;

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: '/payments',
      filters: { customerId },
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function updatePayment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const paymentId = this.getNodeParameter('paymentId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

  const attributes: IDataObject = {};

  if (updateFields.tags) {
    attributes.tags = updateFields.tags;
  }

  const body = buildJsonApiBody('payment', attributes, undefined, paymentId);

  const response = await unitApiRequest.call(
    this,
    {
      method: 'PATCH',
      endpoint: `/payments/${paymentId}`,
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}
