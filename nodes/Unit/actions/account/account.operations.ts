/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { unitApiRequest, buildJsonApiBody, buildRelationship } from '../../transport/unitClient';

/**
 * Account Resource Operations
 *
 * Accounts in Unit are the core banking construct. Deposit accounts
 * hold funds and can send/receive payments. Credit accounts provide
 * lines of credit.
 */

export async function createDepositAccount(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as string;
  const depositProduct = this.getNodeParameter('depositProduct', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const attributes: IDataObject = {
    depositProduct,
  };

  if (additionalFields.tags) {
    attributes.tags = additionalFields.tags;
  }
  if (additionalFields.idempotencyKey) {
    attributes.idempotencyKey = additionalFields.idempotencyKey;
  }

  const body = buildJsonApiBody(
    'depositAccount',
    attributes,
    {
      customer: buildRelationship('customer', customerId),
    },
  );

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: '/accounts',
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function createCreditAccount(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as string;
  const creditLimit = this.getNodeParameter('creditLimit', index) as number;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const attributes: IDataObject = {
    creditLimit: creditLimit * 100, // Convert to cents
  };

  if (additionalFields.tags) {
    attributes.tags = additionalFields.tags;
  }

  const body = buildJsonApiBody(
    'creditAccount',
    attributes,
    {
      customer: buildRelationship('customer', customerId),
    },
  );

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: '/accounts',
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function getAccount(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const includeCustomer = this.getNodeParameter('includeCustomer', index, false) as boolean;

  const includes: string[] = [];
  if (includeCustomer) {
    includes.push('customer');
  }

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: `/accounts/${accountId}`,
      includes,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function listAccounts(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const filters = this.getNodeParameter('filters', index) as IDataObject;

  const filterParams: Record<string, string | number | boolean | string[] | undefined> = {};

  if (filters.customerId) {
    filterParams.customerId = filters.customerId as string;
  }
  if (filters.status) {
    filterParams.status = filters.status as string[];
  }
  if (filters.type) {
    filterParams.type = filters.type as string;
  }

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: '/accounts',
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

export async function closeAccount(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const reason = this.getNodeParameter('reason', index) as string;
  const fraudReason = this.getNodeParameter('fraudReason', index, '') as string;

  const attributes: IDataObject = {
    reason,
  };

  if (fraudReason) {
    attributes.fraudReason = fraudReason;
  }

  const body = buildJsonApiBody('accountClose', attributes);

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: `/accounts/${accountId}/close`,
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function freezeAccount(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const reason = this.getNodeParameter('reason', index) as string;
  const reasonText = this.getNodeParameter('reasonText', index, '') as string;

  const attributes: IDataObject = {
    reason,
  };

  if (reasonText) {
    attributes.reasonText = reasonText;
  }

  const body = buildJsonApiBody('accountFreeze', attributes);

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: `/accounts/${accountId}/freeze`,
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function unfreezeAccount(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: `/accounts/${accountId}/unfreeze`,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function reopenAccount(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: `/accounts/${accountId}/reopen`,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function getAccountBalance(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: `/accounts/${accountId}`,
    },
    index,
  );

  const data = response.data as IDataObject;
  const attributes = data.attributes as IDataObject;

  return [{
    json: {
      accountId,
      balance: (attributes.balance as number) / 100,
      available: (attributes.available as number) / 100,
      hold: (attributes.hold as number) / 100,
      currency: attributes.currency || 'USD',
    },
  }];
}

export async function getAccountLimits(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: `/accounts/${accountId}/limits`,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function updateAccount(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

  const attributes: IDataObject = {};

  if (updateFields.tags) {
    attributes.tags = updateFields.tags;
  }
  if (updateFields.depositProduct) {
    attributes.depositProduct = updateFields.depositProduct;
  }

  const body = buildJsonApiBody('depositAccount', attributes, undefined, accountId);

  const response = await unitApiRequest.call(
    this,
    {
      method: 'PATCH',
      endpoint: `/accounts/${accountId}`,
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function getAccountsByCustomer(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as string;

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: '/accounts',
      filters: { customerId },
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function getAccountTransactions(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

  const filterParams: Record<string, string | number | boolean | string[] | undefined> = {
    accountId,
  };

  if (filters.since) {
    filterParams.since = filters.since as string;
  }
  if (filters.until) {
    filterParams.until = filters.until as string;
  }
  if (filters.type) {
    filterParams.type = filters.type as string[];
  }

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: '/transactions',
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

export async function getAccountStatement(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const period = this.getNodeParameter('period', index) as string;

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: '/statements',
      filters: {
        accountId,
        period,
      },
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function getEndOfDayBalances(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const accountId = this.getNodeParameter('accountId', index) as string;
  const since = this.getNodeParameter('since', index, '') as string;
  const until = this.getNodeParameter('until', index, '') as string;

  const filterParams: Record<string, string | number | boolean | string[] | undefined> = {
    accountId,
  };

  if (since) {
    filterParams.since = since;
  }
  if (until) {
    filterParams.until = until;
  }

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: `/accounts/${accountId}/end-of-day`,
      filters: filterParams,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}
