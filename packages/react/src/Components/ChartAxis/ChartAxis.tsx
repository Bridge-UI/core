// ** Local Imports
import type { ChartAxisProps } from "@/Components/ChartAxis/chartAxis.types";
import { useChartAxis } from "@/Components/ChartAxis/hooks/useChartAxis";

function ChartAxis(props: ChartAxisProps) {
  useChartAxis(props);

  return null;
}

export default ChartAxis;
