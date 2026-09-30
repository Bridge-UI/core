// ** External Imports
import { inject, type ComputedRef, type InjectionKey } from "vue";

// ** Core Imports
import type {
  ChartAnchor,
  ChartAxisPosition,
  ChartRenderAxis,
  ChartSeriesEntry,
  ChartTooltipItem,
} from "@bridge-ui/core/Domain";

/**
 * Registered series with its resolved color and legend visibility.
 */
export type ChartResolvedSeries = ChartSeriesEntry & {
  /**
   * Whether the series is hidden from the legend toggle.
   */
  hidden: boolean;

  /**
   * Computed CSS color (empty until the first layout pass).
   */
  resolvedColor: string;
};

/**
 * Shared chart state for `ChartSeries` / `ChartAxis` / `ChartLegend` /
 * `ChartTooltip` descendants.
 */
export type ChartContextValue = {
  /**
   * Active category index (pointer or keyboard). `null` when idle.
   */
  activeIndex: null | number;

  /**
   * Category labels.
   */
  categories: string[];

  /**
   * Root size (px) used to keep the tooltip inside the chart.
   */
  getBounds: () => { height: number; width: number };

  /**
   * Tooltip anchor for a category, relative to the chart root.
   */
  getTooltipAnchor: (index: number) => null | ChartAnchor;

  /**
   * Emphasizes one series in the plot. `null` clears it.
   */
  highlightSeries: (id: null | string) => void;

  /**
   * Stable id prefix for chart parts.
   */
  id: string;

  /**
   * Locale used to format values.
   */
  locale: string;

  /**
   * Removes axis options registered by `ChartAxis`.
   */
  removeAxis: (position: ChartAxisPosition) => void;

  /**
   * Removes a series by id.
   */
  removeSeries: (id: string) => void;

  /**
   * Registered series in mount order, with colors and visibility.
   */
  series: ChartResolvedSeries[];

  /**
   * Sets axis options (no-op when unchanged).
   */
  setAxis: (
    position: ChartAxisPosition,
    options: Partial<ChartRenderAxis>,
  ) => void;

  /**
   * Shows / hides a series by id.
   */
  toggleSeries: (id: string) => void;

  /**
   * Merged size token classes for legend and tooltip.
   */
  tokenClasses: {
    legend?: string;
    legendItem?: string;
    swatch?: string;
    tooltip?: string;
  };

  /**
   * Tooltip rows for `activeIndex` (visible series, non-null values).
   */
  tooltipItems: ChartTooltipItem[];

  /**
   * Adds or replaces a series by `id`, keeping its position (no-op when unchanged).
   */
  upsertSeries: (entry: ChartSeriesEntry) => void;
};

export const CHART_INJECTION_KEY = Symbol("bridge-chart") as InjectionKey<
  ComputedRef<ChartContextValue>
>;

/**
 * Injects the nearest `Chart` context. Throws when used outside `Chart`.
 */
export function useChartContext(): ComputedRef<ChartContextValue> {
  const context = inject(CHART_INJECTION_KEY, null);

  if (!context) {
    throw new Error("Chart components must be used within a Chart");
  }

  return context;
}
