// ** External Imports
import type { HTMLAttributes } from "react";

// ** Core Imports
import type { ChartOrientation } from "@bridge-ui/core/Domain";
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ChartCategoryColors, ChartRootOwnProps } from "@/Utils/Charts";

/**
 * Bar chart root. Compose with `ChartBarSeries` (and `ChartLineSeries` for
 * bar + line charts), `ChartAxis`, `ChartLegend`, and `ChartTooltip`. The
 * plot is drawn by ECharts.
 */
export interface ChartBarOwnProps extends ChartRootOwnProps {
  /**
   * Category labels, or dates for a time axis (bars placed by time).
   * Each series has one value per category.
   */
  categories: Date[] | string[];

  /**
   * Gives each category its own bar color: `true` takes palette entries in
   * category order, an array follows the category order, and a record maps
   * category labels. Every bar series in a category shares the color (use
   * `tone` to tell them apart); the legend shows each series in a neutral
   * color. `ChartLineSeries` keep their own color.
   *
   * @default undefined
   */
  categoryColors?: ChartCategoryColors;

  /**
   * Formats date categories in the tooltip, data table, and summary.
   * Time axis ticks use `ChartAxis` `formatTick` (it receives the timestamp).
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
   * Stacks every bar series under this key (per-series `stack` wins). A
   * `ChartLineSeries` inside stacks only with its own `stack`.
   *
   * @default undefined
   */
  stack?: string;
}

export type ChartBarProps = MergeHtmlProps<
  ChartBarOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
