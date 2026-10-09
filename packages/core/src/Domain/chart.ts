// ** External Imports
import { clamp, get, isNil, isNumber, keys } from "es-toolkit/compat";

/**
 * One value per category. `null` renders a gap.
 */
export type ChartDatum = null | number;

/**
 * Physical axis (`x` = horizontal, `y` = vertical).
 */
export type ChartAxisPosition = "x" | "y";

/**
 * Axis options registered by `ChartAxis`. Unset keys fall back to the
 * defaults of the axis role (category or value).
 */
export type ChartAxisOptions = {
  /**
   * Formats category tick labels (category axis).
   */
  formatCategory?: (category: string) => string;

  /**
   * Formats numeric tick labels: the value (value axis) or the timestamp in
   * ms (time axis).
   */
  formatTick?: (value: number) => string;

  /**
   * Whether grid lines are drawn for this axis.
   */
  grid?: boolean;

  /**
   * Whether the axis line and labels are hidden.
   */
  hidden?: boolean;

  /**
   * Optional axis title.
   */
  label?: string;

  /**
   * Upper bound for a value axis. The plot picks a nice max when omitted.
   */
  max?: number;

  /**
   * Lower bound for a value axis. The plot picks a nice min when omitted.
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
   * Opaque color behind the plot (nearest painted ancestor). Muted tones
   * mix toward it.
   */
  backgroundColor: string;

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
 * One color range: values in `[min, max)` take `color`. On the category
 * axis `min` and `max` are category indices and both ends are included.
 */
export type ChartColorRange = {
  /**
   * Color token key or CSS color (resolved to a CSS color before render).
   */
  color: string;

  /**
   * Text for the range (`"Good"`, `"Peak"`), shown in the tooltip, the
   * data table, and the live region.
   */
  label?: string;

  /**
   * Upper bound: excluded for values, included for category indices.
   * Open when omitted.
   */
  max?: number;

  /**
   * Lower bound (included). Open when omitted.
   */
  min?: number;
};

/**
 * What color ranges are matched against: each point's value, or its
 * category index.
 */
export type ChartColorRangeAxis = "value" | "category";

/**
 * Series tone. `muted` mixes the color toward the plot background (a
 * comparison or past period next to a `solid` series).
 */
export type ChartTone = "muted" | "solid";

/**
 * Options every chart family hands to its plot.
 */
export type ChartBaseRenderOptions = {
  /**
   * Whether transitions are enabled. `false` under reduced motion.
   */
  animation: boolean;

  /**
   * Plot height in px.
   */
  height: number;

  /**
   * Resolved chrome colors and typography.
   */
  theme: ChartRenderTheme;

  /**
   * Plot width in px.
   */
  width: number;
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
 * Options passed when a plot is mounted.
 */
export type ChartMountOptions<Options extends ChartBaseRenderOptions> =
  Options & {
    /**
     * Host element the plot renders into.
     */
    element: HTMLElement;

    /**
     * Called when the pointer moves over an item (category, point, slice,
     * or stage; `null` on leave). Bridge drives the legend, tooltip, and
     * live region from this index.
     */
    onActiveIndexChange: (index: null | number) => void;
  };

/**
 * Per-chart handle for one mounted plot.
 */
export interface ChartHandle<Options extends ChartBaseRenderOptions> {
  /**
   * Tears down the plot instance.
   */
  destroy: () => void;

  /**
   * Tooltip anchor for the item at `index`. `null` when out of range.
   */
  getAnchor: (index: number) => null | ChartAnchor;

  /**
   * Emphasizes one legend item (series or slice). `null` clears it.
   */
  highlight: (id: null | string) => void;

  /**
   * Shows the pointer for keyboard navigation. `null` clears it.
   * Must not call `onActiveIndexChange` in a loop.
   */
  setActiveIndex: (index: null | number) => void;

  /**
   * Redraws with new data, size, or theme.
   */
  update: (options: Options) => void;
}

/**
 * One row of the tooltip / live region for the active item.
 */
export type ChartTooltipItem = {
  /**
   * Resolved CSS color. Rows without a color render no swatch.
   */
  color?: string;

  /**
   * Row id (series, slice, or dimension).
   */
  id: string;

  /**
   * Row label.
   */
  name: string;

  /**
   * Label of the color range the value falls in (`"Good"`).
   */
  note?: string;

  /**
   * Share of the total (pie) or of the largest stage (funnel), `0`–`100`.
   */
  percent?: number;

  /**
   * Raw value.
   */
  value: number;
};

/**
 * Tooltip content for the active item.
 */
export type ChartTooltipContent = {
  /**
   * Swatch color next to the title (scatter series).
   */
  color?: string;

  /**
   * Rows (series values, point dimensions, or the active slice).
   */
  items: ChartTooltipItem[];

  /**
   * Title (category, series name). Empty when the rows say it all.
   */
  title: string;
};

/**
 * Accessible data table. The first cell of each row is a row header.
 */
export type ChartTable = {
  /**
   * Column headers.
   */
  headers: string[];

  /**
   * Rows of formatted cells.
   */
  rows: Array<{ cells: string[]; key: string }>;
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

/** Default plot height (px) when `height` is omitted. */
export const DEFAULT_CHART_HEIGHT = 280;

/** Gap (px) between a tooltip and its anchor point. */
export const CHART_TOOLTIP_OFFSET = 8;

/**
 * Default color order (Chart color token keys). Series and slices without
 * `color` pick the next entry, cycling.
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
 * Picks the color for the item at `index`: explicit `color` first, then the
 * palette entry (cycling).
 */
export function resolveChartColor({
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
 * Range that `value` falls in (the first match wins). `axis: "category"`
 * matches a category index, with both ends included.
 */
export function findChartColorRange<Range extends ChartColorRange>(
  ranges: readonly Range[],
  value: number,
  axis: ChartColorRangeAxis = "value",
): Range | undefined {
  return ranges.find((range) => {
    const aboveMin = isNil(range.min) || value >= range.min;

    if (isNil(range.max)) {
      return aboveMin;
    }

    return (
      aboveMin && (axis === "category" ? value <= range.max : value < range.max)
    );
  });
}

/** Share of the original color kept by the `muted` tone. */
export const CHART_MUTED_WEIGHT = 0.4;

/**
 * Parses `rgb()` / `rgba()` (comma or space syntax) and `#rgb` / `#rrggbb`
 * into `[red, green, blue, alpha]`. `null` for anything else.
 */
function parseRgb(color: string): null | [number, number, number, number] {
  const hex = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(color.trim());

  if (!isNil(hex)) {
    const digits =
      hex[1].length === 3
        ? [...hex[1]].map((digit) => digit + digit).join("")
        : hex[1];

    return [
      Number.parseInt(digits.slice(0, 2), 16),
      Number.parseInt(digits.slice(2, 4), 16),
      Number.parseInt(digits.slice(4, 6), 16),
      1,
    ];
  }

  const rgb = /^rgba?\(([^)]+)\)$/i.exec(color.trim());

  if (isNil(rgb)) {
    return null;
  }

  const parts = rgb[1].split(/[\s,/]+/).filter((part) => part.length > 0);
  const [red, green, blue, alpha = "1"] = parts.map((part) => part.trim());
  const channels = [red, green, blue].map(Number);

  const opacity = alpha.endsWith("%")
    ? Number.parseFloat(alpha) / 100
    : Number(alpha);

  if (![...channels, opacity].every(Number.isFinite)) {
    return null;
  }

  return [channels[0], channels[1], channels[2], opacity];
}

/**
 * Mixes `color` over an opaque `base`, keeping `weight` (`0`–`1`) of
 * `color`. Returns `color` unchanged when either color is not `rgb()` /
 * `rgba()` / hex (resolved chart colors always are in the browser).
 */
export function mixChartColors(
  color: string,
  base: string,
  weight: number,
): string {
  const top = parseRgb(color);
  const bottom = parseRgb(base);

  if (isNil(top) || isNil(bottom)) {
    return color;
  }

  const share = clamp(weight, 0, 1) * clamp(top[3], 0, 1);

  const [red, green, blue] = [0, 1, 2].map((channel) => {
    return Math.round(top[channel] * share + bottom[channel] * (1 - share));
  });

  return `rgb(${red}, ${green}, ${blue})`;
}

/**
 * Applies a series tone to a resolved color. `muted` mixes it toward the
 * plot background.
 */
export function applyChartTone(
  color: string,
  tone: ChartTone,
  background: string,
): string {
  if (tone === "solid" || color.length === 0) {
    return color;
  }

  return mixChartColors(color, background, CHART_MUTED_WEIGHT);
}

/**
 * Shallow equality for axis options registered by `ChartAxis`.
 */
export function isSameChartAxisOptions(
  left: ChartAxisOptions,
  right: ChartAxisOptions,
): boolean {
  const leftKeys = keys(left) as Array<keyof ChartAxisOptions>;

  return (
    leftKeys.length === keys(right).length &&
    leftKeys.every((key) => {
      return left[key] === right[key];
    })
  );
}

/**
 * Whether `value` is a finite number (not `null`, `NaN`, or `Infinity`).
 */
export function isChartValue(value: unknown): value is number {
  return isNumber(value) && Number.isFinite(value);
}

/**
 * Whether there is nothing to plot (no finite value in `values`).
 */
export function isChartEmpty(values: readonly unknown[]): boolean {
  return !values.some(isChartValue);
}

/**
 * Next active index for a keyboard key. Returns `null` to clear (`Escape`)
 * and `undefined` when the key is not handled.
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
 * Formats a `0`–`100` percent with `Intl.NumberFormat` (`50` → `"50%"`).
 */
export function formatChartPercent(percent: number, locale?: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(percent / 100);
  } catch {
    return `${percent}%`;
  }
}

/**
 * Rounds shares of `values` to whole percents that always sum to `100`
 * (largest remainder). Non-positive values get `0`.
 */
export function roundChartPercents(values: readonly number[]): number[] {
  const positive = values.map((value) => {
    return isChartValue(value) && value > 0 ? value : 0;
  });

  const total = positive.reduce((sum, value) => sum + value, 0);

  if (total <= 0) {
    return values.map(() => 0);
  }

  const raw = positive.map((value) => (value / total) * 100);
  const floors = raw.map((value) => Math.floor(value));
  let remaining = 100 - floors.reduce((sum, value) => sum + value, 0);

  const order = raw
    .map((value, index) => ({ index, remainder: value - floors[index] }))
    .filter((item) => positive[item.index] > 0)
    .sort((left, right) => right.remainder - left.remainder);

  for (const item of order) {
    if (remaining <= 0) {
      break;
    }

    floors[item.index] += 1;
    remaining -= 1;
  }

  return floors;
}

/**
 * Screen-reader text for the active item (`"Q2: Revenue 18, Cost 10"`).
 */
export function formatChartAnnouncement({
  title,
  items,
  locale,
}: {
  items: ChartTooltipItem[];
  locale?: string;
  title: string;
}): string {
  const values = items
    .map((item) => {
      const value = formatChartValue(item.value, locale);

      const extras = [
        isNil(item.percent) ? null : formatChartPercent(item.percent, locale),
        item.note,
      ].filter((extra) => !isNil(extra) && extra.length > 0);

      return extras.length === 0
        ? `${item.name} ${value}`
        : `${item.name} ${value} (${extras.join(", ")})`;
    })
    .join(", ");

  if (title.length === 0) {
    return values;
  }

  return values.length > 0 ? `${title}: ${values}` : title;
}

/**
 * Places the tooltip above `anchor`, or below it when only that side fits
 * inside `bounds`. When neither side fits (sparklines, short charts) it
 * stays above and leaves the bounds (`top` may be negative) instead of
 * covering the plot. Always clamped horizontally inside `bounds`.
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

  const below = anchor.y + offset;

  return below + size.height <= bounds.height
    ? { left, top: below }
    : { left, top: above };
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
