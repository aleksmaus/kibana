/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PluginInitializer } from '@kbn/core/server';

export { config } from './config';
export const plugin: PluginInitializer<{}, {}, {}, {}> = async (context) => {
  const { BannersPlugin } = await import('./plugin');
  return new BannersPlugin(context);
};
