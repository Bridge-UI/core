// ** External Imports
import { ScatterChart, type ScatterSeriesOption } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  type GridComponentOption,
  type TooltipComponentOption,
} from "echarts/components";
import { use, type ComposeOption } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { get, isArray, isEmpty, isNil, isNumber } from "es-toolkit/compat";

// ** Core Imports
import {
  findChartScatterRange,
  isChartValue,
  scaleChartBubbleSize,
  type ChartAxisOptions,
  type ChartHandle,
  type ChartMountOptions,
  type ChartScatterRenderOptions,
  type ChartScatterRenderSeries,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import {
  labelStyle,
  mountEchartsPlot,
  type EchartsPlotFamily,
} from "@/Utils/Charts/echarts/plot";

use([ScatterChart, GridComponent, SVGRenderer, TooltipComponent]);

type EChartsScatterOption = ComposeOption<
  GridComponentOption | ScatterSeriesOption | TooltipComponentOption
>;

/** Bubble fill opacity, so overlapping bubbles stay readable. */
const BUBBLE_OPACITY = 0.7;

/**
 * Point diameter (px): scaled by the third value for bubbles.
 */
function getSymbolSize(
  options: ChartScatterRenderOptions,
  series: ChartScatterRenderSeries,
  point: unknown,
): number {
  const size: unknown = isArray(point) ? point[2] : undefined;
  const base = series.symbolSize ?? options.symbolSize;

  if (!isChartValue(size) || isNil(options.sizeDomain)) {
    return base;
  }

  return scaleChartBubbleSize({
    value: size,
    range: options.bubbleSize,
    domain: options.sizeDomain,
  });
}

/**
 * Points, with their own color when `y` falls in a color range.
 */
function toScatterData(
  series: ChartScatterRenderSeries,
): ScatterSeriesOption["data"] {
  if (isEmpty(series.colorRanges)) {
    return series.data;
  }

  return series.data.map((point) => {
    const range = isChartValue(point[1])
      ? findChartScatterRange(series, point[1])
      : undefined;

    return isNil(range)
      ? point
      : { value: point, itemStyle: { color: range.color } };
  });
}

/**
 * Value axis option for one side.
 */
function toAxis(options: ChartScatterRenderOptions, axis: ChartAxisOptions) {
  const { theme } = options;

  return {
    scale: true,
    min: axis.min,
    max: axis.max,
    name: axis.label,
    type: "value" as const,
    show: axis.hidden !== true,
    splitNumber: axis.tickCount,
    nameTextStyle: labelStyle(theme),
    axisLine: { lineStyle: { color: theme.axisColor } },
    splitLine: {
      show: axis.grid ?? true,
      lineStyle: { color: theme.gridColor },
    },
    axisLabel: {
      ...labelStyle(theme),
      formatter: isNil(axis.formatTick)
        ? undefined
        : (value: number) => axis.formatTick?.(Number(value)) ?? String(value),
    },
  };
}

/**
 * Builds the ECharts option for a scatter plot.
 */
export function buildEchartsScatterOption(
  options: ChartScatterRenderOptions,
): EChartsScatterOption {
  const { theme } = options;
  const nameGap = Math.round(theme.fontSize * 2.25);
  const bubbles = !isNil(options.sizeDomain);

  return {
    animation: options.animation,
    tooltip: { show: true, trigger: "item", showContent: false },
    yAxis: { ...toAxis(options, options.yAxis), nameLocation: "end" },
    textStyle: { fontSize: theme.fontSize, fontFamily: theme.fontFamily },
    xAxis: {
      ...toAxis(options, options.xAxis),
      nameGap,
      nameLocation: "middle",
    },
    grid: {
      left: 4,
      outerBoundsMode: "same",
      outerBoundsContain: "axisLabel",
      top: isNil(options.yAxis.label) ? 12 : nameGap,
      right: bubbles ? options.bubbleSize[1] / 2 : 12,
      bottom: isNil(options.xAxis.label) ? 4 : nameGap,
    },
    series: options.series.map((series): ScatterSeriesOption => {
      return {
        id: series.id,
        type: "scatter",
        name: series.name,
        data: toScatterData(series),
        emphasis: { scale: 1.2, focus: "series" },
        symbolSize: (point: unknown) => getSymbolSize(options, series, point),
        itemStyle: {
          color: series.color,
          opacity: bubbles ? BUBBLE_OPACITY : 1,
        },
      };
    }),
  };
}

/**
 * Index of a point in the keyboard order, from its series / data index.
 */
function findPointIndex(
  options: ChartScatterRenderOptions,
  seriesIndex: number,
  dataIndex: number,
): null | number {
  const index = options.points.findIndex((point) => {
    return point.seriesIndex === seriesIndex && point.dataIndex === dataIndex;
  });

  return index === -1 ? null : index;
}

const family: EchartsPlotFamily<ChartScatterRenderOptions> = {
  build: buildEchartsScatterOption,
  highlight: (chart, _, id) => {
    chart.dispatchAction({ type: "downplay" });

    if (!isNil(id)) {
      chart.dispatchAction({ seriesId: id, type: "highlight" });
    }
  },
  attach: (chart, emit, getOptions) => {
    chart.on("mouseover", (event: unknown) => {
      const seriesIndex = get(event, "seriesIndex");
      const dataIndex = get(event, "dataIndex");

      if (isNumber(seriesIndex) && isNumber(dataIndex)) {
        emit(findPointIndex(getOptions(), seriesIndex, dataIndex));
      }
    });

    chart.on("mouseout", () => {
      emit(null);
    });
  },
  showActive: (chart, options, index) => {
    chart.dispatchAction({ type: "downplay" });

    const point = isNil(index) ? undefined : options.points[index];

    if (isNil(point)) {
      chart.dispatchAction({ type: "hideTip" });
      return;
    }

    const target = {
      dataIndex: point.dataIndex,
      seriesIndex: point.seriesIndex,
    };

    chart.dispatchAction({ ...target, type: "highlight" });
    chart.dispatchAction({ ...target, type: "showTip" });
  },
  getAnchor: (chart, options, index) => {
    const point = options.points[index];
    const series = isNil(point) ? undefined : options.series[point.seriesIndex];

    if (isNil(point) || isNil(series)) {
      return null;
    }

    const pixel = chart.convertToPixel({ seriesIndex: point.seriesIndex }, [
      point.x,
      point.y,
    ]);

    if (!isArray(pixel) || !isNumber(pixel[0]) || !isNumber(pixel[1])) {
      return null;
    }

    const size = getSymbolSize(
      options,
      series,
      isNil(point.size) ? [point.x, point.y] : [point.x, point.y, point.size],
    );

    return { x: pixel[0], y: pixel[1] - size / 2 };
  },
};

/**
 * Mounts a scatter plot (tree-shaken: scatter series only).
 */
export function mountEchartsScatter(
  options: ChartMountOptions<ChartScatterRenderOptions>,
): ChartHandle<ChartScatterRenderOptions> {
  return mountEchartsPlot(options, family);
}
