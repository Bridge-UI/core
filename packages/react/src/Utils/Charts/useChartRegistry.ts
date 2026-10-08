// ** External Imports
import { isEqual, isNil, omit } from "es-toolkit/compat";
import { useCallback, useState } from "react";

// ** Core Imports
import {
  isSameChartAxisOptions,
  type ChartAxisOptions,
  type ChartAxisPosition,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import type { ChartSeriesRegistration } from "@/Utils/Charts/ChartContext";

/**
 * Series and axes registered by chart children, in mount order.
 */
export function useChartRegistry<Entry extends ChartSeriesRegistration>() {
  const [entries, setEntries] = useState<Entry[]>([]);

  const [axes, setAxes] = useState<
    Partial<Record<ChartAxisPosition, ChartAxisOptions>>
  >({});

  const upsertSeries = useCallback((entry: ChartSeriesRegistration) => {
    setEntries((previous) => {
      const index = previous.findIndex((item) => item.id === entry.id);

      if (index === -1) {
        return [...previous, entry as Entry];
      }

      if (isEqual(previous[index], entry)) {
        return previous;
      }

      const next = [...previous];
      next[index] = entry as Entry;

      return next;
    });
  }, []);

  const removeSeries = useCallback((id: string) => {
    setEntries((previous) => {
      return previous.filter((item) => item.id !== id);
    });
  }, []);

  const setAxis = useCallback(
    (position: ChartAxisPosition, options: ChartAxisOptions) => {
      setAxes((previous) => {
        const current = previous[position];

        if (!isNil(current) && isSameChartAxisOptions(current, options)) {
          return previous;
        }

        return { ...previous, [position]: options };
      });
    },
    [],
  );

  const removeAxis = useCallback((position: ChartAxisPosition) => {
    setAxes((previous) => {
      return omit(previous, [position]);
    });
  }, []);

  return {
    axes,
    entries,
    setAxis,
    removeAxis,
    upsertSeries,
    removeSeries,
  };
}
