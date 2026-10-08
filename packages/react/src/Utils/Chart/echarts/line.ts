// ** External Imports
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  MarkLineComponent,
  TooltipComponent,
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
import { echartsCartesianFamily } from "@/Utils/Chart/echarts/cartesian";
import { mountEchartsPlot } from "@/Utils/Chart/echarts/plot";

use([
  LineChart,
  GridComponent,
  SVGRenderer,
  TooltipComponent,
  MarkLineComponent,
]);

/**
 * Mounts a line plot (tree-shaken: line series only).
 */
export function mountEchartsLine(
  options: ChartMountOptions<ChartCartesianRenderOptions>,
): ChartHandle<ChartCartesianRenderOptions> {
  return mountEchartsPlot(options, echartsCartesianFamily);
}
