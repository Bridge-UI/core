// ** External Imports
import { isNil, isUndefined, omitBy } from "es-toolkit/compat";
import { computed, onBeforeUnmount, watch } from "vue";

// ** Core Imports
import type {
  ChartAxisOptions,
  ChartAxisPosition,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import type { ChartAxisProps } from "@/Components/ChartAxis/chartAxis.types";
import { useChartContext } from "@/Utils/Charts";

export function useChartAxis(props: ChartAxisProps) {
  const chart = useChartContext();
  const { setAxis, removeAxis } = chart.value;

  if (isNil(setAxis) || isNil(removeAxis)) {
    throw new Error(
      "ChartAxis must be used within ChartLine, ChartBar, or ChartScatter",
    );
  }

  // Stable wrapper so inline formatters do not re-register the axis each render.
  function formatTick(value: number | string) {
    return props.formatTick?.(value) ?? String(value);
  }

  const hasFormatTick = computed(() => {
    return !isNil(props.formatTick);
  });

  const options = computed((): ChartAxisOptions => {
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
        removeAxis(previous);
      }
    },
  );

  watch(
    [options, () => props.position],
    ([next, position]) => {
      setAxis(position, next);
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    removeAxis(props.position);
  });

  return {
    options,
  };
}
