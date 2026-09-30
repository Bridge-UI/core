// ** External Imports
import { pick } from "es-toolkit/compat";
import { useId, useLayoutEffect, useMemo } from "react";

// ** Core Imports
import type { ChartSeriesEntry } from "@bridge-ui/core/Domain";
import type { LibDefaultsShape, MergeLibDefaults } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useChartContext } from "@/Components/Chart/ChartContext";
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
  const reactId = useId();
  const id = `${chart.id}-series${reactId.replace(/:/g, "")}`;

  const { merged } = useBridgeUIComponent<ChartSeriesMerged, "ChartSeries">({
    libDefaults,
    componentName: "ChartSeries",
    props: pick(props, ["type", "curve"]),
  });

  const entry = useMemo((): ChartSeriesEntry => {
    return {
      id,
      name: props.name,
      data: props.data,
      type: merged.type,
      color: props.color,
      curve: merged.curve,
    };
  }, [id, props.name, props.data, props.color, merged.type, merged.curve]);

  const { upsertSeries, removeSeries } = chart;

  useLayoutEffect(() => {
    return () => {
      removeSeries(id);
    };
  }, [id, removeSeries]);

  useLayoutEffect(() => {
    upsertSeries(entry);
  }, [entry, upsertSeries]);

  return {
    entry,
    merged,
  };
}
