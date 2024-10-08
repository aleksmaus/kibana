/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { LegendValue } from '@elastic/charts';
import { getLegendStatsTelemetryEvents } from './legend_stats_telemetry_helpers';

describe('legend_stats_telemetry_helpers', () => {
  it('no events if legend stats are not defined', () => {
    expect(getLegendStatsTelemetryEvents(undefined)).toEqual([]);
  });
  it('ignores single CurrentAndLastValue stat as it does not trigger table view', () => {
    expect(getLegendStatsTelemetryEvents([LegendValue.CurrentAndLastValue])).toEqual([]);
    expect(
      getLegendStatsTelemetryEvents([LegendValue.CurrentAndLastValue, LegendValue.Average])
    ).toEqual([
      'legend_stats',
      'legend_stats_currentAndLastValue',
      'legend_stats_average',
      'legend_stats_amount_2',
    ]);
  });

  it('no events if no changes made in color mapping', () => {
    expect(getLegendStatsTelemetryEvents([LegendValue.Average], [LegendValue.Average])).toEqual([]);
    expect(
      getLegendStatsTelemetryEvents(
        [LegendValue.CurrentAndLastValue, LegendValue.Average],
        [LegendValue.CurrentAndLastValue, LegendValue.Average]
      )
    ).toEqual([]);
  });
  describe('calculates counter events properly', () => {
    it('returns single count event', () => {
      expect(getLegendStatsTelemetryEvents([LegendValue.Average])).toEqual([
        'legend_stats',
        'legend_stats_average',
        'legend_stats_amount_1',
      ]);
    });
    it('returns 2 count event', () => {
      expect(getLegendStatsTelemetryEvents([LegendValue.Average, LegendValue.Count])).toEqual([
        'legend_stats',
        'legend_stats_average',
        'legend_stats_count',
        'legend_stats_amount_2',
      ]);
    });
    it('returns 3 count event', () => {
      expect(
        getLegendStatsTelemetryEvents([
          LegendValue.Average,
          LegendValue.Count,
          LegendValue.CurrentAndLastValue,
        ])
      ).toEqual([
        'legend_stats',
        'legend_stats_average',
        'legend_stats_count',
        'legend_stats_currentAndLastValue',
        'legend_stats_amount_3',
      ]);
    });
    it('returns 4 count event', () => {
      expect(
        getLegendStatsTelemetryEvents([
          LegendValue.CurrentAndLastValue,
          LegendValue.Max,
          LegendValue.Min,
          LegendValue.Average,
        ])
      ).toEqual([
        'legend_stats',
        'legend_stats_currentAndLastValue',
        'legend_stats_max',
        'legend_stats_min',
        'legend_stats_average',
        'legend_stats_amount_4_to_7',
      ]);
    });

    it('returns >8 count event', () => {
      expect(
        getLegendStatsTelemetryEvents([
          LegendValue.CurrentAndLastValue,
          LegendValue.Max,
          LegendValue.Min,
          LegendValue.Average,
          LegendValue.Count,
          LegendValue.Total,
          LegendValue.LastValue,
          LegendValue.FirstValue,
          LegendValue.Median,
        ])
      ).toEqual([
        'legend_stats',
        'legend_stats_currentAndLastValue',
        'legend_stats_max',
        'legend_stats_min',
        'legend_stats_average',
        'legend_stats_count',
        'legend_stats_total',
        'legend_stats_lastValue',
        'legend_stats_firstValue',
        'legend_stats_median',
        'legend_stats_amount_above_8',
      ]);
    });
  });
});
