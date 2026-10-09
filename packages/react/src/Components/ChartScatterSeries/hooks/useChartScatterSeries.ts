// ** Local Imports
import type { ChartScatterSeriesProps } from "@/Components/ChartScatterSeries/chartScatterSeries.types";
import {
  useChartSeries,
  type ChartScatterSeriesRegistration,
} from "@/Utils/Charts";

export function useChartScatterSeries(props: ChartScatterSeriesProps) {
  const entry = useChartSeries<ChartScatterSeriesRegistration>({
    families: ["scatter"],
    componentName: "ChartScatterSeries",
    entry: {
      kind: "scatter",
      name: props.name,
      data: props.data,
      color: props.color,
      sizeName: props.sizeName,
      symbolSize: props.symbolSize,
      colorRanges: props.colorRanges,
    },
  });

  return {
    entry,
  };
}
