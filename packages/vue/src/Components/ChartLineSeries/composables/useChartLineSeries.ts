// ** External Imports
import { castArray, isNil } from "es-toolkit/compat";

// ** Local Imports
import type { ChartLineSeriesOwnProps } from "@/Components/ChartLineSeries/chartLineSeries.types";
import {
  useChartSeries,
  type ChartLineSeriesRegistration,
} from "@/Utils/Charts";

export function useChartLineSeries(props: ChartLineSeriesOwnProps) {
  const entry = useChartSeries<ChartLineSeriesRegistration>({
    families: ["line", "bar"],
    componentName: "ChartLineSeries",
    entry: () => {
      return {
        kind: "line",
        area: props.area,
        name: props.name,
        data: props.data,
        step: props.step,
        color: props.color,
        curve: props.curve,
        stack: props.stack,
        dashed: props.dashed,
        labels: props.labels,
        colorBy: props.colorBy,
        showPoints: props.showPoints,
        areaOpacity: props.areaOpacity,
        colorRanges: props.colorRanges,
        reference: isNil(props.reference)
          ? undefined
          : castArray(props.reference),
      };
    },
  });

  return {
    entry,
  };
}
