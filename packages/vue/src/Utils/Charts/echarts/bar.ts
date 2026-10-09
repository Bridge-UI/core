// ** External Imports
import { BarChart, LineChart } from "echarts/charts";
import {
  GridComponent,
  MarkLineComponent,
  TooltipComponent,
  VisualMapPiecewiseComponent,
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
import { echartsCartesianFamily } from "@/Utils/Charts/echarts/cartesian";
import { mountEchartsPlot } from "@/Utils/Charts/echarts/plot";

// `LineChart` draws `ChartLineSeries` placed inside `ChartBar`.
use([
  BarChart,
  LineChart,
  LabelLayout,
  GridComponent,
  SVGRenderer,
  TooltipComponent,
  MarkLineComponent,
  VisualMapPiecewiseComponent,
]);

/**
 * Mounts a bar plot (tree-shaken: bar and line series, for bar + line
 * charts).
 */
export function mountEchartsBar(
  options: ChartMountOptions<ChartCartesianRenderOptions>,
): ChartHandle<ChartCartesianRenderOptions> {
  return mountEchartsPlot(options, echartsCartesianFamily);
}
