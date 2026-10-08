// ** External Imports
import type { HTMLAttributes } from "react";

// ** Core Imports
import type { ChartCurve, ChartStep } from "@bridge-ui/core/Domain";
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ChartRootOwnProps } from "@/Utils/Charts";

/**
 * Line chart root. Compose with `ChartLineSeries`, `ChartAxis`,
 * `ChartLegend`, and `ChartTooltip`. The plot is drawn by ECharts.
 */
export interface ChartLineOwnProps extends ChartRootOwnProps {
  /**
   * Fills the area under every series (per-series `area` wins).
   *
   * @default false
   */
  area?: boolean;

  /**
   * Category labels, or dates for a time axis (points spaced by time).
   * Each series has one value per category.
   */
  categories: Date[] | string[];

  /**
   * Interpolation for every series (per-series `curve` wins).
   *
   * @default "linear"
   */
  curve?: ChartCurve;

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
   * Always draws point symbols.
   *
   * @default false
   */
  showPoints?: boolean;

  /**
   * Compact mode for tables and cards: no axes, grid, or padding, and a
   * 48px default height.
   *
   * @default false
   */
  sparkline?: boolean;

  /**
   * Stacks every series under this key (per-series `stack` wins).
   *
   * @default undefined
   */
  stack?: string;

  /**
   * Step line for every series (per-series `step` wins).
   *
   * @default false
   */
  step?: ChartStep;
}

export type ChartLineProps = MergeHtmlProps<
  ChartLineOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
