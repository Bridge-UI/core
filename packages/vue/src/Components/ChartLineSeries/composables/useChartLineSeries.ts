// ** External Imports
import { castArray, isNil } from "es-toolkit/compat";

// ** Local Imports
import type { ChartLineSeriesOwnProps } from "@/Components/ChartLineSeries/chartLineSeries.types";
import {
  useChartSeries,
  type ChartLineSeriesRegistration,
} from "@/Utils/Chart";

export function useChartLineSeries(props: ChartLineSeriesOwnProps) {
  const entry = useChartSeries<ChartLineSeriesRegistration>({
    family: "line",
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
        showPoints: props.showPoints,
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
