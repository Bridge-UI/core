// ** Local Imports
import type { ChartLineOwnProps } from "@/Components/ChartLine/chartLine.types";
import { mountEchartsLine } from "@/Utils/Chart/echarts/line";
import {
  useChartCartesian,
  type ChartCartesianMerged,
} from "@/Utils/Chart/useChartCartesian";

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
