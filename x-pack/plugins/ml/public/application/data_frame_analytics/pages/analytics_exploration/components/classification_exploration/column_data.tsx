/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useState } from 'react';
import { i18n } from '@kbn/i18n';
import type { EuiDataGridControlColumn } from '@elastic/eui';
import { EuiButtonEmpty, EuiButtonIcon, EuiPopover, EuiText } from '@elastic/eui';
import type { ConfusionMatrix } from '@kbn/ml-data-frame-analytics-utils';

const COL_INITIAL_WIDTH = 165; // in pixels

export interface ConfusionMatrixColumn {
  id: string;
  display?: JSX.Element;
  initialWidth?: number;
}

export interface ConfusionMatrixColumnData {
  actual_class: string;
  actual_class_doc_count: number;
  other: number;
  predicted_classes_count: Record<string, number>;
}

export const ACTUAL_CLASS_ID = 'actual_class';
export const OTHER_CLASS_ID = 'other';
export const MAX_COLUMNS = 6;

export function getColumnData(confusionMatrixData: ConfusionMatrix[]): {
  columns: ConfusionMatrixColumn[];
  columnData: ConfusionMatrixColumnData[];
} {
  const colData: ConfusionMatrixColumnData[] = [];
  const columns: ConfusionMatrixColumn[] = [
    {
      id: ACTUAL_CLASS_ID,
      display: <span />,
      initialWidth: COL_INITIAL_WIDTH,
    },
  ];

  let showOther = false;

  for (const classData of confusionMatrixData) {
    const otherCount = classData.other_predicted_class_doc_count;

    if (otherCount > 0) {
      showOther = true;
    }

    const col: ConfusionMatrixColumnData = {
      actual_class: classData.actual_class,
      actual_class_doc_count: classData.actual_class_doc_count,
      other: otherCount,
      predicted_classes_count: {},
    };

    const predictedClasses = classData.predicted_classes || [];

    columns.push({ id: classData.actual_class, initialWidth: COL_INITIAL_WIDTH });

    for (let i = 0; i < predictedClasses.length; i++) {
      const predictedClass = predictedClasses[i].predicted_class;
      const predictedClassCount = predictedClasses[i].count;
      col.predicted_classes_count[predictedClass] = predictedClassCount;
    }

    colData.push(col);
  }

  if (showOther) {
    columns.push({ id: OTHER_CLASS_ID, initialWidth: COL_INITIAL_WIDTH });
  }

  return { columns, columnData: colData };
}

export function getTrailingControlColumns(
  numColumns: number,
  setShowFullColumns: any
): EuiDataGridControlColumn[] {
  return [
    {
      id: 'actions',
      width: 60,
      headerCellRender: () => <span>{`${numColumns} more`}</span>,
      rowCellRender: function RowCellRender() {
        const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
        return (
          <EuiPopover
            isOpen={isPopoverOpen}
            anchorPosition="upCenter"
            button={
              <EuiButtonIcon
                aria-label={i18n.translate(
                  'xpack.ml.dataframe.analytics.classificationExploration.showActions',
                  {
                    defaultMessage: 'Show actions',
                  }
                )}
                iconType="boxesHorizontal"
                color="text"
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              />
            }
            closePopover={() => setIsPopoverOpen(false)}
            ownFocus={true}
          >
            <EuiButtonEmpty onClick={() => setShowFullColumns(true)}>
              <EuiText size="s" grow={false} textAlign="center">
                {i18n.translate(
                  'xpack.ml.dataframe.analytics.classificationExploration.showAllColumns',
                  {
                    defaultMessage: 'Show all columns',
                  }
                )}
              </EuiText>
            </EuiButtonEmpty>
          </EuiPopover>
        );
      },
    },
  ];
}
