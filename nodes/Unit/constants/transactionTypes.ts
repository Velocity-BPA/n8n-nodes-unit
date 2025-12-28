/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Unit Transaction Types
 *
 * Unit supports various transaction types for different banking operations.
 * Transactions can be credits (money in) or debits (money out).
 */

export const TRANSACTION_TYPES = {
  // ACH Transactions
  originatedAch: 'originatedAchTransaction',
  receivedAch: 'receivedAchTransaction',
  returnedAch: 'returnedAchTransaction',
  returnedReceivedAch: 'returnedReceivedAchTransaction',
  dishonoredAch: 'dishonoredAchTransaction',

  // Wire Transactions
  wire: 'wireTransaction',
  receivedWire: 'receivedWireTransaction',

  // Card Transactions
  purchase: 'purchaseTransaction',
  atm: 'atmTransaction',
  cardReversal: 'cardReversalTransaction',
  cardTransaction: 'cardTransaction',

  // Check Transactions
  checkDeposit: 'checkDepositTransaction',
  returnedCheckDeposit: 'returnedCheckDepositTransaction',
  checkPayment: 'checkPaymentTransaction',

  // Book Transactions
  book: 'bookTransaction',

  // Fee & Interest
  fee: 'feeTransaction',
  feeReversal: 'feeReversalTransaction',
  interest: 'interestTransaction',
  interestShare: 'interestShareTransaction',

  // Adjustments
  adjustment: 'adjustmentTransaction',
  releaseAdjustment: 'releaseAdjustmentTransaction',

  // Disputes
  dispute: 'disputeTransaction',
  disputeResolution: 'disputeResolutionTransaction',

  // Other
  reward: 'rewardTransaction',
  billPayment: 'billPaymentTransaction',
  repayment: 'repaymentTransaction',
  sponsorship: 'sponsorshipTransaction',
  network: 'networkTransaction',
} as const;

export const TRANSACTION_DIRECTION = {
  credit: 'Credit',
  debit: 'Debit',
} as const;

export const TRANSACTION_STATUS = {
  pending: 'Pending',
  sent: 'Sent',
  canceled: 'Canceled',
  returned: 'Returned',
} as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];
export type TransactionDirection =
  (typeof TRANSACTION_DIRECTION)[keyof typeof TRANSACTION_DIRECTION];
export type TransactionStatus = (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];
