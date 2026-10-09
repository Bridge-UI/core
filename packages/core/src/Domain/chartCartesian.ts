// ** External Imports
import {
  get,
  has,
  isArray,
  isDate,
  isEmpty,
  isNil,
  last,
} from "es-toolkit/compat";

// ** Local Imports
import {
  applyChartTone,
  findChartColorRange,
  formatChartValue,
  isChartValue,
  resolveChartRangeColors,
  type ChartAxisOptions,
  type ChartBaseRenderOptions,
  type ChartColorRange,
  type ChartColorRangeAxis,
  type ChartDatum,
  type ChartRenderTheme,
  type ChartTable,
  type ChartTone,
  type ChartTooltipContent,
} from "@/Domain/chart";

/**
 * Category on the category axis: a label, or a date (time axis).
 */
export type ChartCategory = Date | string;

/**
 * Which way bars grow. `horizontal` puts categories on `y` and values on `x`.
 */
export type ChartOrientation = "vertical" | "horizontal";

/**
 * Line interpolation.
 */
export type ChartCurve = "linear" | "smooth";

/**
 * Step line mode. `false` draws a regular line.
 */
export type ChartStep = "end" | false | "start" | "middle";

/**
 * Reference line drawn across the plot: a statistic of the series or a
 * fixed value.
 */
export type ChartReference =
  | {
      /**
       * Text shown next to the line. Defaults to the value.
       */
      label?: string;

      /**
       * Fixed value on the value axis.
       */
      value: number;
    }
  | {
      /**
       * Text shown next to the line. Defaults to the value.
       */
      label?: string;

      /**
       * Statistic of the series values.
       */
      type: "max" | "min" | "average";
    };

/**
 * Series registered by `ChartLineSeries`.
 */
export type ChartLineSeriesEntry = {
  /**
   * Fills the area under the line.
   */
  area: boolean;

  /**
   * Opacity (`0`–`1`) of the area fill.
   */
  areaOpacity: number;

  /**
   * Color token key or raw CSS color. Falls back to the palette.
   */
  color?: string;

  /**
   * What `colorRanges` match: the value or the category index.
   */
  colorBy: ChartColorRangeAxis;

  /**
   * Ranges that recolor the line (and its area) piece by piece.
   */
  colorRanges: ChartColorRange[];

  /**
   * Line interpolation.
   */
  curve: ChartCurve;

  /**
   * Dashed stroke.
   */
  dashed: boolean;

  /**
   * One value per category.
   */
  data: ChartDatum[];

  /**
   * Stable series id.
   */
  id: string;

  /**
   * Series family.
   */
  kind: "line";

  /**
   * Value labels on points.
   */
  labels: boolean;

  /**
   * Human-readable series name.
   */
  name: string;

  /**
   * Reference lines.
   */
  reference: ChartReference[];

  /**
   * Always draw point symbols.
   */
  showPoints: boolean;

  /**
   * Stack key. Series with the same key stack.
   */
  stack?: string;

  /**
   * Step line mode.
   */
  step: ChartStep;
};

/**
 * Series registered by `ChartBarSeries`.
 */
export type ChartBarSeriesEntry = {
  /**
   * Color token key or raw CSS color. Falls back to the palette.
   */
  color?: string;

  /**
   * What `colorRanges` match: the value or the category index.
   */
  colorBy: ChartColorRangeAxis;

  /**
   * Ranges that recolor single bars.
   */
  colorRanges: ChartColorRange[];

  /**
   * One value per category.
   */
  data: ChartDatum[];

  /**
   * Stable series id.
   */
  id: string;

  /**
   * Series family.
   */
  kind: "bar";

  /**
   * Value labels on bars.
   */
  labels: boolean;

  /**
   * Human-readable series name.
   */
  name: string;

  /**
   * Reference lines.
   */
  reference: ChartReference[];

  /**
   * Stack key. Series with the same key stack.
   */
  stack?: string;

  /**
   * `muted` mixes every bar color toward the plot background.
   */
  tone: ChartTone;
};

/**
 * Line or bar series.
 */
export type ChartCartesianSeriesEntry =
  ChartBarSeriesEntry | ChartLineSeriesEntry;

/**
 * Visible series handed to the plot, with its resolved CSS color.
 */
export type ChartCartesianRenderSeries = ChartCartesianSeriesEntry & {
  /**
   * Resolved CSS color (`rgb()` / `rgba()` / hex). Never a Tailwind class.
   * With category colors, the neutral legend color of a bar series.
   */
  color: string;

  /**
   * Resolved color of each category's point or bar, when it differs from
   * `color` (color ranges, category colors). `null` when uniform.
   */
  itemColors: null | string[];
};

/**
 * Everything a line or bar plot needs to (re)draw.
 */
