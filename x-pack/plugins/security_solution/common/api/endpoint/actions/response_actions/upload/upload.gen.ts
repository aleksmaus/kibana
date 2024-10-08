/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 *
 * info:
 *   title: File Upload Schema
 *   version: 2023-10-31
 */

import { z } from '@kbn/zod';

import { SuccessResponse, BaseActionSchema } from '../../../model/schema/common.gen';

export type UploadRouteRequestBody = z.infer<typeof UploadRouteRequestBody>;
export const UploadRouteRequestBody = BaseActionSchema.merge(
  z.object({
    parameters: z.object({
      overwrite: z.boolean().optional().default(false),
    }),
    file: z.string(),
  })
);

export type EndpointUploadActionRequestBody = z.infer<typeof EndpointUploadActionRequestBody>;
export const EndpointUploadActionRequestBody = UploadRouteRequestBody;
export type EndpointUploadActionRequestBodyInput = z.input<typeof EndpointUploadActionRequestBody>;

export type EndpointUploadActionResponse = z.infer<typeof EndpointUploadActionResponse>;
export const EndpointUploadActionResponse = SuccessResponse;
