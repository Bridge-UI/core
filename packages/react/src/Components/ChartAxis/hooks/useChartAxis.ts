// ** External Imports
import { isNil, isUndefined, omitBy } from "es-toolkit/compat";
import { useCallback, useLayoutEffect, useMemo, useRef } from "react";

// ** Core Imports
import type { ChartAxisOptions } from "@bridge-ui/core/Domain";

// ** Local Imports
import type { ChartAxisProps } from "@/Components/ChartAxis/chartAxis.types";
import { useChartContext } from "@/Utils/Chart";

export function useChartAxis(props: ChartAxisProps) {
  const { setAxis, removeAxis } = useChartContext();

  if (isNil(setAxis) || isNil(removeAxis)) {
    throw new Error(
      "ChartAxis must be used within ChartLine, ChartBar, or ChartScatter",
    );
  }

  const formatTickRef = useRef(props.formatTick);

  useLayoutEffect(() => {
    formatTickRef.current = props.formatTick;
  });

  // Stable wrapper so inline formatters do not re-register the axis each render.
  const formatTick = useCallback((value: number | string) => {
    return formatTickRef.current?.(value) ?? String(value);
  }, []);

  const hasFormatTick = !isNil(props.formatTick);

  const options = useMemo((): ChartAxisOptions => {
    return omitBy(
      {
        max: props.max,
        min: props.min,
        grid: props.grid,
        label: props.label,
        hidden: props.hidden,
        tickCount: props.tickCount,
        formatTick: hasFormatTick ? formatTick : undefined,
      },
      isUndefined,
    );
  }, [
    props.max,
    props.min,
    props.grid,
    formatTick,
    props.label,
    props.hidden,
    hasFormatTick,
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
  }, [options, position, setAxis]);

  return {
    options,
  };
}
