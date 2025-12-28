/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Unit Payment Types
 *
 * Unit supports various payment methods:
 * - ACH: Automated Clearing House (1-3 day settlement)
 * - Wire: Same-day bank transfers
 * - Book: Internal transfers between Unit accounts
 * - Check: Paper check payments
 */

export const PAYMENT_TYPES = {
  achPayment: 'achPayment',
  bookPayment: 'bookPayment',
  wirePayment: 'wirePayment',
  checkPayment: 'checkPayment',
  achReceivedPayment: 'achReceivedPayment',
} as const;

export const ACH_TYPES = {
  debit: 'AchDebit',
  credit: 'AchCredit',
} as const;

export const ACH_SEC_CODES = {
  web: 'WEB', // Internet-initiated/mobile
  ppd: 'PPD', // Prearranged payment and deposit
  ccd: 'CCD', // Cash concentration or disbursement
} as const;

export const PAYMENT_STATUS = {
  pending: 'Pending',
  pendingReview: 'PendingReview',
  rejected: 'Rejected',
  clearing: 'Clearing',
  sent: 'Sent',
  canceled: 'Canceled',
  returned: 'Returned',
} as const;

export const WIRE_TYPE = {
  domestic: 'Domestic',
  international: 'International',
} as const;

export const CHECK_STATUS = {
  new: 'New',
  pending: 'Pending',
  pendingReview: 'PendingReview',
  rejected: 'Rejected',
  clearing: 'Clearing',
  sent: 'Sent',
  canceled: 'Canceled',
  returned: 'Returned',
  inProduction: 'InProduction',
  inDelivery: 'InDelivery',
  delivered: 'Delivered',
  processed: 'Processed',
} as const;

export const RECURRING_PAYMENT_STATUS = {
  active: 'Active',
  completed: 'Completed',
  disabled: 'Disabled',
} as const;

export const RECURRING_PAYMENT_SCHEDULE = {
  weekly: 'Weekly',
  monthly: 'Monthly',
} as const;

export type PaymentType = (typeof PAYMENT_TYPES)[keyof typeof PAYMENT_TYPES];
export type AchType = (typeof ACH_TYPES)[keyof typeof ACH_TYPES];
export type AchSecCode = (typeof ACH_SEC_CODES)[keyof typeof ACH_SEC_CODES];
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
export type WireType = (typeof WIRE_TYPE)[keyof typeof WIRE_TYPE];
export type CheckStatus = (typeof CHECK_STATUS)[keyof typeof CHECK_STATUS];
