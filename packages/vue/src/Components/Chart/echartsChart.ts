/**
 * ECharts plot mounted into a host node owned by `Chart`.
 * Framework-agnostic: `echarts/core` `init` against a DOM element.
 * Legend, tooltip content, and a11y stay in Bridge — the ECharts tooltip
 * only drives the axis pointer (`showContent: false`).
 */

// ** External Imports
import {
  BarChart,
  LineChart,
  type BarSeriesOption,
  type LineSeriesOption,
} from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  type GridComponentOption,
  type TooltipComponentOption,
} from "echarts/components";
import { init, use, type ComposeOption, type ECharts } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { get, isArray, isNil, isNumber } from "es-toolkit/compat";

// ** Core Imports
import {
  hasChartBarSeries,
  type ChartHandle,
  type ChartMountOptions,
  type ChartRenderAxis,
  type ChartRenderOptions,
  type ChartRenderSeries,
  type ChartRenderTheme,
} from "@bridge-ui/core/Domain";

type EChartsOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | GridComponentOption
  | TooltipComponentOption
>;

/** Opacity of the fill under `area` series. */
const AREA_OPACITY = 0.15;

/** Maximum bar width (px) so sparse bar charts stay readable. */
const BAR_MAX_WIDTH = 32;

use([LineChart, BarChart, GridComponent, TooltipComponent, SVGRenderer]);

/**
 * Axis label style shared by both axes.
 */
function labelStyle(theme: ChartRenderTheme) {
  return {
    color: theme.textColor,
    fontSize: theme.fontSize,
    fontFamily: theme.fontFamily,
  };
}

/**
 * Maps a Bridge series to an ECharts line / bar series.
 */
function toSeriesOption(
  series: ChartRenderSeries,
): BarSeriesOption | LineSeriesOption {
  if (series.type === "bar") {
    return {
      type: "bar",
      id: series.id,
      name: series.name,
      data: series.data,
      barMaxWidth: BAR_MAX_WIDTH,
      emphasis: { focus: "series" },
      itemStyle: { color: series.color, borderRadius: [4, 4, 0, 0] },
    };
  }

  return {
    type: "line",
    symbolSize: 6,
    id: series.id,
    symbol: "circle",
    showSymbol: false,
    name: series.name,
    data: series.data,
    connectNulls: false,
    emphasis: { focus: "series" },
    smooth: series.curve === "smooth",
    itemStyle: { color: series.color },
    lineStyle: { width: 2, color: series.color },
    areaStyle:
      series.type === "area"
        ? { color: series.color, opacity: AREA_OPACITY }
        : undefined,
  };
}

/**
 * Wraps `formatTick` for ECharts `axisLabel.formatter`.
 */
function tickFormatter(axis: ChartRenderAxis) {
  const format = axis.formatTick;

  if (isNil(format)) {
    return undefined;
  }

  return (value: number | string) => {
    return format(value);
  };
}

/**
 * Builds the ECharts option for the current render options.
 */
export function buildEchartsOption(options: ChartRenderOptions): EChartsOption {
  const { theme, xAxis, yAxis } = options;
  const hasBar = hasChartBarSeries(options.series);
  const nameGap = Math.round(theme.fontSize * 2.25);

  return {
    animation: options.animation,
    series: options.series.map(toSeriesOption),
    textStyle: { fontSize: theme.fontSize, fontFamily: theme.fontFamily },
    grid: {
      left: 4,
      right: 12,
      outerBoundsMode: "same",
      outerBoundsContain: "axisLabel",
      top: isNil(yAxis.label) ? 12 : nameGap,
      bottom: isNil(xAxis.label) ? 4 : nameGap,
    },
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
    yAxis: {
      type: "value",
      min: yAxis.min,
      max: yAxis.max,
      name: yAxis.label,
      show: !yAxis.hidden,
      nameLocation: "end",
      axisLine: { show: false },
      splitNumber: yAxis.tickCount,
      nameTextStyle: labelStyle(theme),
      axisLabel: { ...labelStyle(theme), formatter: tickFormatter(yAxis) },
      splitLine: { show: yAxis.grid, lineStyle: { color: theme.gridColor } },
    },
    xAxis: {
      nameGap,
      type: "category",
      name: xAxis.label,
      boundaryGap: hasBar,
      show: !xAxis.hidden,
      nameLocation: "middle",
      data: options.categories,
      axisTick: { show: false },
      nameTextStyle: labelStyle(theme),
      axisLine: { lineStyle: { color: theme.axisColor } },
      axisLabel: { ...labelStyle(theme), formatter: tickFormatter(xAxis) },
      splitLine: { show: xAxis.grid, lineStyle: { color: theme.gridColor } },
    },
  };
}

