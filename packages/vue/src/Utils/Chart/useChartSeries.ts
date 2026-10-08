// ** External Imports
import { isNil } from "es-toolkit/compat";
import { computed, onBeforeUnmount, useId, watch } from "vue";

// ** Local Imports
import {
  useChartContext,
  type ChartFamily,
  type ChartSeriesRegistration,
} from "@/Utils/Chart/chartInjectionKey";

/**
 * Registers a series on the nearest chart root while mounted. Throws when
 * the root is another family (`ChartBarSeries` inside `ChartLine`).
 */
export function useChartSeries<Entry extends ChartSeriesRegistration>({
  entry,
  family,
  componentName,
}: {
  componentName: string;
  entry: () => Omit<Entry, "id">;
  family: ChartFamily;
}) {
  const vueId = useId();
  const chart = useChartContext();
  const { upsertSeries, removeSeries } = chart.value;

  if (
    chart.value.family !== family ||
    isNil(upsertSeries) ||
    isNil(removeSeries)
  ) {
    throw new Error(
      `${componentName} must be used within Chart${family[0].toUpperCase()}${family.slice(1)}`,
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
