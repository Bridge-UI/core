// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import type { DateAdapterContext } from "@bridge-ui/core/Adapters";
import {
  isMonthDisabled,
  resolveCalendarDayInteractionState,
} from "@bridge-ui/core/Domain";
import { colorProps, roundedProps } from "@bridge-ui/core/Tokens/Calendar";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type {
  CalendarMonthClasses,
  CalendarMonthOwnProps,
  CalendarMonthProps,
} from "@/Components/CalendarMonth/calendarMonth.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const calendarMonthBridgeKeys = [
  "year",
  "color",
  "value",
  "tokens",
  "classes",
  "maxDate",
  "minDate",
  "rounded",
  "disabled",
  "readOnly",
  "timeZone",
  "customProps",
  "disableMonths",
] as const satisfies readonly (keyof CalendarMonthOwnProps)[];

type CalendarMonthLibDefaults = LibDefaultsShape<
  CalendarMonthOwnProps,
  "color" | "rounded"
>;

type CalendarMonthMerged = MergeLibDefaults<
  CalendarMonthOwnProps,
  CalendarMonthLibDefaults
>;

export type CalendarMonthCell = {
  disabled: boolean;
  label: string;
  month: number;
  selected: boolean;
  state: ReturnType<typeof resolveCalendarDayInteractionState>;
};

export function useCalendarMonth(
  props: CalendarMonthProps,
  libDefaults: CalendarMonthLibDefaults,
) {
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    CalendarMonthProps,
    typeof calendarMonthBridgeKeys
  >({
    props,
    bridgeKeys: calendarMonthBridgeKeys,
  });

  const { merged } = useBridgeUIComponent<CalendarMonthMerged>({
    libDefaults,
    props: componentProps,
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["onChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarMonthClasses>({
    props: componentProps,
  });

  const context = derived((): DateAdapterContext => {
    return resolveContext(merged.timeZone);
  });

  const year = derived(() => {
    return merged.year ?? adapter.getYear(adapter.now(context), context);
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

  const colorClass = derived(() => {
    return get(colorTokens, merged.color);
  });

  const months = derived((): CalendarMonthCell[] => {
    const names = adapter.getMonthNames(context);

    return names.map((label, month) => {
      const disabled =
        Boolean(merged.disabled) ||
        isMonthDisabled({
          year,
          month,
          adapter,
          context,
          maxDate: merged.maxDate,
          minDate: merged.minDate,
          disableMonths: merged.disableMonths,
        });

      const selected = !isNil(merged.value) && merged.value === month;

      const state = resolveCalendarDayInteractionState({
        disabled,
        selected,
        readOnly: merged.readOnly,
      });

      return {
        label,
        month,
        state,
        selected,
        disabled: disabled || Boolean(merged.readOnly),
      };
    });
  });

  const selectMonth = (month: number) => {
    if (merged.disabled || merged.readOnly) {
      return;
    }

    if (
      isMonthDisabled({
        year,
        month,
        adapter,
        context,
        maxDate: merged.maxDate,
        minDate: merged.minDate,
        disableMonths: merged.disableMonths,
      })
    ) {
      return;
    }

    props.onChange?.(month);
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

  const getMonthBind = (cell: CalendarMonthCell) => {
    const color = colorClass;

    return mergePartBind(
      customProps?.month,
      {
        type: "button" as const,
        disabled: cell.disabled,
        "aria-pressed": cell.selected,
        onClick: () => selectMonth(cell.month),
      },
      cn({
        "cursor-pointer px-2 py-4 text-xs uppercase transition-all duration-150 ease-in-out outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed": true,
        [roundedClass ?? ""]: true,
        [color?.soft ?? ""]: cell.state === "base",
        [color?.hover ?? ""]: cell.state === "base",
        [color?.selected ?? ""]: cell.state === "selected",
        [color?.disabled ?? ""]: cell.state === "disabled",
        [mergedClasses.month ?? ""]: true,
      }),
    );
  };

  return {
    year,
    merged,
    months,
    rootBind,
    gridBind,
    selectMonth,
    getMonthBind,
  };
}
