// ** External Imports
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  MarkLineComponent,
  TooltipComponent,
  VisualMapPiecewiseComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";

// ** Core Imports
import type {
  ChartCartesianRenderOptions,
  ChartHandle,
  ChartMountOptions,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import { echartsCartesianFamily } from "@/Utils/Charts/echarts/cartesian";
import { mountEchartsPlot } from "@/Utils/Charts/echarts/plot";

use([
  LineChart,
  GridComponent,
  SVGRenderer,
  TooltipComponent,
  MarkLineComponent,
  VisualMapPiecewiseComponent,
]);

/**
 * Mounts a line plot (tree-shaken: line series only).
 */
export function mountEchartsLine(
  options: ChartMountOptions<ChartCartesianRenderOptions>,
): ChartHandle<ChartCartesianRenderOptions> {
  return mountEchartsPlot(options, echartsCartesianFamily);
}
