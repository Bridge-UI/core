// ** Local Imports
import type { ChartLineProps } from "@/Components/ChartLine/chartLine.types";
import { mountEchartsLine } from "@/Utils/Chart/echarts/line";
import {
  useChartCartesian,
  type ChartCartesianMerged,
} from "@/Utils/Chart/useChartCartesian";

export function useChartLine(
  props: ChartLineProps,
  libDefaults: Partial<ChartCartesianMerged>,
) {
  return useChartCartesian(props, {
    libDefaults,
    kind: "line",
    mount: mountEchartsLine,
    componentName: "ChartLine",
  });
}
