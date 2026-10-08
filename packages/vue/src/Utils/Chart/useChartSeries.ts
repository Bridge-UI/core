// ** External Imports
import { isNil, upperFirst } from "es-toolkit/compat";
import { computed, onBeforeUnmount, useId, watch } from "vue";

// ** Local Imports
import {
  useChartContext,
  type ChartFamily,
  type ChartSeriesRegistration,
} from "@/Utils/Chart/chartInjectionKey";

/**
 * Root component name for a family (`bar` → `ChartBar`).
 */
function toRootName(family: ChartFamily) {
  return `Chart${upperFirst(family)}`;
}

/**
 * Registers a series on the nearest chart root while mounted. Throws when
 * the root is not one of `families` (`ChartBarSeries` inside `ChartLine`).
 */
export function useChartSeries<Entry extends ChartSeriesRegistration>({
  entry,
  families,
  componentName,
}: {
  componentName: string;
  entry: () => Omit<Entry, "id">;
  families: readonly ChartFamily[];
}) {
  const vueId = useId();
  const chart = useChartContext();
  const { upsertSeries, removeSeries } = chart.value;

  if (
    !families.includes(chart.value.family) ||
    isNil(upsertSeries) ||
    isNil(removeSeries)
  ) {
    throw new Error(
      `${componentName} must be used within ${families.map(toRootName).join(" or ")}`,
    );
  }

  const id = `${chart.value.id}-series${vueId}`;

  const full = computed(() => {
    return { ...entry(), id } as Entry;
  });

  // `upsertSeries` ignores equal entries, so new arrays do not loop.
  watch(
    full,
    (next) => {
      upsertSeries(next);
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    removeSeries(id);
  });

  return full;
}
