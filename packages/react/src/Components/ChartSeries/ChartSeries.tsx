// ** Local Imports
import type { ChartSeriesProps } from "@/Components/ChartSeries/chartSeries.types";
import { useChartSeries } from "@/Components/ChartSeries/hooks/useChartSeries";

function ChartSeries(props: ChartSeriesProps) {
  useChartSeries(props, {
    type: "line",
    curve: "linear",
  });

  return null;
}

export default ChartSeries;
