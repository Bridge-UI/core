// ** External Imports
import {
  clamp,
  get,
  isNil,
  isNumber,
  isString,
  keys,
  last,
} from "es-toolkit/compat";

/**
 * Series families Bridge knows about (v1).
 */
export const CHART_TYPES = ["bar", "area", "line"] as const;

/**
 * Series family drawn by the plot.
 */
export type ChartType = (typeof CHART_TYPES)[number];

/**
 * Line interpolation for `line` / `area` series.
 */
export type ChartCurve = "linear" | "smooth";

/**
 * One value per category. `null` renders a gap.
 */
export type ChartDatum = null | number;

/**
 * Axis identifier (`x` = categories, `y` = values).
 */
export type ChartAxisPosition = "x" | "y";

/**
 * Visible series handed to the plot. Hidden series are filtered out first.
 */
export type ChartRenderSeries = {
  /**
   * Resolved CSS color (`rgb()` / `rgba()` / hex). Never a Tailwind class.
   */
  color: string;

  /**
   * Line interpolation (ignored by `bar`).
   */
  curve: ChartCurve;

  /**
   * One value per category, in category order.
   */
  data: ChartDatum[];

  /**
   * Stable series id (use it for highlight / diffing).
   */
  id: string;

  /**
   * Human-readable series name.
   */
  name: string;

  /**
   * Series family.
   */
  type: ChartType;
};

/**
 * Resolved axis options handed to the plot.
 */
export type ChartRenderAxis = {
  /**
   * Formats tick labels. Receives the category label (`x`) or value (`y`).
   */
  formatTick?: (value: number | string) => string;

  /**
   * Whether grid lines are drawn for this axis.
   */
  grid: boolean;

  /**
   * Whether the axis line and labels are hidden.
   */
  hidden: boolean;

  /**
   * Optional axis title.
   */
  label?: string;

  /**
   * Upper bound for the value axis. The plot picks a nice max when omitted.
   */
  max?: number;

  /**
   * Lower bound for the value axis. The plot picks a nice min when omitted.
   */
  min?: number;

  /**
   * Preferred number of ticks (hint).
   */
  tickCount?: number;
};

/**
 * Resolved chrome colors and typography. Bridge reads these from design
 * tokens so the plot follows the theme.
 */
export type ChartRenderTheme = {
  /**
   * Axis line color.
   */
  axisColor: string;

  /**
   * Font family for axis labels.
   */
  fontFamily: string;

  /**
   * Font size (px) for axis labels.
   */
  fontSize: number;

  /**
   * Grid line color.
   */
  gridColor: string;

  /**
   * Axis label / title color.
   */
  textColor: string;
};

/**
 * Everything the plot needs to (re)draw.
 */
export type ChartRenderOptions = {
  /**
   * Whether transitions are enabled. `false` under reduced motion.
   */
  animation: boolean;

  /**
   * Category labels (x axis).
   */
  categories: string[];

  /**
   * Plot height in px.
   */
  height: number;

  /**
   * Visible series in render order.
   */
  series: ChartRenderSeries[];

  /**
   * Resolved chrome colors and typography.
   */
  theme: ChartRenderTheme;

  /**
   * Plot width in px.
   */
  width: number;

  /**
   * Category axis options.
   */
  xAxis: ChartRenderAxis;

  /**
   * Value axis options.
   */
  yAxis: ChartRenderAxis;
};

/**
 * Options passed to {@link ChartHandle} creation.
 */
export type ChartMountOptions = ChartRenderOptions & {
  /**
   * Host element the plot renders into.
   */
  element: HTMLElement;

  /**
   * Called when the pointer moves over a category (`null` on leave).
   * Bridge drives the legend, tooltip, and live region from this index.
   */
  onActiveIndexChange: (index: null | number) => void;
};

/**
 * Pixel position inside the host element.
 */
export type ChartAnchor = {
  /**
   * Horizontal offset (px) from the host's left edge.
   */
  x: number;

  /**
   * Vertical offset (px) from the host's top edge.
   */
  y: number;
};

/**
 * Per-chart handle for one mounted plot.
 */
export interface ChartHandle {
  /**
   * Tears down the plot instance.
   */
  destroy: () => void;

  /**
   * Tooltip anchor for a category: horizontal center and the top-most
   * visible value. `null` when the index is out of range.
   */
  getCategoryAnchor: (index: number) => null | ChartAnchor;

