/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  IDataObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import { getBaseUrl } from '../utils/authUtils';
import { buildPaginationParams, buildFilterParams, buildIncludeParam } from '../utils/paginationUtils';

/**
 * Unit API Client
 *
 * Handles all HTTP requests to the Unit API with proper authentication,
 * error handling, and response parsing.
 */

export interface UnitApiRequestOptions {
  method: IHttpRequestMethods;
  endpoint: string;
  body?: IDataObject;
  qs?: IDataObject;
  pagination?: {
    limit?: number;
    offset?: number;
  };
  filters?: Record<string, string | number | boolean | string[] | undefined>;
  includes?: string[];
}

export interface UnitApiResponse<T = IDataObject> {
  data: T;
  included?: IDataObject[];
  meta?: IDataObject;
  links?: IDataObject;
}

export interface UnitApiListResponse<T = IDataObject> {
  data: T[];
  included?: IDataObject[];
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
 * Make an authenticated request to the Unit API
 */
export async function unitApiRequest(
  this: IExecuteFunctions,
  options: UnitApiRequestOptions,
  itemIndex: number = 0,
): Promise<UnitApiResponse | UnitApiListResponse> {
  const credentials = await this.getCredentials('unitApi');
  const baseUrl = getBaseUrl(credentials);

  const requestOptions: IHttpRequestOptions = {
    method: options.method,
    url: `${baseUrl}${options.endpoint}`,
    headers: {
      'Content-Type': 'application/vnd.api+json',
    },
    json: true,
    returnFullResponse: false,
  };

  // Build query string
  const qs: IDataObject = { ...(options.qs || {}) };

  // Add pagination
  if (options.pagination) {
    Object.assign(qs, buildPaginationParams(options.pagination));
  }

  // Add filters
  if (options.filters) {
    Object.assign(qs, buildFilterParams(options.filters));
  }

  // Add includes
  if (options.includes && options.includes.length > 0) {
    Object.assign(qs, buildIncludeParam(options.includes));
  }

  if (Object.keys(qs).length > 0) {
    requestOptions.qs = qs;
  }

  // Add body for POST/PATCH/PUT requests
  if (options.body && ['POST', 'PATCH', 'PUT'].includes(options.method)) {
    requestOptions.body = options.body;
  }

  try {
    const response = await this.helpers.httpRequestWithAuthentication.call(
      this,
      'unitApi',
      requestOptions,
    );

    return response as UnitApiResponse | UnitApiListResponse;
  } catch (error) {
    throw handleUnitApiError(this, error, itemIndex);
  }
}

/**
 * Make a request with customer token authentication
 */
export async function unitCustomerApiRequest(
  this: IExecuteFunctions,
  options: UnitApiRequestOptions,
  itemIndex: number = 0,
): Promise<UnitApiResponse | UnitApiListResponse> {
  const credentials = await this.getCredentials('unitCustomerToken');
  const baseUrl = getBaseUrl(credentials);

  const requestOptions: IHttpRequestOptions = {
    method: options.method,
    url: `${baseUrl}${options.endpoint}`,
    headers: {
      'Content-Type': 'application/vnd.api+json',
    },
    json: true,
    returnFullResponse: false,
  };

  // Build query string
  const qs: IDataObject = { ...(options.qs || {}) };

  if (options.pagination) {
    Object.assign(qs, buildPaginationParams(options.pagination));
  }

  if (options.filters) {
    Object.assign(qs, buildFilterParams(options.filters));
  }

  if (options.includes && options.includes.length > 0) {
    Object.assign(qs, buildIncludeParam(options.includes));
  }

  if (Object.keys(qs).length > 0) {
    requestOptions.qs = qs;
  }

  if (options.body && ['POST', 'PATCH', 'PUT'].includes(options.method)) {
    requestOptions.body = options.body;
  }

  try {
    const response = await this.helpers.httpRequestWithAuthentication.call(
      this,
      'unitCustomerToken',
      requestOptions,
    );

    return response as UnitApiResponse | UnitApiListResponse;
  } catch (error) {
    throw handleUnitApiError(this, error, itemIndex);
  }
}

/**
 * Handle Unit API errors and convert to n8n errors
 */
function handleUnitApiError(
  context: IExecuteFunctions,
  error: unknown,
  itemIndex: number,
): NodeApiError | NodeOperationError {
  const err = error as {
    message?: string;
    response?: {
      body?: {
        errors?: Array<{
          title?: string;
          detail?: string;
          status?: string;
          code?: string;
          source?: {
            pointer?: string;
          };
        }>;
      };
      statusCode?: number;
    };
  };

  // Extract error details from Unit API response
  if (err.response?.body?.errors && err.response.body.errors.length > 0) {
    const unitError = err.response.body.errors[0];
    const errorMessage = unitError.detail || unitError.title || 'Unknown Unit API error';
    const errorCode = unitError.code || unitError.status || 'UNKNOWN';

    return new NodeApiError(context.getNode(), err as Error, {
      message: errorMessage,
      description: `Unit API Error (${errorCode}): ${errorMessage}`,
      itemIndex,
    });
  }

  // Handle network or other errors
  if (err.message) {
    return new NodeOperationError(context.getNode(), err.message, { itemIndex });
  }

  return new NodeOperationError(context.getNode(), 'An unknown error occurred', { itemIndex });
}

/**
 * Build JSON:API compliant request body
 */
export function buildJsonApiBody(
  type: string,
  attributes: IDataObject,
  relationships?: Record<string, { data: { type: string; id: string } }>,
  id?: string,
): IDataObject {
  const data: IDataObject = {
    type,
    attributes,
  };

  if (id) {
    data.id = id;
  }

  if (relationships) {
    data.relationships = relationships;
  }

  return { data };
}

/**
 * Build relationship object for JSON:API
 */
export function buildRelationship(
  type: string,
  id: string,
): { data: { type: string; id: string } } {
  return {
    data: {
      type,
      id,
    },
  };
}

/**
 * Extract data from Unit API response
 */
export function extractResponseData<T = IDataObject>(
  response: UnitApiResponse<T> | UnitApiListResponse<T>,
): T | T[] {
  return response.data;
}

/**
 * Extract included resources from Unit API response
 */
export function extractIncluded(
  response: UnitApiResponse | UnitApiListResponse,
): IDataObject[] {
  return response.included || [];
}

/**
 * Find included resource by type and ID
 */
export function findIncluded(
  response: UnitApiResponse | UnitApiListResponse,
  type: string,
  id: string,
): IDataObject | undefined {
  const included = response.included || [];
  return included.find(
    (item) => item.type === type && item.id === id,
  ) as IDataObject | undefined;
}
