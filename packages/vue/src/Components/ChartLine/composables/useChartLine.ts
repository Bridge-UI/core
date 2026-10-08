// ** Local Imports
import type { ChartLineOwnProps } from "@/Components/ChartLine/chartLine.types";
import { mountEchartsLine } from "@/Utils/Charts/echarts/line";
import {
  useChartCartesian,
  type ChartCartesianMerged,
} from "@/Utils/Charts/useChartCartesian";

export function useChartLine(
  props: ChartLineOwnProps,
  libDefaults: Partial<ChartCartesianMerged>,
) {
  return useChartCartesian(props, {
    libDefaults,
    kind: "line",
    mount: mountEchartsLine,
    componentName: "ChartLine",
  });
}