export type ChartCartesianRenderOptions = ChartBaseRenderOptions & {
  /**
   * Category labels, in category order.
   */
  categories: string[];

  /**
   * Formats value labels.
   */
  formatLabel: (value: number) => string;

  /**
   * Bar orientation (ignored by line plots).
   */
  orientation: ChartOrientation;

  /**
   * Bar corner radius (px) on the value end.
   */
  radius: number;

  /**
   * Visible series in render order.
   */
  series: ChartCartesianRenderSeries[];

  /**
   * Compact mode: no axes, grid, or padding.
   */
  sparkline: boolean;

  /**
   * Category timestamps (ms) for a time axis. `null` for label categories.
   */
  timestamps: null | number[];

  /**
   * Options for the horizontal axis.
   */
  xAxis: ChartAxisOptions;

  /**
   * Options for the vertical axis.
   */
  yAxis: ChartAxisOptions;
};

/**
 * Category and value axis options after role defaults are applied.
 */
export type ChartCartesianAxes = {
  /**
   * Category (or time) axis.
   */
  category: ChartAxisOptions & { grid: boolean; hidden: boolean };

  /**
   * Which physical axis holds the categories.
   */
  categoryPosition: "x" | "y";

  /**
   * Value axis.
   */
  value: ChartAxisOptions & { grid: boolean; hidden: boolean };
};

/**
 * Corner radii `[top-left, top-right, bottom-right, bottom-left]`.
 */
export type ChartBarRadius = [number, number, number, number];

/** Default bar corner radius (px). */
export const DEFAULT_CHART_BAR_RADIUS = 4;

/** Default opacity of the area under a line. */
export const DEFAULT_CHART_AREA_OPACITY = 0.15;

/**
 * Color of each category's point or bar: the matching color range first,
 * then the category color. `null` when neither applies (uniform series).
 * Colors are already resolved (and toned) CSS colors.
 */
export function getChartCartesianItemColors({
  data,
  color,
  colorBy,
  colorRanges,
  categoryColors,
}: {
  categoryColors?: null | readonly string[];
  color: string;
  colorBy: ChartColorRangeAxis;
  colorRanges: readonly ChartColorRange[];
  data: readonly ChartDatum[];
}): null | string[] {
  if (colorRanges.length === 0 && isNil(categoryColors)) {
    return null;
  }

  return data.map((value, index) => {
    const target = colorBy === "category" ? index : value;

    const range = isChartValue(target)
      ? findChartColorRange(colorRanges, target, colorBy)
      : undefined;

    return range?.color ?? categoryColors?.[index] ?? color;
  });
}

/**
 * Bar colors per category: `true` takes palette entries in category order,
 * an array follows the category order, and a record maps category labels.
 */
export type ChartCategoryColorsOption =
  boolean | readonly string[] | Readonly<Record<string, string>>;

/**
 * Color id of category `index` (`categoryColors`).
 */
export function getChartCategoryColorId(index: number): string {
  return `category-${index}`;
}

/**
 * Color items for each category when `categoryColors` is set, empty when it
 * is not. `true` leaves every category color to the palette. Record keys
 * are matched as own keys only (a `"constructor"` label stays unset).
 */
export function getChartCategoryColorItems({
  labels,
  categoryColors,
}: {
  categoryColors?: ChartCategoryColorsOption;
  labels: readonly string[];
}): Array<{ color?: string; id: string }> {
  if (isNil(categoryColors) || categoryColors === false) {
    return [];
  }

  return labels.map((label, index) => {
    const color =
      categoryColors === true
        ? undefined
        : isArray(categoryColors)
          ? categoryColors[index]
          : has(categoryColors, [label])
            ? get(categoryColors, [label])
            : undefined;

    return { color, id: getChartCategoryColorId(index) };
  });
}

/**
 * Render series with resolved colors: the series tone (`muted` bars mix
 * toward the background), range colors, and per-item colors. With category
 * colors a bar series takes a neutral (text) color for the legend while its
 * bars follow the categories; line series keep their own color.
 */
export function getChartCartesianRenderSeries({
  theme,
  colors,
  series,
  categoryColors,
}: {
  categoryColors: null | readonly string[];
  colors: Readonly<Record<string, string>>;
  series: readonly ChartCartesianSeriesEntry[];
  theme: null | Pick<ChartRenderTheme, "textColor" | "backgroundColor">;
}): ChartCartesianRenderSeries[] {
  const background = theme?.backgroundColor ?? "";

  return series.map((item) => {
    const tone = item.kind === "bar" ? item.tone : "solid";

    const tint = (color: string) => {
      return applyChartTone(color, tone, background);
    };

    const base = tint(colors[item.id] ?? "");
    const ownCategories = item.kind === "bar" ? categoryColors : null;

    const colorRanges = resolveChartRangeColors({
      tint,
      colors,
      seriesId: item.id,
      ranges: item.colorRanges,
    });

    return {
      ...item,
      colorRanges,
      color: isNil(ownCategories) ? base : tint(theme?.textColor ?? ""),
      itemColors: getChartCartesianItemColors({
        colorRanges,
        color: base,
        data: item.data,
        colorBy: item.colorBy,
        categoryColors: ownCategories?.map(tint),
      }),
    };
  });
}

