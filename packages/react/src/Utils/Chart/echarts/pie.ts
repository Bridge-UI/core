// ** External Imports
import { PieChart, type PieSeriesOption } from "echarts/charts";
import {
  TooltipComponent,
  type TooltipComponentOption,
} from "echarts/components";
import { use, type ComposeOption, type ECharts } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { get, isNumber } from "es-toolkit/compat";

// ** Core Imports
import type {
  ChartHandle,
  ChartMountOptions,
  ChartPieRenderOptions,
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

use([PieChart, SVGRenderer, TooltipComponent]);

type EChartsPieOption = ComposeOption<PieSeriesOption | TooltipComponentOption>;

/** Outer radius (%) with labels outside the pie. */
const OUTSIDE_RADIUS = 70;

/** Outer radius (%) without outside labels. */
const FULL_RADIUS = 92;

/**
 * Builds the ECharts option for a pie or donut plot.
 */
export function buildEchartsPieOption(
  options: ChartPieRenderOptions,
): EChartsPieOption {
  const { theme, labels, slices } = options;
  const outer = labels === "outside" ? OUTSIDE_RADIUS : FULL_RADIUS;
  const donut = options.variant === "donut";
  const thickness = Math.min(1, Math.max(0, options.thickness));
  const inner = donut ? Math.round(outer * (1 - thickness)) : 0;

  const label = {
    show: labels !== false,
    ...labelStyle(theme),
    formatter: formatSliceLabel(slices),
    color: labels === "inside" ? "#fff" : theme.textColor,
    position: labels === "inside" ? ("inside" as const) : ("outside" as const),
  };

  return {
    animation: options.animation,
    tooltip: { show: true, trigger: "item", showContent: false },
    textStyle: { fontSize: theme.fontSize, fontFamily: theme.fontFamily },
    series: [
      {
        label,
        type: "pie",
        center: ["50%", "50%"],
        avoidLabelOverlap: true,
        minAngle: options.minAngle,
        radius: [`${inner}%`, `${outer}%`],
        itemStyle: { borderRadius: donut ? 2 : 0 },
        padAngle: donut && slices.length > 1 ? 1 : 0,
        emphasis: { label, scale: true, scaleSize: 4 },
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
 * Point on the outer edge, in the middle of slice `index`.
 */
function getSliceAnchor(chart: ECharts, index: number) {
  const layout = readItemLayout(chart, index);
  const cx = get(layout, "cx");
  const cy = get(layout, "cy");
  const r = get(layout, "r");
  const startAngle = get(layout, "startAngle");
  const endAngle = get(layout, "endAngle");

  if (
    !isNumber(cx) ||
    !isNumber(cy) ||
    !isNumber(r) ||
    !isNumber(startAngle) ||
    !isNumber(endAngle)
  ) {
    return null;
  }

  const angle = (startAngle + endAngle) / 2;

  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

const family = createEchartsPartFamily<ChartPieRenderOptions>(
  buildEchartsPieOption,
  getSliceAnchor,
);

/**
 * Mounts a pie / donut plot (tree-shaken: pie series only).
 */
export function mountEchartsPie(
  options: ChartMountOptions<ChartPieRenderOptions>,
): ChartHandle<ChartPieRenderOptions> {
  return mountEchartsPlot(options, family);
}
