/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { unitApiRequest, buildJsonApiBody, buildRelationship } from '../../transport/unitClient';
import { formatAddress, formatFullName, formatPhone, toCents } from '../../utils/validationUtils';

/**
 * Customer Resource Operations
 *
 * Customers in Unit represent account holders - either individuals or businesses.
 * They must go through an application process before becoming customers.
 */

export async function createIndividualCustomer(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const firstName = this.getNodeParameter('firstName', index) as string;
  const lastName = this.getNodeParameter('lastName', index) as string;
  const email = this.getNodeParameter('email', index) as string;
  const phone = this.getNodeParameter('phone', index) as string;
  const dateOfBirth = this.getNodeParameter('dateOfBirth', index) as string;
  const ssn = this.getNodeParameter('ssn', index) as string;
  const address = this.getNodeParameter('address', index) as IDataObject;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const attributes: IDataObject = {
    fullName: formatFullName({ first: firstName, last: lastName }),
    email,
    phone: formatPhone(phone),
    dateOfBirth,
    ssn,
    address: formatAddress(address as {
      street: string;
      street2?: string;
      city: string;
      state: string;
      postalCode: string;
      country?: string;
    }),
  };

  if (additionalFields.nationality) {
    attributes.nationality = additionalFields.nationality;
  }
  if (additionalFields.occupation) {
    attributes.occupation = additionalFields.occupation;
  }
  if (additionalFields.tags) {
    attributes.tags = additionalFields.tags;
  }
  if (additionalFields.idempotencyKey) {
    attributes.idempotencyKey = additionalFields.idempotencyKey;
  }

  const body = buildJsonApiBody('individualCustomer', attributes);

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: '/customers',
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function createBusinessCustomer(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('businessName', index) as string;
  const dba = this.getNodeParameter('dba', index, '') as string;
  const ein = this.getNodeParameter('ein', index) as string;
  const entityType = this.getNodeParameter('entityType', index) as string;
  const stateOfIncorporation = this.getNodeParameter('stateOfIncorporation', index) as string;
  const address = this.getNodeParameter('address', index) as IDataObject;
  const phone = this.getNodeParameter('phone', index) as string;
  const contact = this.getNodeParameter('contact', index) as IDataObject;
  const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

  const attributes: IDataObject = {
    name,
    ein,
    entityType,
    stateOfIncorporation,
    address: formatAddress(address as {
      street: string;
      street2?: string;
      city: string;
      state: string;
      postalCode: string;
      country?: string;
    }),
    phone: formatPhone(phone),
    contact: {
      fullName: formatFullName({
        first: contact.firstName as string,
        last: contact.lastName as string,
      }),
      email: contact.email,
      phone: formatPhone(contact.phone as string),
    },
  };

  if (dba) {
    attributes.dba = dba;
  }
  if (additionalFields.website) {
    attributes.website = additionalFields.website;
  }
  if (additionalFields.tags) {
    attributes.tags = additionalFields.tags;
  }

  const body = buildJsonApiBody('businessCustomer', attributes);

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: '/customers',
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function getCustomer(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as string;

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: `/customers/${customerId}`,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function updateCustomer(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

  const attributes: IDataObject = {};

  if (updateFields.email) {
    attributes.email = updateFields.email;
  }
  if (updateFields.phone) {
    attributes.phone = formatPhone(updateFields.phone as string);
  }
  if (updateFields.address) {
    attributes.address = formatAddress(updateFields.address as {
      street: string;
      street2?: string;
      city: string;
      state: string;
      postalCode: string;
      country?: string;
    });
  }
  if (updateFields.tags) {
    attributes.tags = updateFields.tags;
  }

  const body = buildJsonApiBody('individualCustomer', attributes, undefined, customerId);

  const response = await unitApiRequest.call(
    this,
    {
      method: 'PATCH',
      endpoint: `/customers/${customerId}`,
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function listCustomers(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const filters = this.getNodeParameter('filters', index) as IDataObject;

  const filterParams: Record<string, string | number | boolean | string[] | undefined> = {};

  if (filters.email) {
    filterParams.email = filters.email as string;
  }
  if (filters.status) {
    filterParams.status = filters.status as string;
  }
  if (filters.tags) {
    filterParams.tags = filters.tags as string[];
  }

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: '/customers',
      filters: filterParams,
      pagination: returnAll ? undefined : {
        limit: this.getNodeParameter('limit', index, 100) as number,
        offset: this.getNodeParameter('offset', index, 0) as number,
      },
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function archiveCustomer(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as string;
  const reason = this.getNodeParameter('reason', index, '') as string;

  const attributes: IDataObject = {};
  if (reason) {
    attributes.reason = reason;
  }

  const body = buildJsonApiBody('archiveCustomer', attributes);

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: `/customers/${customerId}/archive`,
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function restoreCustomer(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as string;

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: `/customers/${customerId}/restore`,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function getCustomerByEmail(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const email = this.getNodeParameter('email', index) as string;

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: '/customers',
      filters: { email },
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function addAuthorizedUsers(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as string;
  const authorizedUsers = this.getNodeParameter('authorizedUsers', index) as IDataObject[];

  const users = authorizedUsers.map((user) => ({
    fullName: formatFullName({
      first: user.firstName as string,
      last: user.lastName as string,
    }),
    email: user.email,
    phone: formatPhone(user.phone as string),
  }));

  const body = buildJsonApiBody('addAuthorizedUsers', { authorizedUsers: users });

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: `/customers/${customerId}/authorized-users`,
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function removeAuthorizedUsers(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as string;
  const authorizedUserEmails = this.getNodeParameter('authorizedUserEmails', index) as string[];

  const body = buildJsonApiBody('removeAuthorizedUsers', { 
    authorizedUsersEmails: authorizedUserEmails,
  });

  const response = await unitApiRequest.call(
    this,
    {
      method: 'DELETE',
      endpoint: `/customers/${customerId}/authorized-users`,
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function getCustomerLimits(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as string;

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: `/customers/${customerId}/limits`,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function getCustomerTags(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as string;

  const response = await unitApiRequest.call(
    this,
    {
      method: 'GET',
      endpoint: `/customers/${customerId}`,
    },
    index,
  );

  const data = response.data as IDataObject;
  const attributes = data.attributes as IDataObject;

  return [{ json: { tags: attributes.tags || {} } }];
}

export async function updateCustomerTags(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as string;
  const tags = this.getNodeParameter('tags', index) as IDataObject;

  const body = buildJsonApiBody('customer', { tags }, undefined, customerId);

  const response = await unitApiRequest.call(
    this,
    {
      method: 'PATCH',
      endpoint: `/customers/${customerId}`,
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function getCustomerToken(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const customerId = this.getNodeParameter('customerId', index) as string;
  const scope = this.getNodeParameter('scope', index) as string[];
  const expiresIn = this.getNodeParameter('expiresIn', index, 3600) as number;

  const attributes: IDataObject = {
    scope: scope.join(' '),
    expiresIn,
  };

  const body = buildJsonApiBody('customerToken', attributes);

  const response = await unitApiRequest.call(
    this,
    {
      method: 'POST',
      endpoint: `/customers/${customerId}/token`,
      body,
    },
    index,
  );

  return [{ json: response as IDataObject }];
}

export async function createCustomerToken(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  return getCustomerToken.call(this, index);
}
