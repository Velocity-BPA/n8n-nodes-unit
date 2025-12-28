/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, ICredentialDataDecryptedObject } from 'n8n-workflow';
import { UNIT_API_ENDPOINTS } from '../constants';

/**
 * Get the base URL for Unit API based on environment
 */
export function getBaseUrl(credentials: ICredentialDataDecryptedObject): string {
  const environment = credentials.environment as string;

  if (environment === 'production') {
    return UNIT_API_ENDPOINTS.production;
  } else if (environment === 'sandbox') {
    return UNIT_API_ENDPOINTS.sandbox;
  } else if (environment === 'custom') {
    return credentials.customUrl as string;
  }

  return UNIT_API_ENDPOINTS.sandbox;
}

/**
 * Get authentication headers for Unit API
 */
export function getAuthHeaders(credentials: ICredentialDataDecryptedObject): Record<string, string> {
  const token = (credentials.apiToken || credentials.customerToken) as string;

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/vnd.api+json',
  };
}

/**
 * Get credentials from execution context
 */
export async function getCredentials(
  context: IExecuteFunctions,
  credentialType: 'unitApi' | 'unitCustomerToken' = 'unitApi',
): Promise<ICredentialDataDecryptedObject> {
  return context.getCredentials(credentialType);
}

/**
 * Mask sensitive data for logging
 */
export function maskToken(token: string): string {
  if (!token || token.length < 8) {
    return '***';
  }
  return `${token.substring(0, 4)}...${token.substring(token.length - 4)}`;
}
