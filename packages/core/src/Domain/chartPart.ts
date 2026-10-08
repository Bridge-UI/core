// ** External Imports
import { isFunction, isNil, last, take } from "es-toolkit/compat";

// ** Local Imports
import {
  formatChartPercent,
  formatChartValue,
  isChartValue,
  roundChartPercents,
  type ChartBaseRenderOptions,
  type ChartTable,
  type ChartTooltipContent,
} from "@/Domain/chart";

/**
 * One slice (pie) or stage (funnel).
 */
export type ChartSlice = {
  /**
   * Color token key or CSS color. Falls back to the palette.
   */
  color?: string;

  /**
   * Label shown in the legend, tooltip, plot labels, and data table.
   */
  label: string;

  /**
   * Slice value.
   */
  value: number;
};

/**
 * Slice with a stable id, ready for color resolution and the legend.
 */
export type ChartSliceEntry = ChartSlice & {
  /**
   * Stable id (`slice-0`, `slice-1`, …, `other`).
   */
  id: string;
};

/**
 * Where plot labels sit: on the slice / stage, or next to it with a leader
 * line.
 */
export type ChartLabelPosition = "inside" | "outside";

/**
 * Slice / stage passed to a custom label formatter.
 */
export type ChartSliceLabelContext = {
  /**
   * Slice label.
   */
  label: string;

  /**
   * Share (`0`–`100`).
   */
  percent: number;

  /**
   * Slice value.
   */
  value: number;
};

/**
 * What plot labels show: the label, the value, the percent, or custom text.
 */
export type ChartLabelContent =
  "label" | "value" | "percent" | ((slice: ChartSliceLabelContext) => string);

/**
 * Pie shape. `donut` leaves a hole for center content.
 */
export type ChartPieVariant = "pie" | "donut";

/**
 * Funnel stage order.
 */
export type ChartFunnelSort = "none" | "ascending" | "descending";

/**
 * Funnel shape alignment.
 */
export type ChartFunnelAlign = "left" | "right" | "center";

/**
 * Visible slice handed to the plot.
 */
export type ChartPartRenderSlice = {
  /**
   * Resolved CSS color.
   */
  color: string;

  /**
   * Stable id.
   */
  id: string;

  /**
   * Slice label.
   */
  label: string;

  /**
   * Plot label text (empty when plot labels are off).
   */
  labelText: string;

  /**
   * Share (`0`–`100`).
   */
  percent: number;

  /**
   * Slice value.
   */
  value: number;
};

/**
 * Everything a pie plot needs to (re)draw.
 */
export type ChartPieRenderOptions = ChartBaseRenderOptions & {
  /**
   * Where plot labels sit.
   */
  labelPosition: ChartLabelPosition;

  /**
   * Whether plot labels are drawn.
   */
  labels: boolean;

  /**
   * Minimum slice angle (deg) so tiny slices stay visible.
   */
  minAngle: number;

  /**
   * Visible slices in render order.
   */
  slices: ChartPartRenderSlice[];

  /**
   * Donut ring thickness as a fraction of the radius (`0`–`1`).
   */
  thickness: number;

  /**
   * Pie or donut.
   */
  variant: ChartPieVariant;
};

/**
 * Everything a funnel plot needs to (re)draw.
 */
export type ChartFunnelRenderOptions = ChartBaseRenderOptions & {
  /**
   * Shape alignment.
   */
  align: ChartFunnelAlign;

  /**
   * Where plot labels sit.
   */
  labelPosition: ChartLabelPosition;

  /**
   * Whether plot labels are drawn.
   */
  labels: boolean;

  /**
   * Visible stages in render (top-to-bottom) order.
   */
  slices: ChartPartRenderSlice[];
};

/** Default donut ring thickness (fraction of the radius). */
export const DEFAULT_CHART_DONUT_THICKNESS = 0.3;

/** Default minimum slice angle (deg). */
export const DEFAULT_CHART_MIN_ANGLE = 2;

/** Id of the slice that groups the rest when `maxSlices` is set. */
export const CHART_OTHER_SLICE_ID = "other";

/**
 * Gives each slice a stable id. With `maxSlices`, keeps the largest
 * `maxSlices - 1` slices (in their original order) and groups the rest
 * into one `otherLabel` slice at the end. Pie data drops non-positive
 * values (`positiveOnly`).
 */
