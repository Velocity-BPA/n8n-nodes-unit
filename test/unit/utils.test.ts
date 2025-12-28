/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  validateRoutingNumber,
  validateAccountNumber,
  validateSSN,
  validateEIN,
  validateEmail,
  validatePhone,
  validateDateOfBirth,
  validateAmount,
  toCents,
  toDollars,
  formatAddress,
  formatFullName,
  formatPhone,
} from '../../nodes/Unit/utils/validationUtils';

import {
  verifyWebhookSignature,
  generateWebhookSignature,
  parseWebhookPayload,
  getWebhookEventType,
} from '../../nodes/Unit/utils/signatureUtils';

import {
  buildPaginationParams,
  buildFilterParams,
  buildIncludeParam,
  buildSortParam,
} from '../../nodes/Unit/utils/paginationUtils';

describe('Validation Utils', () => {
  describe('validateRoutingNumber', () => {
    it('should validate correct routing numbers', () => {
      expect(validateRoutingNumber('021000021')).toBe(true);
      expect(validateRoutingNumber('121000358')).toBe(true);
    });

    it('should reject invalid routing numbers', () => {
      expect(validateRoutingNumber('123456789')).toBe(false);
      expect(validateRoutingNumber('12345678')).toBe(false);
      expect(validateRoutingNumber('1234567890')).toBe(false);
    });
  });

  describe('validateAccountNumber', () => {
    it('should validate correct account numbers', () => {
      expect(validateAccountNumber('1234567890')).toBe(true);
      expect(validateAccountNumber('12345678901234567')).toBe(true);
    });

    it('should reject invalid account numbers', () => {
      expect(validateAccountNumber('123')).toBe(false);
      expect(validateAccountNumber('123456789012345678')).toBe(false);
    });
  });

  describe('validateSSN', () => {
    it('should validate correct SSNs', () => {
      expect(validateSSN('123456789')).toBe(true);
      expect(validateSSN('123-45-6789')).toBe(true);
    });

    it('should reject invalid SSNs', () => {
      expect(validateSSN('12345678')).toBe(false);
      expect(validateSSN('1234567890')).toBe(false);
    });
  });

  describe('validateEIN', () => {
    it('should validate correct EINs', () => {
      expect(validateEIN('123456789')).toBe(true);
      expect(validateEIN('12-3456789')).toBe(true);
    });

    it('should reject invalid EINs', () => {
      expect(validateEIN('12345678')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@invalid.com')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhone('5551234567')).toBe(true);
      expect(validatePhone('15551234567')).toBe(true);
      expect(validatePhone('555-123-4567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('555123456')).toBe(false);
    });
  });

  describe('validateDateOfBirth', () => {
    it('should validate correct dates of birth', () => {
      expect(validateDateOfBirth('1990-01-01')).toBe(true);
      expect(validateDateOfBirth('2000-12-31')).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(validateDateOfBirth('01-01-1990')).toBe(false);
      expect(validateDateOfBirth('invalid')).toBe(false);
    });
  });

  describe('validateAmount', () => {
    it('should validate positive amounts', () => {
      expect(validateAmount(100)).toBe(true);
      expect(validateAmount(0.01)).toBe(true);
      expect(validateAmount(999999.99)).toBe(true);
    });

    it('should reject invalid amounts', () => {
      expect(validateAmount(0)).toBe(false);
      expect(validateAmount(-100)).toBe(false);
      expect(validateAmount(Infinity)).toBe(false);
    });
  });

  describe('toCents', () => {
    it('should convert dollars to cents', () => {
      expect(toCents(1)).toBe(100);
      expect(toCents(10.50)).toBe(1050);
      expect(toCents(0.01)).toBe(1);
      expect(toCents(999.99)).toBe(99999);
    });
  });

  describe('toDollars', () => {
    it('should convert cents to dollars', () => {
      expect(toDollars(100)).toBe(1);
      expect(toDollars(1050)).toBe(10.50);
      expect(toDollars(1)).toBe(0.01);
      expect(toDollars(99999)).toBe(999.99);
    });
  });

  describe('formatAddress', () => {
    it('should format address correctly', () => {
      const address = formatAddress({
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
      });
      expect(address).toEqual({
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'US',
      });
    });

    it('should include optional fields', () => {
      const address = formatAddress({
        street: '123 Main St',
        street2: 'Apt 4B',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'CA',
      });
      expect(address.street2).toBe('Apt 4B');
      expect(address.country).toBe('CA');
    });
  });

  describe('formatFullName', () => {
    it('should format name correctly', () => {
      const name = formatFullName({ first: 'John', last: 'Doe' });
      expect(name).toEqual({ first: 'John', last: 'Doe' });
    });

    it('should include optional fields', () => {
      const name = formatFullName({
        first: 'John',
        last: 'Doe',
        middle: 'Q',
        suffix: 'Jr',
      });
      expect(name.middle).toBe('Q');
      expect(name.suffix).toBe('Jr');
    });
  });

  describe('formatPhone', () => {
    it('should format phone correctly', () => {
      const phone = formatPhone('5551234567');
      expect(phone).toEqual({ countryCode: '1', number: '5551234567' });
    });

    it('should handle phone with country code', () => {
      const phone = formatPhone('15551234567');
      expect(phone).toEqual({ countryCode: '1', number: '5551234567' });
    });
  });
});

describe('Signature Utils', () => {
  const testSecret = 'test-webhook-secret';
  const testPayload = '{"data":[{"id":"1","type":"test.event"}]}';

  describe('generateWebhookSignature', () => {
    it('should generate consistent signatures', () => {
      const sig1 = generateWebhookSignature(testPayload, testSecret);
      const sig2 = generateWebhookSignature(testPayload, testSecret);
      expect(sig1).toBe(sig2);
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should verify valid signatures', () => {
      const signature = generateWebhookSignature(testPayload, testSecret);
      expect(verifyWebhookSignature(testPayload, signature, testSecret)).toBe(true);
    });

    it('should reject invalid signatures', () => {
      expect(verifyWebhookSignature(testPayload, 'invalid', testSecret)).toBe(false);
    });

    it('should reject empty inputs', () => {
      expect(verifyWebhookSignature('', '', '')).toBe(false);
    });
  });

  describe('parseWebhookPayload', () => {
    it('should parse valid JSON', () => {
      const result = parseWebhookPayload(testPayload);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].type).toBe('test.event');
    });

    it('should throw on invalid JSON', () => {
      expect(() => parseWebhookPayload('invalid')).toThrow();
    });
  });

  describe('getWebhookEventType', () => {
    it('should extract event type', () => {
      const event = { data: [{ id: '1', type: 'customer.created', attributes: {} }] };
      expect(getWebhookEventType(event)).toBe('customer.created');
    });

    it('should return unknown for empty data', () => {
      expect(getWebhookEventType({ data: [] })).toBe('unknown');
    });
  });
});

describe('Pagination Utils', () => {
  describe('buildPaginationParams', () => {
    it('should build pagination params', () => {
      const params = buildPaginationParams({ limit: 50, offset: 100 });
      expect(params['page[limit]']).toBe('50');
      expect(params['page[offset]']).toBe('100');
    });

    it('should cap limit at max', () => {
      const params = buildPaginationParams({ limit: 5000 });
      expect(params['page[limit]']).toBe('1000');
    });
  });

  describe('buildFilterParams', () => {
    it('should build filter params', () => {
      const params = buildFilterParams({
        customerId: '123',
        status: 'active',
      });
      expect(params['filter[customerId]']).toBe('123');
      expect(params['filter[status]']).toBe('active');
    });

    it('should handle arrays', () => {
      const params = buildFilterParams({
        status: ['active', 'pending'],
      });
      expect(params['filter[status]']).toBe('active,pending');
    });

    it('should skip undefined values', () => {
      const params = buildFilterParams({
        customerId: '123',
        status: undefined,
      });
      expect(params['filter[customerId]']).toBe('123');
      expect(params['filter[status]']).toBeUndefined();
    });
  });

  describe('buildIncludeParam', () => {
    it('should build include param', () => {
      const params = buildIncludeParam(['customer', 'account']);
      expect(params.include).toBe('customer,account');
    });

    it('should return empty object for empty array', () => {
      const params = buildIncludeParam([]);
      expect(params).toEqual({});
    });
  });

  describe('buildSortParam', () => {
    it('should build ascending sort', () => {
      const params = buildSortParam('createdAt');
      expect(params.sort).toBe('createdAt');
    });

    it('should build descending sort', () => {
      const params = buildSortParam('createdAt', true);
      expect(params.sort).toBe('-createdAt');
    });
  });
});
