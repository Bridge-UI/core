// ** External Imports
import { castArray, isNil } from "es-toolkit/compat";

// ** Local Imports
import type { ChartLineSeriesProps } from "@/Components/ChartLineSeries/chartLineSeries.types";
import {
  useChartSeries,
  type ChartLineSeriesRegistration,
} from "@/Utils/Chart";

export function useChartLineSeries(props: ChartLineSeriesProps) {
  const entry = useChartSeries<ChartLineSeriesRegistration>({
    families: ["line", "bar"],
    componentName: "ChartLineSeries",
    entry: {
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
    },
  });

  return {
    entry,
  };
}
