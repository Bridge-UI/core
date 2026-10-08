// ** External Imports
import { isNil } from "es-toolkit/compat";
import { useId, useLayoutEffect } from "react";

// ** Local Imports
import {
  useChartContext,
  type ChartFamily,
  type ChartSeriesRegistration,
} from "@/Utils/Chart/ChartContext";

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
  entry: Omit<Entry, "id">;
  family: ChartFamily;
}): Entry {
  const reactId = useId();
  const chart = useChartContext();
  const { upsertSeries, removeSeries } = chart;

  if (chart.family !== family || isNil(upsertSeries) || isNil(removeSeries)) {
    throw new Error(
      `${componentName} must be used within Chart${family[0].toUpperCase()}${family.slice(1)}`,
    );
  }

  const id = `${chart.id}-series${reactId.replace(/:/g, "")}`;
  const full = { ...entry, id } as Entry;

  useLayoutEffect(() => {
    return () => {
      removeSeries(id);
    };
  }, [id, removeSeries]);

  // `upsertSeries` ignores equal entries, so inline data does not loop.
  useLayoutEffect(() => {
    upsertSeries(full);
  });

  return full;
}
