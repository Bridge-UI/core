// ** External Imports
import { isNil } from "es-toolkit/compat";

// ** Local Imports
import {
  findChartColorRange,
  formatChartValue,
  isChartValue,
  type ChartAxisOptions,
  type ChartBaseRenderOptions,
  type ChartColorRange,
  type ChartTable,
  type ChartTooltipContent,
  type ChartTooltipItem,
} from "@/Domain/chart";

/**
 * One point: `[x, y]`, or `[x, y, size]` for a bubble.
 */
export type ChartScatterPoint = [number, number] | [number, number, number];

/**
 * Series registered by `ChartScatterSeries`.
 */
export type ChartScatterSeriesEntry = {
  /**
   * Color token key or raw CSS color. Falls back to the palette.
   */
  color?: string;

  /**
   * Ranges matched against each point's `y` that recolor single points.
   */
  colorRanges?: ChartColorRange[];

  /**
   * Points.
   */
  data: ChartScatterPoint[];

  /**
   * Stable series id.
   */
  id: string;

  /**
   * Series family.
   */
  kind: "scatter";

  /**
   * Human-readable series name.
   */
  name: string;

  /**
   * Label for the third value (tooltip, table).
   */
  sizeName?: string;

  /**
   * Point size (px) for `[x, y]` points.
   */
  symbolSize?: number;
};

/**
 * Visible series handed to the plot, with its resolved CSS color.
 */
export type ChartScatterRenderSeries = ChartScatterSeriesEntry & {
  /**
   * Resolved CSS color.
   */
  color: string;
};

/**
 * One point in keyboard / tooltip order.
 */
export type ChartScatterFlatPoint = {
  /**
   * Point index inside its series `data`.
   */
  dataIndex: number;

  /**
   * Owning series id.
   */
  seriesId: string;

  /**
   * Owning series index among the rendered series.
   */
  seriesIndex: number;

  /**
   * Third value, or `null` for plain points.
   */
  size: null | number;

  /**
   * Horizontal value.
   */
  x: number;

  /**
   * Vertical value.
   */
  y: number;
};

/**
 * Everything a scatter plot needs to (re)draw.
 */
export type ChartScatterRenderOptions = ChartBaseRenderOptions & {
  /**
   * Min / max bubble diameter (px).
   */
  bubbleSize: [number, number];

  /**
   * Points in keyboard order. `onActiveIndexChange` indexes this list.
   */
  points: ChartScatterFlatPoint[];

  /**
   * Visible series in render order.
   */
  series: ChartScatterRenderSeries[];

  /**
   * Smallest and largest third value across visible series. `null` when
   * there are no bubbles.
   */
  sizeDomain: null | [number, number];

  /**
   * Default point size (px).
   */
  symbolSize: number;

  /**
   * Options for the horizontal axis.
   */
  xAxis: ChartAxisOptions;

  /**
   * Options for the vertical axis.
   */
  yAxis: ChartAxisOptions;
};

/** Default point size (px). */
export const DEFAULT_CHART_SYMBOL_SIZE = 8;

/** Default min / max bubble diameter (px). */
export const DEFAULT_CHART_BUBBLE_SIZE: [number, number] = [8, 40];

/**
 * Whether a point is drawable (finite `x` and `y`).
 */
function isScatterPoint(point: readonly unknown[]): boolean {
  return isChartValue(point[0]) && isChartValue(point[1]);
}

/**
 * Third value of a point, or `null`.
 */
function getPointSize(point: ChartScatterPoint): null | number {
  const size = point[2];

  return isChartValue(size) ? size : null;
}

/**
 * Flattens series into points sorted by `x`, then `y`, then series order.
 * Keyboard navigation and the tooltip follow this order.
 */
export function getChartScatterPoints(
  series: ReadonlyArray<Pick<ChartScatterSeriesEntry, "id" | "data">>,
): ChartScatterFlatPoint[] {
  const points = series.flatMap((item, seriesIndex) => {
    return item.data.flatMap((point, dataIndex) => {
      if (!isScatterPoint(point)) {
        return [];
      }

      return [
        {
          dataIndex,
          seriesIndex,
          x: point[0],
          y: point[1],
          seriesId: item.id,
          size: getPointSize(point),
        },
      ];
    });
  });

  return points.sort((left, right) => {
    return (
      left.x - right.x ||
      left.y - right.y ||
      left.seriesIndex - right.seriesIndex ||
      left.dataIndex - right.dataIndex
    );
  });
}

