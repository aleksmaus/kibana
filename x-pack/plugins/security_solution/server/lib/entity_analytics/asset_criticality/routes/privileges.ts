/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import type { Logger } from '@kbn/core/server';
import { buildSiemResponse } from '@kbn/lists-plugin/server/routes/utils';
import { transformError } from '@kbn/securitysolution-es-utils';
import {
  ASSET_CRITICALITY_PRIVILEGES_URL,
  APP_ID,
  ENABLE_ASSET_CRITICALITY_SETTING,
} from '../../../../../common/constants';
import { checkAndInitAssetCriticalityResources } from '../check_and_init_asset_criticality_resources';
import { getUserAssetCriticalityPrivileges } from '../get_user_asset_criticality_privileges';
import { assertAdvancedSettingsEnabled } from '../../utils/assert_advanced_setting_enabled';
import type { EntityAnalyticsRoutesDeps } from '../../types';

export const assetCriticalityPrivilegesRoute = (
  router: EntityAnalyticsRoutesDeps['router'],
  logger: Logger,
  getStartServices: EntityAnalyticsRoutesDeps['getStartServices']
) => {
  router.versioned
    .get({
      access: 'internal',
      path: ASSET_CRITICALITY_PRIVILEGES_URL,
      options: {
        tags: ['access:securitySolution', `access:${APP_ID}-entity-analytics`],
      },
    })
    .addVersion(
      {
        version: '1',
        validate: false,
      },
      async (context, request, response) => {
        const siemResponse = buildSiemResponse(response);
        try {
          await assertAdvancedSettingsEnabled(await context.core, ENABLE_ASSET_CRITICALITY_SETTING);

          await checkAndInitAssetCriticalityResources(context, logger);

          const [_, { security }] = await getStartServices();
          const body = await getUserAssetCriticalityPrivileges(request, security);

          return response.ok({
            body,
          });
        } catch (e) {
          const error = transformError(e);

          return siemResponse.error({
            statusCode: error.statusCode,
            body: error.message,
          });
        }
      }
    );
};
