/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Unit Account Types
 *
 * Unit supports various account types for different banking needs:
 * - Deposit accounts (checking/savings)
 * - Credit accounts (lines of credit)
 */

export const ACCOUNT_TYPES = {
  depositAccount: 'depositAccount',
  creditAccount: 'creditAccount',
  batchAccount: 'batchAccount',
} as const;

export const DEPOSIT_ACCOUNT_TYPES = {
  checking: 'checking',
  savings: 'savings',
} as const;

export const ACCOUNT_STATUS = {
  open: 'Open',
  closed: 'Closed',
  frozen: 'Frozen',
} as const;

export const CREDIT_ACCOUNT_STATUS = {
  open: 'Open',
  closed: 'Closed',
  frozen: 'Frozen',
} as const;

export const CLOSE_REASON = {
  byCustomer: 'ByCustomer',
  fraud: 'Fraud',
  negative: 'Negative',
  byBank: 'ByBank',
  programChange: 'ProgramChange',
} as const;

export const FREEZE_REASON = {
  fraud: 'Fraud',
  other: 'Other',
} as const;

export type AccountType = (typeof ACCOUNT_TYPES)[keyof typeof ACCOUNT_TYPES];
export type DepositAccountType = (typeof DEPOSIT_ACCOUNT_TYPES)[keyof typeof DEPOSIT_ACCOUNT_TYPES];
export type AccountStatus = (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];
export type CloseReason = (typeof CLOSE_REASON)[keyof typeof CLOSE_REASON];
export type FreezeReason = (typeof FREEZE_REASON)[keyof typeof FREEZE_REASON];
