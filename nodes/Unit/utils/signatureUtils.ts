/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';

/**
 * Verify Unit webhook signature
 *
 * Unit signs webhooks using HMAC-SHA256 with the webhook secret.
 * The signature is sent in the X-Unit-Signature header.
 *
 * @param payload - The raw webhook payload as a string
 * @param signature - The signature from X-Unit-Signature header
 * @param secret - The webhook secret configured in Unit dashboard
 * @returns boolean indicating if signature is valid
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  if (!payload || !signature || !secret) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex'),
    );
  } catch {
    return false;
  }
}

/**
 * Generate a webhook signature for testing
 *
 * @param payload - The webhook payload as a string
 * @param secret - The webhook secret
 * @returns The generated signature
 */
export function generateWebhookSignature(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
}

/**
 * Parse Unit webhook payload
 *
 * @param payload - The raw webhook payload
 * @returns Parsed webhook event
 */
export function parseWebhookPayload(payload: string): UnitWebhookEvent {
  try {
    return JSON.parse(payload) as UnitWebhookEvent;
  } catch (error) {
    throw new Error(`Failed to parse webhook payload: ${(error as Error).message}`);
  }
}

/**
 * Unit webhook event structure
 */
export interface UnitWebhookEvent {
  data: Array<{
    id: string;
    type: string;
    attributes: Record<string, unknown>;
    relationships?: Record<
      string,
      {
        data: {
          type: string;
          id: string;
        };
      }
    >;
  }>;
}

/**
 * Extract event type from webhook payload
 */
export function getWebhookEventType(event: UnitWebhookEvent): string {
  if (event.data && event.data.length > 0) {
    return event.data[0].type;
  }
  return 'unknown';
}

/**
 * Extract resource IDs from webhook relationships
 */
export function extractRelationshipIds(
  event: UnitWebhookEvent,
): Record<string, string> {
  const ids: Record<string, string> = {};

  if (event.data && event.data.length > 0 && event.data[0].relationships) {
    const relationships = event.data[0].relationships;

    for (const [key, value] of Object.entries(relationships)) {
      if (value.data && value.data.id) {
        ids[key] = value.data.id;
      }
    }
  }

  return ids;
}
