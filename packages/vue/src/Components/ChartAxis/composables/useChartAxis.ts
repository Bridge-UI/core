// ** External Imports
import { isNil, isUndefined, omitBy } from "es-toolkit/compat";
import { computed, onBeforeUnmount, watch } from "vue";

// ** Core Imports
import type {
  ChartAxisPosition,
  ChartRenderAxis,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import { useChartContext } from "@/Components/Chart/chartInjectionKey";
import type { ChartAxisProps } from "@/Components/ChartAxis/chartAxis.types";

export function useChartAxis(props: ChartAxisProps) {
  const chart = useChartContext();

  // Stable wrapper so inline formatters do not re-register the axis each render.
  function formatTick(value: number | string) {
    return props.formatTick?.(value) ?? String(value);
  }

  const hasFormatTick = computed(() => {
    return !isNil(props.formatTick);
  });

  const options = computed((): Partial<ChartRenderAxis> => {
    return omitBy(
      {
        max: props.max,
        min: props.min,
        grid: props.grid,
        label: props.label,
        hidden: props.hidden,
        tickCount: props.tickCount,
        formatTick: hasFormatTick.value ? formatTick : undefined,
      },
      isUndefined,
    );
  });

  watch(
    () => props.position,
    (_, previous?: ChartAxisPosition) => {
      if (!isNil(previous)) {
        chart.value.removeAxis(previous);
      }
    },
  );

  watch(
    [options, () => props.position],
    ([next, position]) => {
      chart.value.setAxis(position, next);
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    chart.value.removeAxis(props.position);
  });

  return {
    options,
  };
}
