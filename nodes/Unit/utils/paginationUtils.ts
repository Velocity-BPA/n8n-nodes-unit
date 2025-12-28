/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { PAGINATION } from '../constants';

/**
 * Unit API uses cursor-based pagination with page[limit] and page[offset]
 */

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface UnitPaginatedResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      total: number;
      limit: number;
      offset: number;
    };
  };
  links?: {
    first?: string;
    prev?: string;
    next?: string;
    last?: string;
  };
}

/**
 * Build pagination query parameters
 */
export function buildPaginationParams(options: PaginationOptions): Record<string, string> {
  const params: Record<string, string> = {};

  if (options.limit) {
    params['page[limit]'] = String(Math.min(options.limit, PAGINATION.maxLimit));
  }

  if (options.offset) {
    params['page[offset]'] = String(options.offset);
  }

  return params;
}

/**
 * Build filter query parameters for Unit API
 */
export function buildFilterParams(
  filters: Record<string, string | number | boolean | string[] | undefined>,
): Record<string, string> {
  const params: Record<string, string> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        params[`filter[${key}]`] = value.join(',');
      } else {
        params[`filter[${key}]`] = String(value);
      }
    }
  }

  return params;
}

/**
 * Build include query parameter for relationships
 */
export function buildIncludeParam(includes: string[]): Record<string, string> {
  if (includes.length === 0) {
    return {};
  }

  return {
    include: includes.join(','),
  };
}

/**
 * Build sort query parameter
 */
export function buildSortParam(sort: string, descending: boolean = false): Record<string, string> {
  return {
    sort: descending ? `-${sort}` : sort,
  };
}

/**
 * Fetch all pages of paginated data
 */
export async function fetchAllPages<T>(
  context: IExecuteFunctions,
  baseOptions: IHttpRequestOptions,
  itemIndex: number = 0,
): Promise<T[]> {
  const allData: T[] = [];
  let offset = 0;
  const limit = PAGINATION.defaultLimit;
  let hasMore = true;

  while (hasMore) {
    const options: IHttpRequestOptions = {
      ...baseOptions,
      qs: {
        ...(baseOptions.qs as Record<string, unknown>),
        'page[limit]': limit,
        'page[offset]': offset,
      },
    };

    const response = (await context.helpers.httpRequestWithAuthentication.call(
      context,
      'unitApi',
      options,
    )) as UnitPaginatedResponse<T>;

    if (response.data) {
      allData.push(...response.data);
    }

    // Check if there are more pages
    if (!response.links?.next || response.data.length < limit) {
      hasMore = false;
    } else {
      offset += limit;
    }

    // Safety limit to prevent infinite loops
    if (allData.length >= 10000) {
      break;
    }
  }

  return allData;
}

/**
 * Parse pagination info from response
 */
export function parsePaginationInfo(response: UnitPaginatedResponse<unknown>): {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
} {
  const pagination = response.meta?.pagination || {
    total: response.data.length,
    limit: PAGINATION.defaultLimit,
    offset: 0,
  };

  return {
    total: pagination.total,
    limit: pagination.limit,
    offset: pagination.offset,
    hasMore: !!response.links?.next,
  };
}

/**
 * Build date range filter
 */
export function buildDateRangeFilter(
  startDate?: string,
  endDate?: string,
): Record<string, string> {
  const params: Record<string, string> = {};

  if (startDate) {
    params['filter[since]'] = startDate;
  }

  if (endDate) {
    params['filter[until]'] = endDate;
  }

  return params;
}

/**
 * Build amount range filter (in cents)
 */
export function buildAmountRangeFilter(
  minAmount?: number,
  maxAmount?: number,
): Record<string, string> {
  const params: Record<string, string> = {};

  if (minAmount !== undefined) {
    params['filter[fromAmount]'] = String(minAmount);
  }

  if (maxAmount !== undefined) {
    params['filter[toAmount]'] = String(maxAmount);
  }

  return params;
}
