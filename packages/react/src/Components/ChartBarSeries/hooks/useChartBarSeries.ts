// ** External Imports
import { castArray, isNil } from "es-toolkit/compat";

// ** Local Imports
import type { ChartBarSeriesProps } from "@/Components/ChartBarSeries/chartBarSeries.types";
import {
  useChartSeries,
  type ChartBarSeriesRegistration,
} from "@/Utils/Charts";

export function useChartBarSeries(props: ChartBarSeriesProps) {
  const entry = useChartSeries<ChartBarSeriesRegistration>({
    families: ["bar"],
    componentName: "ChartBarSeries",
    entry: {
      kind: "bar",
      tone: props.tone,
      name: props.name,
      data: props.data,
      color: props.color,
      stack: props.stack,
      labels: props.labels,
      colorBy: props.colorBy,
      colorRanges: props.colorRanges,
      reference: isNil(props.reference)
        ? undefined
        : castArray(props.reference),
    },
  });

  return {
    entry,
  };
}
