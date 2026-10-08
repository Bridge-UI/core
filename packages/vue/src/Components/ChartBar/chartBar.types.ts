// ** External Imports
import type { HTMLAttributes } from "vue";

// ** Core Imports
import type { ChartOrientation } from "@bridge-ui/core/Domain";
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ChartRootOwnProps } from "@/Utils/Chart";

/**
 * Bar chart root. Compose with `ChartBarSeries`, `ChartAxis`, `ChartLegend`,
 * and `ChartTooltip`. The plot is drawn by ECharts.
 */
export interface ChartBarOwnProps extends ChartRootOwnProps {
  /**
   * Category labels, or dates for a time axis (bars placed by time).
   * Each series has one value per category.
   */
  categories: Date[] | string[];

  /**
   * Formats date categories in the tooltip, data table, and summary.
   * Tick labels use `ChartAxis` `formatTick`.
   *
   * @default undefined
   */
  formatDate?: (date: Date) => string;

  /**
   * Formats value labels and reference line labels.
   *
   * @default undefined
   */
  formatLabel?: (value: number) => string;

  /**
   * Shows value labels on every series (per-series `labels` wins).
   *
   * @default false
   */
  labels?: boolean;

  /**
   * `horizontal` puts categories on the `y` axis and values on `x`.
   *
   * @default "vertical"
   */
  orientation?: ChartOrientation;

  /**
   * Corner radius (px) on the value end of each bar. In a stack, only the
   * outermost bar is rounded.
   *
   * @default 4
   */
  radius?: number;

  /**
   * Stacks every series under this key (per-series `stack` wins).
   *
   * @default undefined
   */
  stack?: string;
}

export type ChartBarProps = MergeHtmlProps<ChartBarOwnProps, HTMLAttributes>;
