// ** Local Imports
import type { ChartBarOwnProps } from "@/Components/ChartBar/chartBar.types";
import { mountEchartsBar } from "@/Utils/Charts/echarts/bar";
import {
  useChartCartesian,
  type ChartCartesianMerged,
} from "@/Utils/Charts/useChartCartesian";

export function useChartBar(
  props: ChartBarOwnProps,
  libDefaults: Partial<ChartCartesianMerged>,
) {
  return useChartCartesian(props, {
    libDefaults,
    kind: "bar",
    mount: mountEchartsBar,
    componentName: "ChartBar",
  });
}
