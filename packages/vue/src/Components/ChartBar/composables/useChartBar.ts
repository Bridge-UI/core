// ** Local Imports
import type { ChartBarOwnProps } from "@/Components/ChartBar/chartBar.types";
import { mountEchartsBar } from "@/Utils/Chart/echarts/bar";
import {
  useChartCartesian,
  type ChartCartesianMerged,
} from "@/Utils/Chart/useChartCartesian";

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
