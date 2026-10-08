// ** External Imports
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  MarkLineComponent,
  TooltipComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { LabelLayout } from "echarts/features";
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
  BarChart,
  LabelLayout,
  GridComponent,
  SVGRenderer,
  TooltipComponent,
  MarkLineComponent,
]);

/**
 * Mounts a bar plot (tree-shaken: bar series only).
 */
export function mountEchartsBar(
  options: ChartMountOptions<ChartCartesianRenderOptions>,
): ChartHandle<ChartCartesianRenderOptions> {
  return mountEchartsPlot(options, echartsCartesianFamily);
}
