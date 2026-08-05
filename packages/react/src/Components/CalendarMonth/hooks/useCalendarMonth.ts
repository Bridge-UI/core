// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  cn,
  isMonthDisabled,
  mergeBridgeUILayeredClasses,
  resolveCalendarDayInteractionState,
  splitComponentProps,
  type DateAdapterContext,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { colorProps } from "@bridge-ui/core/Tokens/Calendar";

// ** Local Imports
import { useDateAdapter } from "@/Adapters/Date";
import type {
  CalendarMonthClasses,
  CalendarMonthOwnProps,
  CalendarMonthProps,
} from "@/Components/CalendarMonth/calendarMonth.types";
import { useBridgeUI } from "@/Provider/useBridgeUI";
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
  "locale",
  "tokens",
  "classes",
  "maxDate",
  "minDate",
  "disabled",
  "readOnly",
  "timeZone",
  "customProps",
  "disableMonths",
] as const satisfies readonly (keyof CalendarMonthOwnProps)[];

type CalendarMonthLibDefaults = LibDefaultsShape<
  CalendarMonthOwnProps,
  "color"
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
  const bridge = useBridgeUI();

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

  const customProps = derived(() => merged.customProps);

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["onChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarMonthClasses>({
    props: componentProps,
  });

  const context = derived((): DateAdapterContext => {
    return {
      locale: merged.locale ?? bridge?.global.locale,
      timeZone: merged.timeZone ?? bridge?.global.timeZone,
    };
  });

  const year = derived(() => {
    return merged.year ?? adapter.getYear(adapter.now(context), context);
  });

  const colorTokens = useMemo(() => {
    return mergeBridgeUILayeredClasses(colorProps, merged.tokens?.color);
  }, [merged.tokens?.color]);

  const colorClass = derived(() => get(colorTokens, merged.color));

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
        type: "button",
        disabled: cell.disabled,
        "aria-pressed": cell.selected,
        onClick: () => selectMonth(cell.month),
      },
      cn({
        "flex h-10 items-center justify-center rounded-md px-2 text-sm uppercase transition-colors": true,
        [color?.base ?? ""]: cell.state === "base" || cell.state === "hover",
        [color?.hover ?? ""]: cell.state === "base" || cell.state === "hover",
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