/**
 * Label of the color range a series value falls in, if any.
 */
export function getChartCartesianNote(
  series: Partial<Pick<ChartCartesianSeriesEntry, "colorBy" | "colorRanges">>,
  value: number,
  index: number,
): string | undefined {
  const colorRanges = series.colorRanges ?? [];

  if (isEmpty(colorRanges)) {
    return undefined;
  }

  const colorBy = series.colorBy ?? "value";

  return findChartColorRange(
    colorRanges,
    colorBy === "category" ? index : value,
    colorBy,
  )?.label;
}

/**
 * Whether `categories` are dates (time axis).
 */
export function isChartTimeCategories(
  categories: readonly ChartCategory[],
): categories is Date[] {
  return (
    categories.length > 0 &&
    categories.every((category) => {
      return isDate(category) && Number.isFinite(category.getTime());
    })
  );
}

/**
 * Formats a date with `Intl.DateTimeFormat` (`dateStyle: "medium"`).
 */
export function formatChartDate(date: Date, locale?: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
      date,
    );
  } catch {
    return date.toISOString();
  }
}

/**
 * Labels for `categories`: strings as-is, dates through `formatDate`.
 */
export function getChartCategoryLabels({
  locale,
  categories,
  formatDate,
}: {
  categories: readonly ChartCategory[];
  formatDate?: (date: Date) => string;
  locale?: string;
}): string[] {
  return categories.map((category) => {
    if (!isDate(category)) {
      return String(category);
    }

    return isNil(formatDate)
      ? formatChartDate(category, locale)
      : formatDate(category);
  });
}

/**
 * Default tick formatter for a time axis, picked from the span of
 * `timestamps`: years, months, days, or hours.
 */
export function getChartTimeTickFormatter({
  locale,
  timestamps,
}: {
  locale?: string;
  timestamps: readonly number[];
}): (value: number) => string {
  const day = 24 * 60 * 60 * 1000;
  const min = Math.min(...timestamps);
  const max = Math.max(...timestamps);
  const span = max - min;

  const sameYear = new Date(min).getFullYear() === new Date(max).getFullYear();

  let options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  if (span >= 2 * 365 * day) {
    options = { year: "numeric" };
  } else if (span >= 60 * day) {
    options = sameYear
      ? { month: "short" }
      : { month: "short", year: "2-digit" };
  } else if (span >= 2 * day) {
    options = { day: "numeric", month: "short" };
  }

  let format: (date: Date) => string;

  try {
    format = new Intl.DateTimeFormat(locale, options).format;
  } catch {
    format = (date) => date.toISOString();
  }

  return (value) => format(new Date(value));
}

/**
 * Index of the category timestamp closest to `value`. `null` when empty.
 */
export function getChartNearestIndex(
  timestamps: readonly number[],
  value: number,
): null | number {
  let nearest: null | number = null;
  let distance = Number.POSITIVE_INFINITY;

  timestamps.forEach((timestamp, index) => {
    const next = Math.abs(timestamp - value);

    if (next < distance) {
      nearest = index;
      distance = next;
    }
  });

  return nearest;
}

/**
 * Applies role defaults to the axes registered by `ChartAxis`. Grid lines
 * are on for the value axis and off for the category axis.
 */
export function resolveChartCartesianAxes({
  xAxis,
  yAxis,
  orientation,
}: {
  orientation: ChartOrientation;
  xAxis: ChartAxisOptions;
  yAxis: ChartAxisOptions;
}): ChartCartesianAxes {
  const horizontal = orientation === "horizontal";
  const category = horizontal ? yAxis : xAxis;
  const value = horizontal ? xAxis : yAxis;

  return {
    categoryPosition: horizontal ? "y" : "x",
    value: {
      ...value,
      grid: value.grid ?? true,
      hidden: value.hidden ?? false,
    },
    category: {
      ...category,
      grid: category.grid ?? false,
      hidden: category.hidden ?? false,
    },
  };
}

/**
 * Cumulative end value of each series per category, stacking series that
 * share a `stack` key (positives and negatives stack apart). Unstacked
 * series keep their own value.
 */
