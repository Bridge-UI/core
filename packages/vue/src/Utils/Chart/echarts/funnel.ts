// ** External Imports
import { FunnelChart, type FunnelSeriesOption } from "echarts/charts";
import {
  TooltipComponent,
  type TooltipComponentOption,
} from "echarts/components";
import { use, type ComposeOption, type ECharts } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { get, isArray, isNumber } from "es-toolkit/compat";

// ** Core Imports
import type {
  ChartFunnelRenderOptions,
  ChartHandle,
  ChartMountOptions,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import {
  createEchartsPartFamily,
  formatSliceLabel,
} from "@/Utils/Chart/echarts/part";
import {
  labelStyle,
  mountEchartsPlot,
  readItemLayout,
} from "@/Utils/Chart/echarts/plot";

use([FunnelChart, SVGRenderer, TooltipComponent]);

type EChartsFunnelOption = ComposeOption<
  FunnelSeriesOption | TooltipComponentOption
>;

/**
 * Horizontal room for the shape: narrower with outside labels, shifted
 * away from the side the labels sit on.
 */
function getFunnelBox(options: ChartFunnelRenderOptions) {
  if (options.labels !== "outside") {
    return { left: "4%", width: "92%" };
  }

  return { width: "60%", left: options.align === "right" ? "36%" : "4%" };
}

/**
 * Builds the ECharts option for a funnel plot. Stages arrive sorted, so
 * the data index matches the keyboard order.
 */
export function buildEchartsFunnelOption(
  options: ChartFunnelRenderOptions,
): EChartsFunnelOption {
  const { theme, labels, slices } = options;

  const outsidePosition =
    options.align === "right" ? ("left" as const) : ("right" as const);

  const label = {
    show: labels !== false,
    ...labelStyle(theme),
    formatter: formatSliceLabel(slices),
    color: labels === "inside" ? "#fff" : theme.textColor,
    position: labels === "inside" ? ("inside" as const) : outsidePosition,
  };

  return {
    animation: options.animation,
    tooltip: { show: true, trigger: "item", showContent: false },
    textStyle: { fontSize: theme.fontSize, fontFamily: theme.fontFamily },
    series: [
      {
        label,
        gap: 2,
        top: 4,
        bottom: 4,
        sort: "none",
        type: "funnel",
        ...getFunnelBox(options),
        emphasis: { label },
        funnelAlign: options.align,
        labelLine: {
          show: labels === "outside",
          lineStyle: { color: theme.axisColor },
        },
        data: slices.map((slice) => {
          return {
            id: slice.id,
            name: slice.label,
            value: slice.value,
            itemStyle: { color: slice.color },
          };
        }),
      },
    ],
  };
}

/**
 * Top center of stage `index`.
 */
function getStageAnchor(chart: ECharts, index: number) {
  const points: unknown = get(readItemLayout(chart, index), "points");

  if (!isArray(points) || points.length < 2) {
    return null;
  }

  const [left, right] = points as unknown[];
  const x1: unknown = get(left, 0);
  const x2: unknown = get(right, 0);
  const y: unknown = get(left, 1);

  if (!isNumber(x1) || !isNumber(x2) || !isNumber(y)) {
    return null;
  }

  return { y, x: (x1 + x2) / 2 };
}

const family = createEchartsPartFamily<ChartFunnelRenderOptions>(
  buildEchartsFunnelOption,
  getStageAnchor,
);

/**
 * Mounts a funnel plot (tree-shaken: funnel series only).
 */
export function mountEchartsFunnel(
  options: ChartMountOptions<ChartFunnelRenderOptions>,
): ChartHandle<ChartFunnelRenderOptions> {
  return mountEchartsPlot(options, family);
}
