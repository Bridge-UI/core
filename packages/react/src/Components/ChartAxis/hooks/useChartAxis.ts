// ** External Imports
import { isNil, isUndefined, omitBy } from "es-toolkit/compat";
import { useLayoutEffect, useMemo } from "react";

// ** Core Imports
import type { ChartAxisOptions } from "@bridge-ui/core/Domain";

// ** Local Imports
import type { ChartAxisProps } from "@/Components/ChartAxis/chartAxis.types";
import { useChartContext, useLatestCallback } from "@/Utils/Charts";

export function useChartAxis(props: ChartAxisProps) {
  const { setAxis, removeAxis } = useChartContext();

  if (isNil(setAxis) || isNil(removeAxis)) {
    throw new Error(
      "ChartAxis must be used within ChartLine, ChartBar, or ChartScatter",
    );
  }

  // Stable wrappers so inline formatters do not re-register the axis.
  const formatTick = useLatestCallback(props.formatTick);
  const formatCategory = useLatestCallback(props.formatCategory);

  const options = useMemo((): ChartAxisOptions => {
    return omitBy(
      {
        formatTick,
        max: props.max,
        min: props.min,
        formatCategory,
        grid: props.grid,
        label: props.label,
        hidden: props.hidden,
        tickCount: props.tickCount,
      },
      isUndefined,
    );
  }, [
    props.max,
    props.min,
    formatTick,
    props.grid,
    props.label,
    props.hidden,
    formatCategory,
    props.tickCount,
  ]);

  const position = props.position;

  useLayoutEffect(() => {
    return () => {
      removeAxis(position);
    };
  }, [position, removeAxis]);

  useLayoutEffect(() => {
    setAxis(position, options);
  }, [options, setAxis, position]);

  return {
    options,
  };
}