/**
 * Smallest and largest third value across `series`. `null` without bubbles.
 */
export function getChartBubbleSizeDomain(
  series: ReadonlyArray<Pick<ChartScatterSeriesEntry, "data">>,
): null | [number, number] {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  series.forEach((item) => {
    item.data.forEach((point) => {
      const size = getPointSize(point);

      if (isNil(size)) {
        return;
      }

      min = Math.min(min, size);
      max = Math.max(max, size);
    });
  });

  return Number.isFinite(min) ? [min, max] : null;
}

/**
 * Bubble diameter (px) for `value`, scaled by area so a value twice as big
 * covers twice the area. Values are clamped into `domain`.
 */
export function scaleChartBubbleSize({
  range,
  value,
  domain,
}: {
  domain: [number, number];
  range: [number, number];
  value: number;
}): number {
  const [minSize, maxSize] = range;
  const [min, max] = domain;

  if (max <= min) {
    return maxSize;
  }

  const ratio = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const minArea = minSize ** 2;
  const maxArea = maxSize ** 2;

  return Math.sqrt(minArea + ratio * (maxArea - minArea));
}

/**
 * Whether there is nothing to plot (no drawable point).
 */
export function isChartScatterEmpty(
  series: ReadonlyArray<Pick<ChartScatterSeriesEntry, "data">>,
): boolean {
  return !series.some((item) => item.data.some(isScatterPoint));
}

/**
 * Color range a point's `y` falls in, if any.
 */
export function findChartScatterRange(
  series: Pick<ChartScatterSeriesEntry, "colorRanges">,
  y: number,
): undefined | ChartColorRange {
  return findChartColorRange(series.colorRanges ?? [], y);
}

/**
 * Tooltip content for one point: the series name as title, then `x`, `y`,
 * and the size when present.
 */
export function getChartScatterTooltip({
  point,
  labels,
  series,
}: {
  labels: { size?: string; x: string; y: string };
  point: ChartScatterFlatPoint;
  series: Pick<ChartScatterSeriesEntry, "name" | "colorRanges"> & {
    color: string;
  };
}): ChartTooltipContent {
  const range = findChartScatterRange(series, point.y);
  const note = range?.label;

  const items: ChartTooltipItem[] = [
    { id: "x", name: labels.x, value: point.x },
    {
      id: "y",
      name: labels.y,
      value: point.y,
      ...(isNil(note) ? {} : { note }),
    },
  ];

  if (!isNil(point.size)) {
    items.push({ id: "size", value: point.size, name: labels.size ?? "" });
  }

  return { items, title: series.name, color: range?.color ?? series.color };
}

/**
 * Accessible data table: one row per point (series, x, y, and size when any
 * series has bubbles).
 */
export function getChartScatterTable({
  locale,
  series,
  headers,
}: {
  headers: { series: string; size: string; x: string; y: string };
  locale?: string;
  series: ReadonlyArray<
    Pick<ChartScatterSeriesEntry, "data" | "name" | "colorRanges">
  >;
}): ChartTable {
  const hasSize = !isNil(getChartBubbleSizeDomain(series));

  const format = (value: null | number) => {
    return isNil(value) ? "—" : formatChartValue(value, locale);
  };

  const withNote = (
    item: Pick<ChartScatterSeriesEntry, "colorRanges">,
    y: number,
  ) => {
    const note = findChartScatterRange(item, y)?.label;

    return isNil(note) ? format(y) : `${format(y)} (${note})`;
  };

  return {
    headers: [
      headers.series,
      headers.x,
      headers.y,
      ...(hasSize ? [headers.size] : []),
    ],
    rows: series.flatMap((item, seriesIndex) => {
      return item.data.flatMap((point, dataIndex) => {
        if (!isScatterPoint(point)) {
          return [];
        }

        return [
          {
            key: `${seriesIndex}-${dataIndex}`,
            cells: [
              item.name,
              format(point[0]),
              withNote(item, point[1]),
              ...(hasSize ? [format(getPointSize(point))] : []),
            ],
          },
        ];
      });
    }),
  };
}
