/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IWebhookFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { verifyWebhookSignature, parseWebhookPayload, getWebhookEventType } from '../utils/signatureUtils';

/**
 * Webhook Handler for Unit Events
 *
 * Handles incoming webhook requests from Unit, verifies signatures,
 * and parses event data for processing in n8n workflows.
 */

export interface WebhookHandlerOptions {
  verifySignature?: boolean;
}

/**
 * Process incoming Unit webhook
 */
export async function handleUnitWebhook(
  this: IWebhookFunctions,
  options: WebhookHandlerOptions = {},
): Promise<INodeExecutionData[][]> {
  const req = this.getRequestObject();
  const headerData = this.getHeaderData();
  const bodyData = this.getBodyData();

  // Get raw body for signature verification
  const rawBody = typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData);

  // Verify webhook signature if enabled
  if (options.verifySignature !== false) {
    const credentials = await this.getCredentials('unitApi');
    const webhookSecret = credentials.webhookSecret as string;

    if (webhookSecret) {
      const signature = headerData['x-unit-signature'] as string;

      if (!signature) {
        throw new Error('Missing webhook signature header');
      }

      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);

      if (!isValid) {
        throw new Error('Invalid webhook signature');
      }
    }
  }

  // Parse webhook payload
  const event = parseWebhookPayload(rawBody);
  const eventType = getWebhookEventType(event);

  // Transform webhook data to n8n format
  const results: INodeExecutionData[] = event.data.map((item) => ({
    json: {
      eventType,
      id: item.id,
      type: item.type,
      attributes: item.attributes,
      relationships: item.relationships || {},
      receivedAt: new Date().toISOString(),
      headers: {
        'x-unit-signature': headerData['x-unit-signature'],
        'content-type': headerData['content-type'],
      },
    },
  }));

  return [results];
}

/**
 * Get webhook event types for filtering
 */
export function getEventTypeOptions(): Array<{ name: string; value: string }> {
  return [
    // Application Events
    { name: 'Application Created', value: 'application.created' },
    { name: 'Application Pending Review', value: 'application.pendingReview' },
    { name: 'Application Approved', value: 'application.approved' },
    { name: 'Application Denied', value: 'application.denied' },
    { name: 'Application Canceled', value: 'application.canceled' },
    { name: 'Application Document Added', value: 'application.document.added' },

    // Customer Events
    { name: 'Customer Created', value: 'customer.created' },
    { name: 'Customer Updated', value: 'customer.updated' },
    { name: 'Customer Archived', value: 'customer.archived' },
    { name: 'Customer Restored', value: 'customer.restored' },
    { name: 'Authorized User Added', value: 'customer.authorizedUser.added' },
    { name: 'Authorized User Removed', value: 'customer.authorizedUser.removed' },

    // Account Events
    { name: 'Account Created', value: 'account.created' },
    { name: 'Account Closed', value: 'account.closed' },
    { name: 'Account Frozen', value: 'account.frozen' },
    { name: 'Account Unfrozen', value: 'account.unfrozen' },
    { name: 'Account Reopened', value: 'account.reopened' },

    // Transaction Events
    { name: 'Transaction Created', value: 'transaction.created' },
    { name: 'Transaction Updated', value: 'transaction.updated' },

    // Payment Events
    { name: 'Payment Created', value: 'payment.created' },
    { name: 'Payment Pending', value: 'payment.pending' },
    { name: 'Payment Clearing', value: 'payment.clearing' },
    { name: 'Payment Sent', value: 'payment.sent' },
    { name: 'Payment Returned', value: 'payment.returned' },
    { name: 'Payment Canceled', value: 'payment.canceled' },
    { name: 'Payment Rejected', value: 'payment.rejected' },

    // Received Payment Events
    { name: 'Received Payment Created', value: 'receivedPayment.created' },
    { name: 'Received Payment Advanced', value: 'receivedPayment.advanced' },
    { name: 'Received Payment Completed', value: 'receivedPayment.completed' },
    { name: 'Received Payment Returned', value: 'receivedPayment.returned' },

    // Card Events
    { name: 'Card Created', value: 'card.created' },
    { name: 'Card Activated', value: 'card.activated' },
    { name: 'Card Frozen', value: 'card.frozen' },
    { name: 'Card Unfrozen', value: 'card.unfrozen' },
    { name: 'Card Closed', value: 'card.closed' },
    { name: 'Card Shipped', value: 'card.shipped' },
    { name: 'Card Status Changed', value: 'card.statusChanged' },

    // Authorization Events
    { name: 'Authorization Created', value: 'authorization.created' },
    { name: 'Authorization Canceled', value: 'authorization.canceled' },
    { name: 'Authorization Declined', value: 'authorization.declined' },
    { name: 'Authorization Amount Changed', value: 'authorization.amountChanged' },

    // Check Events
    { name: 'Check Deposit Created', value: 'checkDeposit.created' },
    { name: 'Check Deposit Clearing', value: 'checkDeposit.clearing' },
    { name: 'Check Deposit Sent', value: 'checkDeposit.sent' },
    { name: 'Check Deposit Returned', value: 'checkDeposit.returned' },
    { name: 'Check Deposit Rejected', value: 'checkDeposit.rejected' },
    { name: 'Check Payment Created', value: 'checkPayment.created' },
    { name: 'Check Payment Sent', value: 'checkPayment.sent' },
    { name: 'Check Payment Canceled', value: 'checkPayment.canceled' },

    // Statement Events
    { name: 'Statement Created', value: 'statement.created' },

    // Dispute Events
    { name: 'Dispute Created', value: 'dispute.created' },
    { name: 'Dispute Status Changed', value: 'dispute.statusChanged' },

    // Recurring Payment Events
    { name: 'Recurring Payment Created', value: 'recurringPayment.created' },
    { name: 'Recurring Payment Status Changed', value: 'recurringPayment.statusChanged' },

    // Reward Events
    { name: 'Reward Created', value: 'reward.created' },

    // Repayment Events
    { name: 'Repayment Created', value: 'repayment.created' },

    // Document Events
    { name: 'Document Created', value: 'document.created' },
    { name: 'Document Approved', value: 'document.approved' },
    { name: 'Document Rejected', value: 'document.rejected' },

    // Tax Events
    { name: 'Tax Form Created', value: 'taxForm.created' },
  ];
}

/**
 * Filter webhook events by type
 */
export function filterEventsByType(
  events: IDataObject[],
  allowedTypes: string[],
): IDataObject[] {
  if (allowedTypes.length === 0) {
    return events;
  }

  return events.filter((event) => {
    const eventType = event.type as string;
    return allowedTypes.some((allowed) => eventType.startsWith(allowed));
  });
}
