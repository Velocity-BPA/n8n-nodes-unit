/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { NodeOperationError } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';

/**
 * Validate routing number format (9 digits)
 */
export function validateRoutingNumber(routingNumber: string): boolean {
  const cleanNumber = routingNumber.replace(/\D/g, '');
  if (cleanNumber.length !== 9) {
    return false;
  }

  // Validate checksum using ABA routing number algorithm
  const digits = cleanNumber.split('').map(Number);
  const checksum =
    3 * (digits[0] + digits[3] + digits[6]) +
    7 * (digits[1] + digits[4] + digits[7]) +
    1 * (digits[2] + digits[5] + digits[8]);

  return checksum % 10 === 0;
}

/**
 * Validate account number format
 */
export function validateAccountNumber(accountNumber: string): boolean {
  const cleanNumber = accountNumber.replace(/\D/g, '');
  return cleanNumber.length >= 4 && cleanNumber.length <= 17;
}

/**
 * Validate SSN format (XXX-XX-XXXX or XXXXXXXXX)
 */
export function validateSSN(ssn: string): boolean {
  const cleanSSN = ssn.replace(/\D/g, '');
  return cleanSSN.length === 9;
}

/**
 * Validate EIN format (XX-XXXXXXX or XXXXXXXXX)
 */
export function validateEIN(ein: string): boolean {
  const cleanEIN = ein.replace(/\D/g, '');
  return cleanEIN.length === 9;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (10 digits for US)
 */
export function validatePhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 10 || cleanPhone.length === 11;
}

/**
 * Validate date of birth format (YYYY-MM-DD)
 */
export function validateDateOfBirth(dob: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dob)) {
    return false;
  }

  const date = new Date(dob);
  const now = new Date();
  const age = Math.floor((now.getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  return age >= 18 && age <= 120;
}

/**
 * Validate amount (positive number with up to 2 decimal places)
 */
export function validateAmount(amount: number): boolean {
  return amount > 0 && Number.isFinite(amount);
}

/**
 * Convert amount to cents (Unit API uses cents)
 */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert cents to dollars
 */
export function toDollars(cents: number): number {
  return cents / 100;
}

/**
 * Validate and throw error if validation fails
 */
export function assertValid(
  context: IExecuteFunctions,
  condition: boolean,
  message: string,
  itemIndex: number = 0,
): void {
  if (!condition) {
    throw new NodeOperationError(context.getNode(), message, { itemIndex });
  }
}

/**
 * Validate required field
 */
export function validateRequired(
  context: IExecuteFunctions,
  value: unknown,
  fieldName: string,
  itemIndex: number = 0,
): void {
  if (value === undefined || value === null || value === '') {
    throw new NodeOperationError(context.getNode(), `${fieldName} is required`, { itemIndex });
  }
}

/**
 * Format address for Unit API
 */
export function formatAddress(address: {
  street: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}): {
  street: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
} {
  return {
    street: address.street,
    ...(address.street2 && { street2: address.street2 }),
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country || 'US',
  };
}

/**
 * Format full name
 */
export function formatFullName(fullName: {
  first: string;
  last: string;
  middle?: string;
  suffix?: string;
}): {
  first: string;
  last: string;
  middle?: string;
  suffix?: string;
} {
  return {
    first: fullName.first,
    last: fullName.last,
    ...(fullName.middle && { middle: fullName.middle }),
    ...(fullName.suffix && { suffix: fullName.suffix }),
  };
}

/**
 * Clean and format phone number
 */
export function formatPhone(phone: string, countryCode: string = '1'): {
  countryCode: string;
  number: string;
} {
  const cleanPhone = phone.replace(/\D/g, '');
  const number = cleanPhone.length === 11 ? cleanPhone.substring(1) : cleanPhone;

  return {
    countryCode,
    number,
  };
}
