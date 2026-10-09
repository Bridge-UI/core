// ** External Imports
import { inject, type ComputedRef, type InjectionKey } from "vue";

// ** Core Imports
import type {
  ChartAnchor,
  ChartAxisOptions,
  ChartAxisPosition,
  ChartBarSeriesEntry,
  ChartLineSeriesEntry,
  ChartReference,
  ChartScatterSeriesEntry,
  ChartTooltipContent,
} from "@bridge-ui/core/Domain";

/**
 * Chart family of the nearest root.
 */
export type ChartFamily = "bar" | "pie" | "line" | "funnel" | "scatter";

/**
 * Where `ChartLegend` sits relative to the plot.
 */
export type ChartLegendPosition = "top" | "left" | "right" | "bottom";

/**
 * Series registered by `ChartLineSeries`. Unset options fall back to the
 * `ChartLine` props.
 */
export type ChartLineSeriesRegistration = Pick<
  ChartLineSeriesEntry,
  "id" | "data" | "kind" | "name" | "color"
> &
  Partial<
    Pick<
      ChartLineSeriesEntry,
      | "area"
      | "step"
      | "curve"
      | "stack"
      | "dashed"
      | "labels"
      | "colorBy"
      | "showPoints"
      | "areaOpacity"
      | "colorRanges"
    >
  > & {
    /**
     * Reference lines.
     */
    reference?: ChartReference[];
  };

/**
 * Series registered by `ChartBarSeries`. Unset options fall back to the
 * `ChartBar` props.
 */
export type ChartBarSeriesRegistration = Pick<
  ChartBarSeriesEntry,
  "id" | "data" | "kind" | "name" | "color"
> &
  Partial<
    Pick<
      ChartBarSeriesEntry,
      "tone" | "stack" | "labels" | "colorBy" | "colorRanges"
    >
  > & {
    /**
     * Reference lines.
     */
    reference?: ChartReference[];
  };

/**
 * Series registered by `ChartScatterSeries`.
 */
export type ChartScatterSeriesRegistration = ChartScatterSeriesEntry;

/**
 * Any series a chart root accepts.
 */
export type ChartSeriesRegistration =
  | ChartBarSeriesRegistration
  | ChartLineSeriesRegistration
  | ChartScatterSeriesRegistration;

/**
 * One legend entry: a series or a slice.
 */
export type ChartLegendItem = {
  /**
   * Resolved CSS color (empty until the first layout pass).
   */
  color: string;

  /**
   * Whether the item is hidden with the legend toggle.
   */
  hidden: boolean;

  /**
   * Series or slice id.
   */
  id: string;

  /**
   * Series name or slice label.
   */
  name: string;

  /**
   * Share (`0`–`100`, slices only). `undefined` while hidden.
   */
  percent?: number;

  /**
   * Slice value (slices only).
   */
  value?: number;
};

/**
 * Shared chart state for series, `ChartAxis`, `ChartLegend`, and
 * `ChartTooltip` descendants.
 */
export type ChartContextValue = {
  /**
   * Active item index (pointer or keyboard). `null` when idle.
   */
  activeIndex: null | number;

  /**
   * Chart family of the root.
   */
  family: ChartFamily;

  /**
   * Root size (px) used to keep the tooltip inside the chart.
   */
  getBounds: () => { height: number; width: number };

  /**
   * Tooltip anchor for an item, relative to the chart root.
   */
  getTooltipAnchor: (index: number) => null | ChartAnchor;

  /**
   * Emphasizes one legend item in the plot. `null` clears it.
   */
  highlightItem: (id: null | string) => void;

  /**
   * Stable id prefix for chart parts.
   */
  id: string;

  /**
   * Legend entries in order, with colors and visibility.
   */
  legendItems: ChartLegendItem[];

  /**
   * Locale used to format values.
   */
  locale: string;

  /**
   * Removes axis options registered by `ChartAxis` (axis charts only).
   */
  removeAxis?: (position: ChartAxisPosition) => void;

  /**
   * Removes a series by id (series charts only).
   */
  removeSeries?: (id: string) => void;

  /**
   * Sets axis options (axis charts only; no-op when unchanged).
   */
  setAxis?: (position: ChartAxisPosition, options: ChartAxisOptions) => void;

  /**
   * Tells the root where the legend sits (`null` when it unmounts).
   */
  setLegendPosition: (position: null | ChartLegendPosition) => void;

  /**
   * Shows / hides a legend item by id.
   */
  toggleItem: (id: string) => void;

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
   * Tooltip content for `activeIndex`. `null` when idle or empty.
   */
  tooltip: null | ChartTooltipContent;

  /**
   * Adds or replaces a series by `id`, keeping its position (series charts
   * only; no-op when unchanged).
   */
  upsertSeries?: (entry: ChartSeriesRegistration) => void;
};

export const CHART_INJECTION_KEY = Symbol("bridge-chart") as InjectionKey<
  ComputedRef<ChartContextValue>
>;

/**
 * Injects the nearest chart root context. Throws when used outside a chart.
 */
export function useChartContext(): ComputedRef<ChartContextValue> {
  const context = inject(CHART_INJECTION_KEY, null);

  if (!context) {
    throw new Error(
      "Chart components must be used within ChartLine, ChartBar, ChartScatter, ChartPie, or ChartFunnel",
    );
  }

  return context;
}
