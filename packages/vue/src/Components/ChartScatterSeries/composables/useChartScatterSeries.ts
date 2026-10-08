// ** Local Imports
import type { ChartScatterSeriesOwnProps } from "@/Components/ChartScatterSeries/chartScatterSeries.types";
import {
  useChartSeries,
  type ChartScatterSeriesRegistration,
} from "@/Utils/Charts";

export function useChartScatterSeries(props: ChartScatterSeriesOwnProps) {
  const entry = useChartSeries<ChartScatterSeriesRegistration>({
    families: ["scatter"],
    componentName: "ChartScatterSeries",
    entry: () => {
      return {
        kind: "scatter",
        name: props.name,
        data: props.data,
        color: props.color,
        sizeName: props.sizeName,
        symbolSize: props.symbolSize,
      };
    },
  });

  return {
    entry,
  };
}