  /**
   * Emphasizes one series (legend hover / focus). `null` clears it.
   */
  highlightSeries: (id: null | string) => void;

  /**
   * Shows the category pointer for keyboard navigation.
   * `null` clears it. Must not call `onActiveIndexChange` in a loop.
   */
  setActiveIndex: (index: null | number) => void;

  /**
   * Redraws with new data, size, or theme.
   */
  update: (options: ChartRenderOptions) => void;
}

/**
 * Default options for the category (`x`) axis.
 */
export const DEFAULT_CHART_X_AXIS: ChartRenderAxis = {
  grid: false,
  hidden: false,
};

/**
 * Default options for the value (`y`) axis.
 */
export const DEFAULT_CHART_Y_AXIS: ChartRenderAxis = {
  grid: true,
  hidden: false,
};

/**
 * Returns whether `value` is a known {@link ChartType}.
 */
export function isChartType(value: unknown): value is ChartType {
  return isString(value) && (CHART_TYPES as readonly string[]).includes(value);
}

/**
 * Whether any series is a bar (category axis needs a boundary gap).
 */
export function hasChartBarSeries(series: ChartRenderSeries[]): boolean {
  return series.some((item) => {
    return item.type === "bar";
  });
}

/** Default plot height (px) when `height` is omitted. */
export const DEFAULT_CHART_HEIGHT = 280;

/** Gap (px) between a tooltip and its anchor point. */
export const CHART_TOOLTIP_OFFSET = 8;

/**
 * Default series color order (Chart color token keys).
 * Series without `color` pick the next entry, cycling.
 */
export const DEFAULT_CHART_PALETTE: readonly string[] = [
  "primary",
  "info",
  "success",
  "warning",
  "error",
  "secondary",
  "dark",
];

/**
 * Series registered by `ChartSeries` on the nearest `Chart`.
 */
export type ChartSeriesEntry = {
  /**
   * Color token key or raw CSS color. Falls back to the palette.
   */
  color?: string;

  /**
   * Line interpolation (ignored by `bar`).
   */
  curve: ChartCurve;

  /**
   * One value per category.
   */
  data: ChartDatum[];

  /**
   * Stable series id.
   */
  id: string;

  /**
   * Human-readable series name.
   */
  name: string;

  /**
   * Series family.
   */
  type: ChartType;
};

/**
 * One row of the tooltip / live region for the active category.
 */
export type ChartTooltipItem = {
  /**
   * Resolved CSS color of the series.
   */
  color: string;

  /**
   * Series id.
   */
  id: string;

  /**
   * Series name.
   */
  name: string;

  /**
   * Value at the active category.
   */
  value: number;
};

/**
 * One category row of the accessible data table.
 */
export type ChartTableRow = {
  /**
   * Category label.
   */
  category: string;

  /**
   * Values per series, in series order.
   */
  values: ChartDatum[];
};

/**
 * Position (px) of the tooltip box inside the chart root.
 */
export type ChartTooltipPosition = {
  /**
   * Left offset in px.
   */
  left: number;

  /**
   * Top offset in px.
   */
  top: number;
};

/**
 * Picks the color for the series at `index`: explicit `color` first,
 * then the palette entry (cycling).
 */
export function resolveChartSeriesColor({
  color,
  index,
  palette,
}: {
  color?: string;
  index: number;
  palette: readonly string[];
}): string {
  if (!isNil(color) && color.length > 0) {
    return color;
  }

  const source = palette.length > 0 ? palette : DEFAULT_CHART_PALETTE;

  return get(source, index % source.length, "primary");
}

/**
 * Whether two registered series are equal (data compared value by value).
 * Lets `ChartSeries` re-register on every render without state churn.
 */
export function isSameChartSeriesEntry(
  left: ChartSeriesEntry,
  right: ChartSeriesEntry,
): boolean {
  return (
    left.id === right.id &&
    left.name === right.name &&
    left.type === right.type &&
    left.curve === right.curve &&
    left.color === right.color &&
    left.data.length === right.data.length &&
    left.data.every((value, index) => {
      return value === right.data[index];
    })
  );
}

/**
 * Shallow equality for axis options registered by `ChartAxis`.
 */
export function isSameChartAxisOptions(
  left: Partial<ChartRenderAxis>,
  right: Partial<ChartRenderAxis>,
): boolean {
  const leftKeys = keys(left) as Array<keyof ChartRenderAxis>;

  return (
    leftKeys.length === keys(right).length &&
    leftKeys.every((key) => {
      return left[key] === right[key];
    })
  );
}

