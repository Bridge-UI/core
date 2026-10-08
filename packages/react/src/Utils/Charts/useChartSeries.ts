// ** External Imports
import { isNil, upperFirst } from "es-toolkit/compat";
import { useId, useLayoutEffect } from "react";

// ** Local Imports
import {
  useChartContext,
  type ChartFamily,
  type ChartSeriesRegistration,
} from "@/Utils/Charts/ChartContext";

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
  entry: Omit<Entry, "id">;
  families: readonly ChartFamily[];
}): Entry {
  const reactId = useId();
  const chart = useChartContext();
  const { upsertSeries, removeSeries } = chart;

  if (
    !families.includes(chart.family) ||
    isNil(upsertSeries) ||
    isNil(removeSeries)
  ) {
    throw new Error(
      `${componentName} must be used within ${families.map(toRootName).join(" or ")}`,
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