export function getChartStackEnds(
  series: ReadonlyArray<
    Pick<ChartCartesianSeriesEntry, "id" | "data" | "stack">
  >,
): Record<string, ChartDatum[]> {
  const totals: Record<string, { negative: number[]; positive: number[] }> = {};

  const ends: Record<string, ChartDatum[]> = {};

  series.forEach((item) => {
    if (isNil(item.stack)) {
      ends[item.id] = item.data.map((value) => {
        return isChartValue(value) ? value : null;
      });

      return;
    }

    const stack = (totals[item.stack] ??= { negative: [], positive: [] });

    ends[item.id] = item.data.map((value, index) => {
      if (!isChartValue(value)) {
        return null;
      }

      const side = value < 0 ? stack.negative : stack.positive;
      side[index] = (side[index] ?? 0) + value;

      return side[index];
    });
  });

  return ends;
}

/**
 * Corner radii for one bar: rounds the value end (the top of a positive
 * vertical bar, the left of a negative horizontal bar, …).
 */
export function getChartBarRadius({
  value,
  radius,
  orientation,
}: {
  orientation: ChartOrientation;
  radius: number;
  value: number;
}): ChartBarRadius {
  const negative = value < 0;

  if (orientation === "horizontal") {
    return negative ? [radius, 0, 0, radius] : [0, radius, radius, 0];
  }

  return negative ? [0, 0, radius, radius] : [radius, radius, 0, 0];
}

/**
 * Corner radii per series and category. In a stack only the outermost bar
 * on each side is rounded; `null` means square corners.
 */
export function resolveChartBarRadii({
  series,
  radius,
  orientation,
}: {
  orientation: ChartOrientation;
  radius: number;
  series: ReadonlyArray<
    Pick<ChartCartesianSeriesEntry, "id" | "data" | "stack">
  >;
}): Record<string, Array<null | ChartBarRadius>> {
  const outermost: Record<string, { negative: string[]; positive: string[] }> =
    {};

  series.forEach((item) => {
    if (isNil(item.stack)) {
      return;
    }

    const stack = (outermost[item.stack] ??= { negative: [], positive: [] });

    item.data.forEach((value, index) => {
      if (!isChartValue(value) || value === 0) {
        return;
      }

      const side = value < 0 ? stack.negative : stack.positive;
      side[index] = item.id;
    });
  });

  const radii: Record<string, Array<null | ChartBarRadius>> = {};

  series.forEach((item) => {
    radii[item.id] = item.data.map((value, index) => {
      if (!isChartValue(value) || radius <= 0) {
        return null;
      }

      if (!isNil(item.stack)) {
        const stack = outermost[item.stack];
        const side = value < 0 ? stack.negative : stack.positive;

        if (side[index] !== item.id) {
          return null;
        }
      }

      return getChartBarRadius({ value, radius, orientation });
    });
  });

  return radii;
}

/**
 * Tooltip content for the category at `index`. Skips `null` values.
 */
export function getChartCartesianTooltip({
  index,
  title,
  series,
}: {
  index: number;
  series: ReadonlyArray<
    Pick<ChartCartesianSeriesEntry, "id" | "data" | "name"> &
      Partial<Pick<ChartCartesianSeriesEntry, "colorBy" | "colorRanges">> & {
        color: string;
        itemColors?: null | string[];
      }
  >;
  title: string;
}): ChartTooltipContent {
  return {
    title,
    items: series.flatMap((item) => {
      const value = get(item.data, index);

      if (!isChartValue(value)) {
        return [];
      }

      const note = getChartCartesianNote(item, value, index);

      return [
        {
          value,
          id: item.id,
          name: item.name,
          ...(isNil(note) ? {} : { note }),
          color: item.itemColors?.[index] ?? item.color,
        },
      ];
    }),
  };
}

/**
 * Accessible data table: one row per category, one column per series.
 */
export function getChartCartesianTable({
  locale,
  series,
  categories,
  categoryHeader,
}: {
  categories: readonly string[];
  categoryHeader: string;
  locale?: string;
  series: ReadonlyArray<
    Pick<ChartCartesianSeriesEntry, "data" | "name"> &
      Partial<Pick<ChartCartesianSeriesEntry, "colorBy" | "colorRanges">>
  >;
}): ChartTable {
  return {
    headers: [categoryHeader, ...series.map((item) => item.name)],
    rows: categories.map((category, index) => {
      return {
        key: `${index}-${category}`,
        cells: [
          category,
          ...series.map((item) => {
            const value = get(item.data, index);

            if (!isChartValue(value)) {
              return "—";
            }

            const text = formatChartValue(value, locale);
            const note = getChartCartesianNote(item, value, index);

            return isNil(note) ? text : `${text} (${note})`;
          }),
        ],
      };
    }),
  };
}

/**
 * Interpolation params for the chart summary message
 * (`count`, `names`, `categories`, `first`, `last`).
 */
export function getChartCartesianSummaryParams({
  series,
  categories,
}: {
  categories: readonly string[];
  series: ReadonlyArray<Pick<ChartCartesianSeriesEntry, "name">>;
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
    names: series.map((item) => item.name).join(", "),
  };
}
