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

// ** Local Imports
import type {
  ChartCartesianRenderOptions,
  ChartHandle,
  ChartMountOptions,
} from "@/Domain";
import { echartsCartesianFamily } from "@/Integrations/Echarts/cartesian";
import { mountEchartsPlot } from "@/Integrations/Echarts/plot";

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
