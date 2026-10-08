// ** Local Imports
import type { ChartBarSeriesProps } from "@/Components/ChartBarSeries/chartBarSeries.types";
import { useChartBarSeries } from "@/Components/ChartBarSeries/hooks/useChartBarSeries";

function ChartBarSeries(props: ChartBarSeriesProps) {
  useChartBarSeries(props);

  return null;
}

export default ChartBarSeries;
