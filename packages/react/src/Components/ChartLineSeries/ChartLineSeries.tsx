// ** Local Imports
import type { ChartLineSeriesProps } from "@/Components/ChartLineSeries/chartLineSeries.types";
import { useChartLineSeries } from "@/Components/ChartLineSeries/hooks/useChartLineSeries";

function ChartLineSeries(props: ChartLineSeriesProps) {
  useChartLineSeries(props);

  return null;
}

export default ChartLineSeries;
