// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { useMemo, useState } from "react";

// ** Core Imports
import {
  applyDateSelection,
  cn,
  isDateDisabled,
  isDateInRangePreview,
  isDateSelected,
  mergeBridgeUILayeredClasses,
  resolveCalendarDayInteractionState,
  resolveDatePickerMode,
  resolveStartOfWeek,
  splitComponentProps,
  type DateAdapterContext,
  type DatePickerModel,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { colorProps, dayProps } from "@bridge-ui/core/Tokens/Calendar";

// ** Local Imports
import { useDateAdapter } from "@/Adapters/Date";
import type {
  CalendarDateClasses,
  CalendarDateOwnProps,
  CalendarDateProps,
} from "@/Components/CalendarDate/calendarDate.types";
import { useBridgeUI } from "@/Provider/useBridgeUI";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const calendarDateBridgeKeys = [
  "color",
  "range",
  "value",
  "locale",
  "tokens",
  "classes",
  "maxDate",
  "minDate",
  "disabled",
  "multiple",
  "readOnly",
  "timeZone",
  "viewDate",
  "customProps",
  "previewDate",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
] as const satisfies readonly (keyof CalendarDateOwnProps)[];

type CalendarDateLibDefaults = LibDefaultsShape<
  CalendarDateOwnProps,
  "color" | "startOfWeek"
>;

type CalendarDateMerged = MergeLibDefaults<
  CalendarDateOwnProps,
  CalendarDateLibDefaults
>;

export type CalendarDateDayCell = {
  date: Date;
  disabled: boolean;
  label: string;
  outside: boolean;
  preview: boolean;
  selected: boolean;
  state: ReturnType<typeof resolveCalendarDayInteractionState>;
  today: boolean;
};

export function useCalendarDate(
  props: CalendarDateProps,
  libDefaults: CalendarDateLibDefaults,
) {
  const bridge = useBridgeUI();
  const adapter = useDateAdapter();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    CalendarDateProps,
    typeof calendarDateBridgeKeys
  >({
    props,
    bridgeKeys: calendarDateBridgeKeys,
  });

  const { merged } = useBridgeUIComponent<CalendarDateMerged>({
    libDefaults,
    props: componentProps,
  });

  const customProps = derived(() => merged.customProps);

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, [
      "onChange",
      "onPreviewDateChange",
      "onViewDateChange",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarDateClasses>({
    props: componentProps,
  });

  const context = derived((): DateAdapterContext => {
    return {
      locale: merged.locale ?? bridge?.global.locale,
      timeZone: merged.timeZone ?? bridge?.global.timeZone,
    };
  });

  const mode = derived(() => {
    return resolveDatePickerMode({
      range: merged.range,
      multiple: merged.multiple,
    });
  });

  const isControlled = derived(() => !isNil(props.value));

  const [uncontrolledValue, setUncontrolledValue] = useState<DatePickerModel>(
    () => merged.defaultValue ?? null,
  );

  const [uncontrolledPreview, setUncontrolledPreview] = useState<Date | null>(
    null,
  );

  const [uncontrolledViewDate, setUncontrolledViewDate] = useState(() => {
    return (
      merged.viewDate ?? adapter.startOfMonth(adapter.now(context), context)
    );
  });

  const value = derived((): DatePickerModel => {
    return isControlled ? (props.value ?? null) : uncontrolledValue;
  });

  const previewDate = derived(() => {
    return !isNil(props.previewDate) ? props.previewDate : uncontrolledPreview;
  });

  const viewDate = derived(() => {
    return merged.viewDate ?? uncontrolledViewDate;
  });

  const startOfWeek = derived(() => {
    return resolveStartOfWeek(merged.startOfWeek);
  });

  const colorTokens = useMemo(() => {
    return mergeBridgeUILayeredClasses(colorProps, merged.tokens?.color);
  }, [merged.tokens?.color]);

  const dayTokens = useMemo(() => {
    return mergeBridgeUILayeredClasses(dayProps, merged.tokens?.day);
  }, [merged.tokens?.day]);

  const colorClass = derived(() => get(colorTokens, merged.color));

  const weekdays = derived(() => {
    const names = adapter.getWeekdayNames(context);
    const start = startOfWeek;

    return Array.from({ length: 7 }, (_, index) => {
      return names[(start + index) % 7] ?? "";
    });
  });

  const days = derived((): CalendarDateDayCell[] => {
    const grid = adapter.getCalendarDays(viewDate, startOfWeek, context);
    const today = adapter.now(context);

    return grid.map((date) => {
      const disabled =
        Boolean(merged.disabled) ||
        isDateDisabled(date, {
          adapter,
          context,
          maxDate: merged.maxDate,
          minDate: merged.minDate,
          disableDates: merged.disableDates,
          disableYears: merged.disableYears,
          disableMonths: merged.disableMonths,
        });

      const selected = isDateSelected({
        date,
        mode,
        value,
        adapter,
        context,
      });

      const preview =
        mode === "range" &&
        isDateInRangePreview({
          date,
          value,
          adapter,
          context,
          previewDate,
        });

      const state = resolveCalendarDayInteractionState({
        preview,
        disabled,
        selected,
        readOnly: merged.readOnly,
      });

      return {
        date,
        state,
        preview,
        selected,
        label: String(adapter.getDate(date, context)),
        disabled: disabled || Boolean(merged.readOnly),
        today: adapter.isSameDay(date, today, context),
        outside: !adapter.isSameMonth(date, viewDate, context),
      };
    });
  });

  const selectDay = (date: Date) => {
    if (merged.disabled || merged.readOnly) {
      return;
    }

    if (
      isDateDisabled(date, {
        adapter,
        context,
        maxDate: merged.maxDate,
        minDate: merged.minDate,
        disableDates: merged.disableDates,
        disableYears: merged.disableYears,
        disableMonths: merged.disableMonths,
      })
    ) {
      return;
    }

    if (!adapter.isSameMonth(date, viewDate, context)) {
      const nextView = adapter.startOfMonth(date, context);

      if (isNil(merged.viewDate)) {
        setUncontrolledViewDate(nextView);
      }

      props.onViewDateChange?.(nextView);
    }

    const next = applyDateSelection({
      mode,
      value,
      adapter,
      context,
      next: date,
    });

    if (!isControlled) {
      setUncontrolledValue(next);
    }

    props.onChange?.(next);

    if (mode === "range") {
      setPreview(null);
    }
  };

  const setPreview = (date: Date | null) => {
    if (isNil(props.previewDate)) {
      setUncontrolledPreview(date);
    }

    props.onPreviewDateChange?.(date);
  };

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "flex flex-col gap-2": true,
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
        "grid grid-cols-7 gap-1": true,
        [mergedClasses.grid ?? ""]: true,
      }),
    );
  });

  const getWeekdayBind = (_label: string) => {
    return mergePartBind(
      customProps?.weekday,
      {},
      cn({
        "flex items-center justify-center py-1": true,
        [dayTokens.weekday ?? ""]: true,
        [mergedClasses.weekday ?? ""]: true,
      }),
    );
  };

  const getDayBind = (cell: CalendarDateDayCell) => {
    const color = colorClass;

    return mergePartBind(
      customProps?.day,
      {
        type: "button" as const,
        disabled: cell.disabled,
        "aria-pressed": cell.selected,
        onClick: () => selectDay(cell.date),
        "data-preview": cell.preview ? "" : undefined,
        "aria-current": cell.today ? ("date" as const) : undefined,
        onMouseLeave: () => {
          if (mode === "range") {
            setPreview(null);
          }
        },
        onMouseEnter: () => {
          if (mode === "range" && !cell.disabled) {
            setPreview(cell.date);
          }
        },
      },
      cn({
        "flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors": true,
        [color?.base ?? ""]: cell.state === "base" || cell.state === "hover",
        [color?.hover ?? ""]: cell.state === "base" || cell.state === "hover",
        [color?.selected ?? ""]: cell.state === "selected",
        [color?.disabled ?? ""]: cell.state === "disabled",
        [dayTokens.outside ?? ""]: cell.outside && cell.state !== "selected",
        [dayTokens.today ?? ""]:
          cell.today && cell.state !== "selected" && cell.state !== "disabled",
        [mergedClasses.day ?? ""]: true,
      }),
    );
  };

  return {
    days,
    mode,
    value,
    merged,
    context,
    rootBind,
    gridBind,
    weekdays,
    viewDate,
    selectDay,
    getDayBind,
    previewDate,
    getWeekdayBind,
    hideWeekdays: Boolean(merged.hideWeekdays),
  };
}
