// ** Core Imports
import { mountEchartsLine } from "@bridge-ui/core/Integrations/Echarts";

// ** Local Imports
import type { ChartLineOwnProps } from "@/Components/ChartLine/chartLine.types";
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
