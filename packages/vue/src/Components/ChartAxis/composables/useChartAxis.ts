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

  // Stable wrappers so new formatter functions do not re-register the axis.
  function formatTick(value: number) {
    return props.formatTick?.(value) ?? String(value);
  }

  function formatCategory(category: string) {
    return props.formatCategory?.(category) ?? category;
  }

  const hasFormatTick = computed(() => {
    return !isNil(props.formatTick);
  });

  const hasFormatCategory = computed(() => {
    return !isNil(props.formatCategory);
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
        formatCategory: hasFormatCategory.value ? formatCategory : undefined,
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
