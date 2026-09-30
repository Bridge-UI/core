// ** External Imports
import { pick } from "es-toolkit/compat";
import { computed, onBeforeUnmount, useId, watch } from "vue";

// ** Core Imports
import type { ChartSeriesEntry } from "@bridge-ui/core/Domain";
import type { LibDefaultsShape, MergeLibDefaults } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useChartContext } from "@/Components/Chart/chartInjectionKey";
import type {
  ChartSeriesOwnProps,
  ChartSeriesProps,
} from "@/Components/ChartSeries/chartSeries.types";
import { useBridgeUIComponent } from "@/Utils";

type ChartSeriesLibDefaults = LibDefaultsShape<
  ChartSeriesOwnProps,
  "type" | "curve"
>;

type ChartSeriesMerged = MergeLibDefaults<
  Pick<ChartSeriesOwnProps, "type" | "curve">,
  ChartSeriesLibDefaults
>;

export function useChartSeries(
  props: ChartSeriesProps,
  libDefaults: ChartSeriesLibDefaults,
) {
  const chart = useChartContext();
  const vueId = useId();
  const id = `${chart.value.id}-series${vueId}`;

  const { merged } = useBridgeUIComponent<ChartSeriesMerged, "ChartSeries">({
    libDefaults,
    componentName: "ChartSeries",
    props: () => pick(props, ["type", "curve"]),
  });

  const entry = computed((): ChartSeriesEntry => {
    return {
      id,
      name: props.name,
      data: props.data,
      color: props.color,
      type: merged.value.type,
      curve: merged.value.curve,
    };
  });

  watch(
    entry,
    (next) => {
      chart.value.upsertSeries(next);
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    chart.value.removeSeries(id);
  });

  return {
    entry,
    merged,
  };
}
