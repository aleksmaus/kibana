/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';
import { PANEL_ID } from '@storybook/addon-actions';

import { registerThemeSwitcherAddon } from '@kbn/storybook/src/lib/register_theme_switcher_addon';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Kibana Controls Storybook',
    brandUrl: 'https://github.com/elastic/kibana/tree/main/src/plugins/controls',
  }),
  showPanel: true.valueOf,
  selectedPanel: PANEL_ID,
});

registerThemeSwitcherAddon();
