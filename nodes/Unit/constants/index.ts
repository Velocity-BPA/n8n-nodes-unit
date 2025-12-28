/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export * from './endpoints';
export * from './accountTypes';
export * from './transactionTypes';
export * from './paymentTypes';
export * from './eventTypes';

/**
 * Customer Types
 */
export const CUSTOMER_TYPES = {
  individual: 'individualCustomer',
  business: 'businessCustomer',
} as const;

export const CUSTOMER_STATUS = {
  active: 'Active',
  archived: 'Archived',
} as const;

/**
 * Application Types
 */
export const APPLICATION_TYPES = {
  individual: 'individualApplication',
  business: 'businessApplication',
  soleProprietor: 'soleProprietorApplication',
} as const;

export const APPLICATION_STATUS = {
  created: 'Created',
  pending: 'Pending',
  pendingReview: 'PendingReview',
  approved: 'Approved',
  denied: 'Denied',
  canceled: 'Canceled',
} as const;

/**
 * Card Types
 */
export const CARD_TYPES = {
  individualDebitCard: 'individualDebitCard',
  businessDebitCard: 'businessDebitCard',
  individualVirtualDebitCard: 'individualVirtualDebitCard',
  businessVirtualDebitCard: 'businessVirtualDebitCard',
} as const;

export const CARD_STATUS = {
  inactive: 'Inactive',
  active: 'Active',
  stolen: 'Stolen',
  lost: 'Lost',
  frozen: 'Frozen',
  closedByCustomer: 'ClosedByCustomer',
  suspectedFraud: 'SuspectedFraud',
} as const;

/**
 * Counterparty Types
 */
export const COUNTERPARTY_TYPES = {
  achCounterparty: 'achCounterparty',
  plaidCounterparty: 'plaidCounterparty',
} as const;

/**
 * Document Types
 */
export const DOCUMENT_TYPES = {
  addressVerification: 'AddressVerification',
  idDocument: 'IdDocument',
  passport: 'Passport',
  driversLicense: 'DriversLicense',
  socialSecurityCard: 'SocialSecurityCard',
  selfie: 'Selfie',
  ein: 'EIN',
  incorporationDocument: 'IncorporationDocument',
} as const;

/**
 * US States
 */
export const US_STATES = [
  { name: 'Alabama', value: 'AL' },
  { name: 'Alaska', value: 'AK' },
  { name: 'Arizona', value: 'AZ' },
  { name: 'Arkansas', value: 'AR' },
  { name: 'California', value: 'CA' },
  { name: 'Colorado', value: 'CO' },
  { name: 'Connecticut', value: 'CT' },
  { name: 'Delaware', value: 'DE' },
  { name: 'Florida', value: 'FL' },
  { name: 'Georgia', value: 'GA' },
  { name: 'Hawaii', value: 'HI' },
  { name: 'Idaho', value: 'ID' },
  { name: 'Illinois', value: 'IL' },
  { name: 'Indiana', value: 'IN' },
  { name: 'Iowa', value: 'IA' },
  { name: 'Kansas', value: 'KS' },
  { name: 'Kentucky', value: 'KY' },
  { name: 'Louisiana', value: 'LA' },
  { name: 'Maine', value: 'ME' },
  { name: 'Maryland', value: 'MD' },
  { name: 'Massachusetts', value: 'MA' },
  { name: 'Michigan', value: 'MI' },
  { name: 'Minnesota', value: 'MN' },
  { name: 'Mississippi', value: 'MS' },
  { name: 'Missouri', value: 'MO' },
  { name: 'Montana', value: 'MT' },
  { name: 'Nebraska', value: 'NE' },
  { name: 'Nevada', value: 'NV' },
  { name: 'New Hampshire', value: 'NH' },
  { name: 'New Jersey', value: 'NJ' },
  { name: 'New Mexico', value: 'NM' },
  { name: 'New York', value: 'NY' },
  { name: 'North Carolina', value: 'NC' },
  { name: 'North Dakota', value: 'ND' },
  { name: 'Ohio', value: 'OH' },
  { name: 'Oklahoma', value: 'OK' },
  { name: 'Oregon', value: 'OR' },
  { name: 'Pennsylvania', value: 'PA' },
  { name: 'Rhode Island', value: 'RI' },
  { name: 'South Carolina', value: 'SC' },
  { name: 'South Dakota', value: 'SD' },
  { name: 'Tennessee', value: 'TN' },
  { name: 'Texas', value: 'TX' },
  { name: 'Utah', value: 'UT' },
  { name: 'Vermont', value: 'VT' },
  { name: 'Virginia', value: 'VA' },
  { name: 'Washington', value: 'WA' },
  { name: 'West Virginia', value: 'WV' },
  { name: 'Wisconsin', value: 'WI' },
  { name: 'Wyoming', value: 'WY' },
  { name: 'District of Columbia', value: 'DC' },
] as const;

export type CustomerType = (typeof CUSTOMER_TYPES)[keyof typeof CUSTOMER_TYPES];
export type CustomerStatus = (typeof CUSTOMER_STATUS)[keyof typeof CUSTOMER_STATUS];
export type ApplicationType = (typeof APPLICATION_TYPES)[keyof typeof APPLICATION_TYPES];
export type ApplicationStatus = (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];
export type CardType = (typeof CARD_TYPES)[keyof typeof CARD_TYPES];
export type CardStatus = (typeof CARD_STATUS)[keyof typeof CARD_STATUS];
export type CounterpartyType = (typeof COUNTERPARTY_TYPES)[keyof typeof COUNTERPARTY_TYPES];
export type DocumentType = (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES];
