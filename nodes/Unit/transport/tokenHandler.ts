/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { unitApiRequest, buildJsonApiBody, buildRelationship } from './unitClient';

/**
 * Token Handler for Unit Customer Tokens
 *
 * Customer tokens are scoped API tokens that provide access to a specific
 * customer's data. They are used in customer-facing applications.
 */

export interface CustomerTokenOptions {
  customerId: string;
  scope: string[];
  expiresIn?: number;
  resources?: Array<{
    type: string;
    ids: string[];
  }>;
}

export interface CustomerTokenResponse {
  token: string;
  expiresAt: string;
  customerId: string;
  scope: string[];
}

/**
 * Create a customer token
 */
export async function createCustomerToken(
  this: IExecuteFunctions,
  options: CustomerTokenOptions,
  itemIndex: number = 0,
): Promise<CustomerTokenResponse> {
  const attributes: IDataObject = {
    scope: options.scope.join(' '),
  };

  if (options.expiresIn) {
    attributes.expiresIn = options.expiresIn;
  }

  if (options.resources) {
    attributes.resources = options.resources;
  }

  const body = buildJsonApiBody(
    'customerToken',
    attributes,
    {
      customer: buildRelationship('customer', options.customerId),
    },
  );

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: '/customers/' + options.customerId + '/token',
      body,
    },
    itemIndex,
  );

  const data = response.data as IDataObject;
  const tokenAttributes = data.attributes as IDataObject;

  return {
    token: tokenAttributes.token as string,
    expiresAt: tokenAttributes.expiresAt as string,
    customerId: options.customerId,
    scope: options.scope,
  };
}

/**
 * Verify a customer token
 */
export async function verifyCustomerToken(
  this: IExecuteFunctions,
  token: string,
  itemIndex: number = 0,
): Promise<{
  valid: boolean;
  customerId?: string;
  scope?: string[];
  expiresAt?: string;
}> {
  try {
    const response = await unitApiRequest.call(
      this,
      {
        method: 'GET',
        endpoint: '/customers/token/verify',
        qs: { token },
      },
      itemIndex,
    );

    const data = response.data as IDataObject;
    const attributes = data.attributes as IDataObject;
    const relationships = data.relationships as IDataObject;
    const customerData = relationships?.customer as IDataObject;
    const customerInfo = customerData?.data as IDataObject;

    return {
      valid: true,
      customerId: customerInfo?.id as string,
      scope: (attributes.scope as string)?.split(' '),
      expiresAt: attributes.expiresAt as string,
    };
  } catch {
    return { valid: false };
  }
}

/**
 * Available customer token scopes
 */
export const CUSTOMER_TOKEN_SCOPES = {
  accountsRead: 'accounts:read',
  accountsWrite: 'accounts:write',
  transactionsRead: 'transactions:read',
  paymentsRead: 'payments:read',
  paymentsWrite: 'payments:write',
  paymentsWriteCounterparty: 'payments:write:counterparty',
  paymentsWriteAch: 'payments:write:ach',
  paymentsWriteBook: 'payments:write:book',
  cardsRead: 'cards:read',
  cardsWrite: 'cards:write',
  cardsSensitiveRead: 'cards:sensitive:read',
  counterpartiesRead: 'counterparties:read',
  counterpartiesWrite: 'counterparties:write',
  statementsRead: 'statements:read',
  customerRead: 'customer:read',
  customerWrite: 'customer:write',
  checkDepositsRead: 'check-deposits:read',
  checkDepositsWrite: 'check-deposits:write',
  recurringPaymentsRead: 'recurring-payments:read',
  recurringPaymentsWrite: 'recurring-payments:write',
  rewardsRead: 'rewards:read',
} as const;

export type CustomerTokenScope = (typeof CUSTOMER_TOKEN_SCOPES)[keyof typeof CUSTOMER_TOKEN_SCOPES];

/**
 * Get scope options for n8n UI
 */
export function getScopeOptions(): Array<{ name: string; value: string }> {
  return [
    { name: 'Accounts - Read', value: 'accounts:read' },
    { name: 'Accounts - Write', value: 'accounts:write' },
    { name: 'Transactions - Read', value: 'transactions:read' },
    { name: 'Payments - Read', value: 'payments:read' },
    { name: 'Payments - Write', value: 'payments:write' },
    { name: 'Payments - Write Counterparty', value: 'payments:write:counterparty' },
    { name: 'Payments - Write ACH', value: 'payments:write:ach' },
    { name: 'Payments - Write Book', value: 'payments:write:book' },
    { name: 'Cards - Read', value: 'cards:read' },
    { name: 'Cards - Write', value: 'cards:write' },
    { name: 'Cards - Sensitive Read', value: 'cards:sensitive:read' },
    { name: 'Counterparties - Read', value: 'counterparties:read' },
    { name: 'Counterparties - Write', value: 'counterparties:write' },
    { name: 'Statements - Read', value: 'statements:read' },
    { name: 'Customer - Read', value: 'customer:read' },
    { name: 'Customer - Write', value: 'customer:write' },
    { name: 'Check Deposits - Read', value: 'check-deposits:read' },
    { name: 'Check Deposits - Write', value: 'check-deposits:write' },
    { name: 'Recurring Payments - Read', value: 'recurring-payments:read' },
    { name: 'Recurring Payments - Write', value: 'recurring-payments:write' },
    { name: 'Rewards - Read', value: 'rewards:read' },
  ];
}
