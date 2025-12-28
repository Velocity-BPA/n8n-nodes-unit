/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Unit API Endpoints
 *
 * Unit provides two main environments:
 * - Production: For live banking operations
 * - Sandbox: For testing and development
 */

export const UNIT_API_ENDPOINTS = {
  production: 'https://api.unit.co',
  sandbox: 'https://api.s.unit.sh',
} as const;

export const API_VERSION = 'v1';

/**
 * API Resource Paths
 */
export const RESOURCE_PATHS = {
  // Customer & Application
  customers: '/customers',
  applications: '/applications',

  // Accounts
  accounts: '/accounts',
  depositAccounts: '/accounts',
  creditAccounts: '/accounts',

  // Transactions
  transactions: '/transactions',

  // Payments
  payments: '/payments',
  achPayments: '/payments',
  wirePayments: '/payments',
  checkPayments: '/check-payments',
  bookPayments: '/payments',
  batchPayments: '/batch-payments',
  recurringPayments: '/recurring-payments',
  receivedPayments: '/received-payments',

  // Cards
  cards: '/cards',
  authorizations: '/authorizations',
  cardTransactions: '/transactions',

  // Counterparties
  counterparties: '/counterparties',

  // Documents & Statements
  documents: '/documents',
  statements: '/statements',

  // Financial
  rewards: '/rewards',
  fees: '/fees',
  interest: '/interest',
  repayments: '/repayments',

  // Webhooks & Events
  webhooks: '/webhooks',
  events: '/events',

  // Tax
  taxForms: '/tax-forms',

  // Institutions
  institutions: '/institutions',

  // Sandbox
  sandbox: '/sandbox',
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  defaultLimit: 100,
  maxLimit: 1000,
} as const;

export type Environment = keyof typeof UNIT_API_ENDPOINTS;