/**
 * Whether there is nothing to plot (no series or only `null` values).
 */
export function isChartEmpty(series: Array<{ data: ChartDatum[] }>): boolean {
  return !series.some((item) => {
    return item.data.some((value) => {
      return isNumber(value) && Number.isFinite(value);
    });
  });
}

/**
 * Next active category for a keyboard key. Returns `null` to clear
 * (`Escape`) and `undefined` when the key is not handled.
 */
export function getAdjacentChartIndex({
  key,
  count,
  current,
}: {
  count: number;
  current: null | number;
  key: string;
}): null | number | undefined {
  if (count <= 0) {
    return undefined;
  }

  const lastIndex = count - 1;

  switch (key) {
    case "End":
      return lastIndex;
    case "Home":
      return 0;
    case "Escape":
      return null;
    case "ArrowUp":
    case "ArrowLeft":
      return isNil(current) ? lastIndex : clamp(current - 1, 0, lastIndex);
    case "ArrowDown":
    case "ArrowRight":
      return isNil(current) ? 0 : clamp(current + 1, 0, lastIndex);
    default:
      return undefined;
  }
}

/**
 * Tooltip rows for the category at `index`. Skips `null` values.
 */
export function getChartTooltipItems({
  index,
  series,
}: {
  index: number;
  series: Array<
    Pick<ChartSeriesEntry, "id" | "data" | "name"> & { color: string }
  >;
}): ChartTooltipItem[] {
  return series.flatMap((item) => {
    const value = get(item.data, index);

    if (!isNumber(value) || !Number.isFinite(value)) {
      return [];
    }

    return [{ value, id: item.id, name: item.name, color: item.color }];
  });
}

/**
 * Formats a value with `Intl.NumberFormat` for `locale`.
 */
export function formatChartValue(value: number, locale?: string): string {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return String(value);
  }
}

/**
 * Rows for the accessible data table (one per category).
 */
export function getChartTableRows({
  series,
  categories,
}: {
  categories: string[];
  series: Array<Pick<ChartSeriesEntry, "data">>;
}): ChartTableRow[] {
  return categories.map((category, index) => {
    return {
      category,
      values: series.map((item) => {
        return get(item.data, index, null) ?? null;
      }),
    };
  });
}

/**
 * Interpolation params for the chart summary message
 * (`count`, `names`, `categories`, `first`, `last`).
 */
export function getChartSummaryParams({
  series,
  categories,
}: {
  categories: string[];
  series: Array<Pick<ChartSeriesEntry, "name">>;
}): {
  categories: number;
  count: number;
  first: string;
  last: string;
  names: string;
} {
  return {
    count: series.length,
    first: categories[0] ?? "",
    last: last(categories) ?? "",
    categories: categories.length,
    names: series
      .map((item) => {
        return item.name;
      })
      .join(", "),
  };
}

/**
 * Screen-reader text for the active category
 * (`"Q2: Revenue 18, Cost 10"`).
 */
export function formatChartAnnouncement({
  items,
  locale,
  category,
}: {
  category: string;
  items: ChartTooltipItem[];
  locale?: string;
}): string {
  const values = items
    .map((item) => {
      return `${item.name} ${formatChartValue(item.value, locale)}`;
    })
    .join(", ");

  return values.length > 0 ? `${category}: ${values}` : category;
}

/**
 * Places the tooltip above `anchor` (below when there is no room),
 * clamped horizontally inside `bounds`.
 */
export function resolveChartTooltipPosition({
  size,
  anchor,
  bounds,
  offset = CHART_TOOLTIP_OFFSET,
}: {
  anchor: ChartAnchor;
  bounds: { height: number; width: number };
  offset?: number;
  size: { height: number; width: number };
}): ChartTooltipPosition {
  const maxLeft = Math.max(0, bounds.width - size.width);
  const left = clamp(anchor.x - size.width / 2, 0, maxLeft);
  const above = anchor.y - size.height - offset;

  if (above >= 0) {
    return { left, top: above };
  }

  const maxTop = Math.max(0, bounds.height - size.height);

  return { left, top: clamp(anchor.y + offset, 0, maxTop) };
}

/**
 * CSS length for `width` / `height` props (`280` → `"280px"`).
 */
export function toChartCssSize(
  value: number | string | undefined,
  fallback: string,
): string {
  if (isNumber(value)) {
    return `${value}px`;
  }

  return isNil(value) || value.length === 0 ? fallback : value;
}
