// ** External Imports
import { isEqual, isNil, omit } from "es-toolkit/compat";
import { shallowRef } from "vue";

// ** Core Imports
import {
  isSameChartAxisOptions,
  type ChartAxisOptions,
  type ChartAxisPosition,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import type { ChartSeriesRegistration } from "@/Utils/Charts/chartInjectionKey";

/**
 * Series and axes registered by chart children, in mount order.
 */
export function useChartRegistry<Entry extends ChartSeriesRegistration>() {
  const entries = shallowRef<Entry[]>([]);

  const axes = shallowRef<Partial<Record<ChartAxisPosition, ChartAxisOptions>>>(
    {},
  );

  function upsertSeries(entry: ChartSeriesRegistration) {
    const index = entries.value.findIndex((item) => item.id === entry.id);

    if (index === -1) {
      entries.value = [...entries.value, entry as Entry];
      return;
    }

    if (isEqual(entries.value[index], entry)) {
      return;
    }

    const next = [...entries.value];
    next[index] = entry as Entry;
    entries.value = next;
  }

  function removeSeries(id: string) {
    entries.value = entries.value.filter((item) => item.id !== id);
  }

  function setAxis(position: ChartAxisPosition, options: ChartAxisOptions) {
    const current = axes.value[position];

    if (!isNil(current) && isSameChartAxisOptions(current, options)) {
      return;
    }

    axes.value = { ...axes.value, [position]: options };
  }

  function removeAxis(position: ChartAxisPosition) {
    axes.value = omit(axes.value, [position]);
  }

  return {
    axes,
    entries,
    setAxis,
    removeAxis,
    upsertSeries,
    removeSeries,
  };
}
