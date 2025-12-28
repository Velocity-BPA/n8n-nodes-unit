/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Unit Event Types
 *
 * Unit emits events for various banking operations.
 * These events can be received via webhooks or queried via the API.
 */

export const EVENT_TYPES = {
  // Application Events
  applicationCreated: 'application.created',
  applicationPendingReview: 'application.pendingReview',
  applicationApproved: 'application.approved',
  applicationDenied: 'application.denied',
  applicationCanceled: 'application.canceled',
  applicationDocumentAdded: 'application.document.added',

  // Customer Events
  customerCreated: 'customer.created',
  customerUpdated: 'customer.updated',
  customerArchived: 'customer.archived',
  customerRestored: 'customer.restored',
  authorizedUserAdded: 'customer.authorizedUser.added',
  authorizedUserRemoved: 'customer.authorizedUser.removed',

  // Account Events
  accountCreated: 'account.created',
  accountClosed: 'account.closed',
  accountFrozen: 'account.frozen',
  accountUnfrozen: 'account.unfrozen',
  accountReopened: 'account.reopened',

  // Transaction Events
  transactionCreated: 'transaction.created',
  transactionUpdated: 'transaction.updated',

  // Payment Events
  paymentCreated: 'payment.created',
  paymentPending: 'payment.pending',
  paymentClearing: 'payment.clearing',
  paymentSent: 'payment.sent',
  paymentReturned: 'payment.returned',
  paymentCanceled: 'payment.canceled',
  paymentRejected: 'payment.rejected',

  // ACH Events
  achReceivedPaymentCreated: 'receivedPayment.created',
  achReceivedPaymentAdvanced: 'receivedPayment.advanced',
  achReceivedPaymentCompleted: 'receivedPayment.completed',
  achReceivedPaymentReturned: 'receivedPayment.returned',

  // Wire Events
  wireReceivedPaymentCreated: 'receivedPayment.created',
  wireReceivedPaymentCompleted: 'receivedPayment.completed',

  // Card Events
  cardCreated: 'card.created',
  cardActivated: 'card.activated',
  cardFrozen: 'card.frozen',
  cardUnfrozen: 'card.unfrozen',
  cardClosed: 'card.closed',
  cardShipped: 'card.shipped',
  cardStatusChanged: 'card.statusChanged',

  // Authorization Events
  authorizationCreated: 'authorization.created',
  authorizationCanceled: 'authorization.canceled',
  authorizationDeclined: 'authorization.declined',
  authorizationAmountChanged: 'authorization.amountChanged',

  // Check Events
  checkDepositCreated: 'checkDeposit.created',
  checkDepositClearing: 'checkDeposit.clearing',
  checkDepositSent: 'checkDeposit.sent',
  checkDepositReturned: 'checkDeposit.returned',
  checkDepositRejected: 'checkDeposit.rejected',

  checkPaymentCreated: 'checkPayment.created',
  checkPaymentClearing: 'checkPayment.clearing',
  checkPaymentSent: 'checkPayment.sent',
  checkPaymentCanceled: 'checkPayment.canceled',
  checkPaymentReturned: 'checkPayment.returned',

  // Statement Events
  statementCreated: 'statement.created',

  // Dispute Events
  disputeCreated: 'dispute.created',
  disputeStatusChanged: 'dispute.statusChanged',

  // Recurring Payment Events
  recurringPaymentCreated: 'recurringPayment.created',
  recurringPaymentStatusChanged: 'recurringPayment.statusChanged',

  // Reward Events
  rewardCreated: 'reward.created',

  // Repayment Events
  repaymentCreated: 'repayment.created',

  // Document Events
  documentCreated: 'document.created',
  documentApproved: 'document.approved',
  documentRejected: 'document.rejected',

  // Tax Events
  taxFormCreated: 'taxForm.created',

  // Webhook Events
  webhookEnabled: 'webhook.enabled',
  webhookDisabled: 'webhook.disabled',
} as const;

export const WEBHOOK_EVENT_TYPES = [
  'application.created',
  'application.pendingReview',
  'application.approved',
  'application.denied',
  'application.canceled',
  'application.document.added',
  'customer.created',
  'customer.updated',
  'customer.archived',
  'customer.restored',
  'customer.authorizedUser.added',
  'customer.authorizedUser.removed',
  'account.created',
  'account.closed',
  'account.frozen',
  'account.unfrozen',
  'account.reopened',
  'transaction.created',
  'transaction.updated',
  'payment.created',
  'payment.pending',
  'payment.clearing',
  'payment.sent',
  'payment.returned',
  'payment.canceled',
  'payment.rejected',
  'receivedPayment.created',
  'receivedPayment.advanced',
  'receivedPayment.completed',
  'receivedPayment.returned',
  'card.created',
  'card.activated',
  'card.frozen',
  'card.unfrozen',
  'card.closed',
  'card.shipped',
  'card.statusChanged',
  'authorization.created',
  'authorization.canceled',
  'authorization.declined',
  'authorization.amountChanged',
  'checkDeposit.created',
  'checkDeposit.clearing',
  'checkDeposit.sent',
  'checkDeposit.returned',
  'checkDeposit.rejected',
  'checkPayment.created',
  'checkPayment.clearing',
  'checkPayment.sent',
  'checkPayment.canceled',
  'checkPayment.returned',
  'statement.created',
  'dispute.created',
  'dispute.statusChanged',
  'recurringPayment.created',
  'recurringPayment.statusChanged',
  'reward.created',
  'repayment.created',
  'document.created',
  'document.approved',
  'document.rejected',
  'taxForm.created',
] as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];
export type WebhookEventType = (typeof WEBHOOK_EVENT_TYPES)[number];