/**
 * Reads the hovered category index from an `updateAxisPointer` event.
 */
function readAxisPointerIndex(event: unknown): null | number {
  const axesInfo = get(event, "axesInfo");
  const value: unknown = isArray(axesInfo) ? get(axesInfo, [0, "value"]) : null;

  return isNumber(value) ? value : null;
}

/**
 * Mounts an ECharts plot into `options.element`.
 */
export function mountEchartsChart(options: ChartMountOptions): ChartHandle {
  let current: ChartRenderOptions = options;
  let chart: null | ECharts = null;
  let lastIndex: null | number = null;
  let silent = false;

  const emit = (index: null | number) => {
    if (silent || index === lastIndex) {
      return;
    }

    lastIndex = index;
    options.onActiveIndexChange(index);
  };

  const ensureChart = (): null | ECharts => {
    if (!isNil(chart)) {
      return chart;
    }

    // ECharts measures the DOM when width / height are 0; wait for a size.
    if (current.width <= 0 || current.height <= 0) {
      return null;
    }

    chart = init(options.element, null, {
      renderer: "svg",
      width: current.width,
      height: current.height,
    });

    chart.on("updateAxisPointer", (event: unknown) => {
      emit(readAxisPointerIndex(event));
    });

    chart.getZr().on("globalout", () => {
      emit(null);
    });

    return chart;
  };

  const render = () => {
    const instance = ensureChart();

    if (isNil(instance)) {
      return;
    }

    const { width, height } = current;

    if (instance.getWidth() !== width || instance.getHeight() !== height) {
      instance.resize({ width, height });
    }

    instance.setOption(buildEchartsOption(current), {
      replaceMerge: ["series"],
    });
  };

  render();

  return {
    update: (next) => {
      current = next;
      render();
    },
    destroy: () => {
      chart?.dispose();
      chart = null;
    },
    highlightSeries: (id) => {
      chart?.dispatchAction({ type: "downplay" });

      if (!isNil(id)) {
        chart?.dispatchAction({ seriesId: id, type: "highlight" });
      }
    },
    setActiveIndex: (index) => {
      if (isNil(chart) || current.series.length === 0) {
        return;
      }

      silent = true;
      lastIndex = index;

      if (isNil(index)) {
        chart.dispatchAction({ type: "hideTip" });
      } else {
        chart.dispatchAction({
          seriesIndex: 0,
          type: "showTip",
          dataIndex: index,
        });
      }

      silent = false;
    },
    getCategoryAnchor: (index) => {
      if (isNil(chart) || index < 0 || index >= current.categories.length) {
        return null;
      }

      const x = chart.convertToPixel({ xAxisIndex: 0 }, index);

      if (!isNumber(x)) {
        return null;
      }

      const tops = current.series.flatMap((series) => {
        const value = series.data[index];

        if (!isNumber(value)) {
          return [];
        }

        const point = chart?.convertToPixel({ gridIndex: 0 }, [index, value]);

        return isArray(point) && isNumber(point[1]) ? [point[1]] : [];
      });

      return {
        x,
        y: tops.length > 0 ? Math.min(...tops) : current.height / 2,
      };
    },
  };
}
