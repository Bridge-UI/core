// ** Local Imports
import type { ChartScatterSeriesProps } from "@/Components/ChartScatterSeries/chartScatterSeries.types";
import { useChartScatterSeries } from "@/Components/ChartScatterSeries/hooks/useChartScatterSeries";

function ChartScatterSeries(props: ChartScatterSeriesProps) {
  useChartScatterSeries(props);

  return null;
}

export default ChartScatterSeries;
