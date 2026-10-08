// ** External Imports
import type { BarSeriesOption, LineSeriesOption } from "echarts/charts";
import type {
  GridComponentOption,
  MarkLineComponentOption,
  TooltipComponentOption,
} from "echarts/components";
import type { ComposeOption, ECharts } from "echarts/core";
import { get, isArray, isNil, isNumber } from "es-toolkit/compat";

// ** Core Imports
import {
  getChartNearestIndex,
  getChartStackEnds,
  isChartValue,
  resolveChartBarRadii,
  resolveChartCartesianAxes,
  type ChartAxisOptions,
  type ChartCartesianRenderOptions,
  type ChartCartesianRenderSeries,
  type ChartDatum,
  type ChartReference,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import {
  labelStyle,
  type EchartsPlotFamily,
} from "@/Utils/Charts/echarts/plot";

type EChartsCartesianOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | GridComponentOption
  | TooltipComponentOption
  | MarkLineComponentOption
>;

/** Opacity of the fill under `area` series. */
const AREA_OPACITY = 0.15;

/** Maximum bar width (px) so sparse bar charts stay readable. */
const BAR_MAX_WIDTH = 32;

/**
 * ECharts `axisLabel.formatter` for an axis: `formatCategory` on a category
 * axis, `formatTick` on value and time axes (ECharts passes the raw tick).
 */
function tickFormatter(
  axis: ChartAxisOptions,
  type: "time" | "value" | "category",
) {
  const formatTick = axis.formatTick;
  const formatCategory = axis.formatCategory;

  if (type === "category") {
    return isNil(formatCategory)
      ? undefined
      : (value: number | string) => formatCategory(String(value));
  }

  return isNil(formatTick)
    ? undefined
    : (value: number | string) => formatTick(Number(value));
}

/**
 * Data point for a category: the value, or `[timestamp, value]` on a time
 * axis (`[value, timestamp]` when bars are horizontal).
 */
function toPoint(
  options: ChartCartesianRenderOptions,
  value: ChartDatum,
  index: number,
): ChartDatum | [ChartDatum, number] | [number, ChartDatum] {
  const timestamp = options.timestamps?.[index];

  if (isNil(timestamp)) {
    return value;
  }

  return options.orientation === "horizontal"
    ? [value, timestamp]
    : [timestamp, value];
}

/**
 * Reference lines as an ECharts `markLine`.
 */
function toMarkLine(
  options: ChartCartesianRenderOptions,
  series: ChartCartesianRenderSeries,
): undefined | MarkLineComponentOption {
  if (series.reference.length === 0) {
    return undefined;
  }

  const valueKey = options.orientation === "horizontal" ? "xAxis" : "yAxis";

  const toLabel = (reference: ChartReference) => {
    return {
      ...labelStyle(options.theme),
      position: "insideEndTop" as const,
      formatter: (params: unknown) => {
        return (
          reference.label ?? options.formatLabel(Number(get(params, "value")))
        );
      },
    };
  };

  return {
    silent: true,
    symbol: "none",
    animation: false,
    lineStyle: { width: 1, type: "dashed", color: series.color },
    data: series.reference.map((reference) => {
      return "type" in reference
        ? { type: reference.type, label: toLabel(reference) }
        : { label: toLabel(reference), [valueKey]: reference.value };
    }),
  };
}

/**
 * Hides an inside label that does not fit its bar segment. ECharts has no
 * `hide` here, so the font size drops to 0.
 */
function fitInsideLabel(params: unknown) {
  const rect = get(params, "rect") as unknown;
  const label = get(params, "labelRect") as unknown;
  const fits =
    Number(get(label, "width")) <= Number(get(rect, "width")) - 4 &&
    Number(get(label, "height")) <= Number(get(rect, "height"));

  return fits ? {} : { fontSize: 0 };
}

/**
 * Plot label options for value labels.
 */
function toLabel(
  options: ChartCartesianRenderOptions,
  series: ChartCartesianRenderSeries,
  position: "top" | "right" | "inside",
) {
  if (!series.labels) {
    return undefined;
  }

  return {
    position,
    show: true,
    ...labelStyle(options.theme),
    // Inside a filled bar the theme text color has no contrast.
    color: position === "inside" ? "#fff" : options.theme.textColor,
    formatter: (params: unknown) => {
      const value = get(series.data, Number(get(params, "dataIndex")));

      return isChartValue(value) ? options.formatLabel(value) : "";
    },
  };
}

/**
 * Maps a Bridge series to an ECharts line / bar series.
 */
function toSeriesOption(
  options: ChartCartesianRenderOptions,
  series: ChartCartesianRenderSeries,
  radii: Record<string, Array<null | number[]>>,
): BarSeriesOption | LineSeriesOption {
  const markLine = toMarkLine(options, series);

  if (series.kind === "bar") {
    const position = !isNil(series.stack)
      ? "inside"
      : options.orientation === "horizontal"
        ? "right"
        : "top";

    return {
      markLine,
      type: "bar",
      id: series.id,
      name: series.name,
      stack: series.stack,
      barMaxWidth: BAR_MAX_WIDTH,
      emphasis: { focus: "series" },
      itemStyle: { color: series.color },
      label: toLabel(options, series, position),
      labelLayout:
        position === "inside" ? fitInsideLabel : { hideOverlap: true },
      data: series.data.map((value, index) => {
        const point = toPoint(options, value, index);

        if (!isChartValue(value)) {
          return point;
        }

        return {
          value: point,
          itemStyle: { borderRadius: get(radii, [series.id, index]) ?? 0 },
        };
      }) as BarSeriesOption["data"],
    };
  }

  return {
    markLine,
    type: "line",
    id: series.id,
    symbolSize: 6,
    symbol: "circle",
    name: series.name,
    step: series.step,
    stack: series.stack,
    connectNulls: false,
    showSymbol: series.showPoints,
    emphasis: { focus: "series" },
    smooth: series.curve === "smooth",
    itemStyle: { color: series.color },
    label: toLabel(options, series, "top"),
    areaStyle: series.area
      ? { color: series.color, opacity: AREA_OPACITY }
      : undefined,
    data: series.data.map((value, index) => {
      return toPoint(options, value, index);
    }) as LineSeriesOption["data"],
    lineStyle: {
      color: series.color,
      width: options.sparkline ? 1.5 : 2,
      type: series.dashed ? "dashed" : "solid",
    },
  };
}

/**
 * Builds the ECharts option for a line or bar plot.
 */
export function buildEchartsCartesianOption(
  options: ChartCartesianRenderOptions,
): EChartsCartesianOption {
  const { theme, sparkline, orientation } = options;
  const isTime = !isNil(options.timestamps);
  const nameGap = Math.round(theme.fontSize * 2.25);

  const hasBar = options.series.some((item) => item.kind === "bar");
  const hasLabels = options.series.some((item) => item.labels);

  const axes = resolveChartCartesianAxes({
    orientation,
    xAxis: options.xAxis,
    yAxis: options.yAxis,
  });

  const radii = resolveChartBarRadii({
    orientation,
    radius: options.radius,
    series: options.series.filter((item) => item.kind === "bar"),
  });

  const horizontal = axes.categoryPosition === "y";
  const { value, category } = axes;

  const categoryBase = {
    min: category.min,
    max: category.max,
    name: category.label,
    axisTick: { show: false },
    nameTextStyle: labelStyle(theme),
    show: !category.hidden && !sparkline,
    nameGap: horizontal ? undefined : nameGap,
    axisLine: { lineStyle: { color: theme.axisColor } },
    nameLocation: horizontal ? ("end" as const) : ("middle" as const),
    splitLine: {
      show: category.grid && !sparkline,
      lineStyle: { color: theme.gridColor },
    },
    axisLabel: {
      ...labelStyle(theme),
      formatter: tickFormatter(category, isTime ? "time" : "category"),
    },
  };

  // Horizontal bars list the first category at the top.
  const categoryAxis = isTime
    ? { ...categoryBase, inverse: horizontal, type: "time" as const }
    : {
        ...categoryBase,
        inverse: horizontal,
        boundaryGap: hasBar,
        data: options.categories,
        type: "category" as const,
      };

  const valueAxis = {
    min: value.min,
    max: value.max,
    name: value.label,
    type: "value" as const,
    axisLine: { show: false },
    splitNumber: value.tickCount,
    nameTextStyle: labelStyle(theme),
    show: !value.hidden && !sparkline,
    nameGap: horizontal ? nameGap : undefined,
    nameLocation: horizontal ? ("middle" as const) : ("end" as const),
    axisLabel: {
      ...labelStyle(theme),
      formatter: tickFormatter(value, "value"),
    },
    splitLine: {
      show: value.grid && !sparkline,
      lineStyle: { color: theme.gridColor },
    },
  };

  const yLabel = horizontal ? category.label : value.label;
  const xLabel = horizontal ? value.label : category.label;
  const labelRoom = hasLabels ? Math.round(theme.fontSize * 1.5) : 0;

  return {
    animation: options.animation,
    xAxis: horizontal ? valueAxis : categoryAxis,
    yAxis: horizontal ? categoryAxis : valueAxis,
    textStyle: { fontSize: theme.fontSize, fontFamily: theme.fontFamily },
    series: options.series.map((item) => {
      return toSeriesOption(options, item, radii);
    }),
    tooltip: {
      show: true,
      trigger: "axis",
      showContent: false,
      axisPointer: {
        type: hasBar ? "shadow" : "line",
        lineStyle: { color: theme.axisColor },
        shadowStyle: { opacity: 0.5, color: theme.gridColor },
      },
    },
    grid: sparkline
      ? {
          left: 2,
          right: 2,
          bottom: 2,
          top: 2 + labelRoom,
          outerBoundsMode: "none",
        }
      : {
          left: 4,
          outerBoundsMode: "same",
          outerBoundsContain: "axisLabel",
          bottom: isNil(xLabel) ? 4 : nameGap,
          right: 12 + (horizontal ? labelRoom * 2 : 0),
          top: (isNil(yLabel) ? 12 : nameGap) + (horizontal ? 0 : labelRoom),
        },
  };
}

/**
 * Reads the hovered category index from an `updateAxisPointer` event.
 * On a time axis the pointer value is a timestamp: it snaps to the nearest
 * category.
 */
function readAxisPointerIndex(
  event: unknown,
  options: ChartCartesianRenderOptions,
): null | number {
  const axesInfo = get(event, "axesInfo");
  const value: unknown = isArray(axesInfo) ? get(axesInfo, [0, "value"]) : null;

  if (!isNumber(value)) {
    return null;
  }

  return isNil(options.timestamps)
    ? value
    : getChartNearestIndex(options.timestamps, value);
}

/**
 * Category coordinate on its axis: the index, or the timestamp.
 */
function getCategoryValue(
  options: ChartCartesianRenderOptions,
  index: number,
): number {
  return options.timestamps?.[index] ?? index;
}

/**
 * Line / bar pieces for {@link mountEchartsPlot}.
 */
export const echartsCartesianFamily: EchartsPlotFamily<ChartCartesianRenderOptions> =
  {
    build: buildEchartsCartesianOption,
    getAnchor: (chart, options, index) => {
      return getCartesianAnchor(chart, options, index);
    },
    attach: (chart, emit, getOptions) => {
      chart.on("updateAxisPointer", (event: unknown) => {
        emit(readAxisPointerIndex(event, getOptions()));
      });
    },
    highlight: (chart, _, id) => {
      chart.dispatchAction({ type: "downplay" });

      if (!isNil(id)) {
        chart.dispatchAction({ seriesId: id, type: "highlight" });
      }
    },
    showActive: (chart, options, index) => {
      if (options.series.length === 0) {
        return;
      }

      if (isNil(index)) {
        chart.dispatchAction({ type: "hideTip" });
        return;
      }

      chart.dispatchAction({
        seriesIndex: 0,
        type: "showTip",
        dataIndex: index,
      });
    },
  };

/**
 * Tooltip anchor: the category center and the outermost value (stack ends
 * included).
 */
function getCartesianAnchor(
  chart: ECharts,
  options: ChartCartesianRenderOptions,
  index: number,
) {
  if (index < 0 || index >= options.categories.length) {
    return null;
  }

  const horizontal = options.orientation === "horizontal";
  const categoryValue = getCategoryValue(options, index);

  const center = chart.convertToPixel(
    horizontal ? { yAxisIndex: 0 } : { xAxisIndex: 0 },
    categoryValue,
  );

  if (!isNumber(center)) {
    return null;
  }

  const ends = getChartStackEnds(options.series);

  const edges = options.series.flatMap((series) => {
    const end = get(ends, [series.id, index]);

    if (!isChartValue(end)) {
      return [];
    }

    const point = chart.convertToPixel(
      { gridIndex: 0 },
      horizontal ? [end, categoryValue] : [categoryValue, end],
    );

    const pixel = isArray(point) ? point[horizontal ? 0 : 1] : null;

    return isNumber(pixel) ? [pixel] : [];
  });

  if (horizontal) {
    return {
      y: center,
      x: edges.length > 0 ? Math.max(...edges) : options.width / 2,
    };
  }

  return {
    x: center,
    y: edges.length > 0 ? Math.min(...edges) : options.height / 2,
  };
}
