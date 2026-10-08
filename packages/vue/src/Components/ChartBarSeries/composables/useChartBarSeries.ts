// ** External Imports
import { castArray, isNil } from "es-toolkit/compat";

// ** Local Imports
import type { ChartBarSeriesOwnProps } from "@/Components/ChartBarSeries/chartBarSeries.types";
import { useChartSeries, type ChartBarSeriesRegistration } from "@/Utils/Chart";

export function useChartBarSeries(props: ChartBarSeriesOwnProps) {
  const entry = useChartSeries<ChartBarSeriesRegistration>({
    family: "bar",
    componentName: "ChartBarSeries",
    entry: () => {
      return {
        kind: "bar",
        name: props.name,
        data: props.data,
        color: props.color,
        stack: props.stack,
        labels: props.labels,
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
