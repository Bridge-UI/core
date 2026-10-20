// ** Core Imports
import { mountEchartsBar } from "@bridge-ui/core/Integrations/Echarts";

// ** Local Imports
import type { ChartBarOwnProps } from "@/Components/ChartBar/chartBar.types";
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
