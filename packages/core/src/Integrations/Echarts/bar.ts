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

// ** Local Imports
import type {
  ChartCartesianRenderOptions,
  ChartHandle,
  ChartMountOptions,
} from "@/Domain";
import { echartsCartesianFamily } from "@/Integrations/Echarts/cartesian";
import { mountEchartsPlot } from "@/Integrations/Echarts/plot";

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
