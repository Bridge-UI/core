// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  cn,
  isYearDisabled,
  mergeBridgeUILayeredClasses,
  resolveCalendarDayInteractionState,
  splitComponentProps,
  type DateAdapterContext,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { colorProps, roundedProps } from "@bridge-ui/core/Tokens/Calendar";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type {
  CalendarYearClasses,
  CalendarYearOwnProps,
  CalendarYearProps,
} from "@/Components/CalendarYear/calendarYear.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const DEFAULT_PAGE_SIZE = 15;

const calendarYearBridgeKeys = [
  "color",
  "value",
  "tokens",
  "classes",
  "maxDate",
  "minDate",
  "rounded",
  "disabled",
  "pageSize",
  "readOnly",
  "timeZone",
  "startYear",
  "customProps",
  "disableYears",
] as const satisfies readonly (keyof CalendarYearOwnProps)[];

type CalendarYearLibDefaults = LibDefaultsShape<
  CalendarYearOwnProps,
  "color" | "rounded" | "pageSize"
>;

type CalendarYearMerged = MergeLibDefaults<
  CalendarYearOwnProps,
  CalendarYearLibDefaults
>;

export type CalendarYearCell = {
  disabled: boolean;
  label: string;
  selected: boolean;
  state: ReturnType<typeof resolveCalendarDayInteractionState>;
  year: number;
};

export function useCalendarYear(
  props: CalendarYearProps,
  libDefaults: CalendarYearLibDefaults,
) {
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    CalendarYearProps,
    typeof calendarYearBridgeKeys
  >({
    props,
    bridgeKeys: calendarYearBridgeKeys,
  });

  const { merged } = useBridgeUIComponent<CalendarYearMerged>({
    libDefaults,
    props: componentProps,
  });

  const customProps = derived(() => merged.customProps);

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["onChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarYearClasses>({
    props: componentProps,
  });

  const context = derived((): DateAdapterContext => {
    return resolveContext(merged.timeZone);
  });

  const pageSize = derived(() => merged.pageSize ?? DEFAULT_PAGE_SIZE);

  const startYear = derived(() => {
    if (!isNil(merged.startYear)) {
      return merged.startYear;
    }

    const focusYear =
      merged.value ?? adapter.getYear(adapter.now(context), context);
    const offset = Math.floor(pageSize / 2);

    return focusYear - offset;
  });

  const colorTokens = useMemo(() => {
    return mergeBridgeUILayeredClasses(colorProps, merged.tokens?.color);
  }, [merged.tokens?.color]);

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      merged.tokens?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, merged.tokens?.rounded]);

  const colorClass = derived(() => get(colorTokens, merged.color));

  const years = derived((): CalendarYearCell[] => {
    return Array.from({ length: pageSize }, (_, index) => {
      const year = startYear + index;
      const disabled =
        Boolean(merged.disabled) ||
        isYearDisabled({
          year,
          adapter,
          context,
          maxDate: merged.maxDate,
          minDate: merged.minDate,
          disableYears: merged.disableYears,
        });

      const selected = !isNil(merged.value) && merged.value === year;

      const state = resolveCalendarDayInteractionState({
        disabled,
        selected,
        readOnly: merged.readOnly,
      });

      return {
        year,
        state,
        selected,
        label: String(year),
        disabled: disabled || Boolean(merged.readOnly),
      };
    });
  });

  const selectYear = (year: number) => {
    if (merged.disabled || merged.readOnly) {
      return;
    }

    if (
      isYearDisabled({
        year,
        adapter,
        context,
        maxDate: merged.maxDate,
        minDate: merged.minDate,
        disableYears: merged.disableYears,
      })
    ) {
      return;
    }

    props.onChange?.(year);
  };

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "flex flex-col": true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const gridBind = derived(() => {
    return mergePartBind(
      customProps?.grid,
      {
        role: "grid",
      },
      cn({
        "grid grid-cols-3 gap-2": true,
        [mergedClasses.grid ?? ""]: true,
      }),
    );
  });

  const getYearBind = (cell: CalendarYearCell) => {
    const color = colorClass;

    return mergePartBind(
      customProps?.year,
      {
        type: "button" as const,
        disabled: cell.disabled,
        "aria-pressed": cell.selected,
        onClick: () => selectYear(cell.year),
      },
      cn({
        "flex h-10 items-center justify-center px-2 text-sm transition-colors": true,
        [roundedClass ?? ""]: true,
        [color?.base ?? ""]: cell.state === "base" || cell.state === "hover",
        [color?.hover ?? ""]: cell.state === "base" || cell.state === "hover",
        [color?.selected ?? ""]: cell.state === "selected",
        [color?.disabled ?? ""]: cell.state === "disabled",
        [mergedClasses.year ?? ""]: true,
      }),
    );
  };

  return {
    years,
    merged,
    rootBind,
    gridBind,
    pageSize,
    startYear,
    selectYear,
    getYearBind,
  };
}