export function toChartSliceEntries({
  data,
  maxSlices,
  otherLabel,
  positiveOnly = false,
}: {
  data: readonly ChartSlice[];
  maxSlices?: number;
  otherLabel: string;
  positiveOnly?: boolean;
}): ChartSliceEntry[] {
  const entries = data.flatMap((slice, index) => {
    if (!isChartValue(slice.value) || (positiveOnly && slice.value <= 0)) {
      return [];
    }

    return [{ ...slice, id: `slice-${index}` }];
  });

  if (isNil(maxSlices) || maxSlices < 2 || entries.length <= maxSlices) {
    return entries;
  }

  const kept = new Set(
    take(
      [...entries].sort((left, right) => right.value - left.value),
      maxSlices - 1,
    ).map((entry) => entry.id),
  );

  const rest = entries.filter((entry) => !kept.has(entry.id));

  return [
    ...entries.filter((entry) => kept.has(entry.id)),
    {
      label: otherLabel,
      id: CHART_OTHER_SLICE_ID,
      value: rest.reduce((sum, entry) => sum + entry.value, 0),
    },
  ];
}

/**
 * Orders funnel stages (`none` keeps the data order).
 */
export function sortChartStages<Stage extends Pick<ChartSlice, "value">>(
  stages: readonly Stage[],
  sort: ChartFunnelSort,
): Stage[] {
  if (sort === "none") {
    return [...stages];
  }

  return [...stages].sort((left, right) => {
    return sort === "ascending"
      ? left.value - right.value
      : right.value - left.value;
  });
}

/**
 * Pie shares: whole percents of the total that sum to `100`.
 */
export function getChartPiePercents(values: readonly number[]): number[] {
  return roundChartPercents(values);
}

/**
 * Funnel shares: each stage as a whole percent of the largest stage.
 */
export function getChartFunnelPercents(values: readonly number[]): number[] {
  const max = Math.max(0, ...values.filter(isChartValue));

  return values.map((value) => {
    return max > 0 && isChartValue(value) ? Math.round((value / max) * 100) : 0;
  });
}

/**
 * Plot label text for one slice.
 */
export function resolveChartSliceLabel({
  slice,
  locale,
  content,
}: {
  content: ChartLabelContent;
  locale?: string;
  slice: ChartSliceLabelContext;
}): string {
  if (isFunction(content)) {
    return content(slice);
  }

  switch (content) {
    case "value":
      return formatChartValue(slice.value, locale);
    case "percent":
      return formatChartPercent(slice.percent, locale);
    default:
      return slice.label;
  }
}

/**
 * Whether there is nothing to plot (no finite value).
 */
export function isChartPartEmpty(
  slices: ReadonlyArray<Pick<ChartSlice, "value">>,
): boolean {
  return !slices.some((slice) => isChartValue(slice.value));
}

/**
 * Tooltip content for one slice / stage: one row with value and percent.
 */
export function getChartPartTooltip(
  slice: Pick<
    ChartPartRenderSlice,
    "id" | "color" | "label" | "value" | "percent"
  >,
): ChartTooltipContent {
  return {
    title: "",
    items: [
      {
        id: slice.id,
        name: slice.label,
        color: slice.color,
        value: slice.value,
        percent: slice.percent,
      },
    ],
  };
}

/**
 * Accessible data table: one row per slice / stage (label, value, percent).
 */
export function getChartPartTable({
  locale,
  slices,
  headers,
}: {
  headers: { label: string; percent: string; value: string };
  locale?: string;
  slices: ReadonlyArray<
    Pick<ChartPartRenderSlice, "id" | "label" | "value" | "percent">
  >;
}): ChartTable {
  return {
    headers: [headers.label, headers.value, headers.percent],
    rows: slices.map((slice) => {
      return {
        key: slice.id,
        cells: [
          slice.label,
          formatChartValue(slice.value, locale),
          formatChartPercent(slice.percent, locale),
        ],
      };
    }),
  };
}

/**
 * Interpolation params for the pie summary (`count`, `items`).
 */
export function getChartPieSummaryParams({
  locale,
  slices,
}: {
  locale?: string;
  slices: ReadonlyArray<Pick<ChartPartRenderSlice, "label" | "percent">>;
}): { count: number; items: string } {
  return {
    count: slices.length,
    items: slices
      .map((slice) => {
        return `${slice.label} ${formatChartPercent(slice.percent, locale)}`;
      })
      .join(", "),
  };
}

/**
 * Interpolation params for the funnel summary
 * (`count`, `first`, `firstValue`, `last`, `lastValue`).
 */
export function getChartFunnelSummaryParams({
  locale,
  slices,
}: {
  locale?: string;
  slices: ReadonlyArray<Pick<ChartPartRenderSlice, "label" | "value">>;
}): {
  count: number;
  first: string;
  firstValue: string;
  last: string;
  lastValue: string;
} {
  const first = slices[0];
  const final = last(slices);

  return {
    count: slices.length,
    last: final?.label ?? "",
    first: first?.label ?? "",
    lastValue: isNil(final) ? "" : formatChartValue(final.value, locale),
    firstValue: isNil(first) ? "" : formatChartValue(first.value, locale),
  };
}
