// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { useMemo, useState } from "react";

// ** Core Imports
import type { DateAdapterContext } from "@bridge-ui/core/Adapters";
import {
  applyDateSelection,
  isDateDisabled,
  isDateInRangePreview,
  isDateRangeValue,
  isDateSelected,
  resolveCalendarDayInteractionState,
  resolveDatePickerMode,
  resolveStartOfWeek,
  type DatePickerModel,
} from "@bridge-ui/core/Domain";
import {
  colorProps,
  dayProps,
  roundedProps,
} from "@bridge-ui/core/Tokens/Calendar";
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
  CalendarDateClasses,
  CalendarDateDayCell,
  CalendarDateOwnProps,
  CalendarDateProps,
} from "@/Components/CalendarDate/calendarDate.types";
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
  "tokens",
  "classes",
  "maxDate",
  "minDate",
  "rounded",
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
  "hideOutsideDays",
] as const satisfies readonly (keyof CalendarDateOwnProps)[];

type CalendarDateLibDefaults = LibDefaultsShape<
  CalendarDateOwnProps,
  "color" | "rounded" | "startOfWeek"
>;

type CalendarDateMerged = MergeLibDefaults<
  CalendarDateOwnProps,
  CalendarDateLibDefaults
>;

export type { CalendarDateDayCell };

export function useCalendarDate(
  props: CalendarDateProps,
  libDefaults: CalendarDateLibDefaults,
) {
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();

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

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, [
      "slots",
      "onChange",
      "onViewDateChange",
      "onPreviewDateChange",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarDateClasses>({
    props: componentProps,
  });

  const context = derived((): DateAdapterContext => {
    return resolveContext(merged.timeZone);
  });

  const mode = derived(() => {
    return resolveDatePickerMode({
      range: merged.range,
      multiple: merged.multiple,
    });
  });

  const isControlled = derived(() => {
    return !isNil(props.value);
  });

  const isViewDateControlled = derived(() => {
    return !isNil(props.viewDate) && !isNil(props.onViewDateChange);
  });

  const [uncontrolledValue, setUncontrolledValue] = useState<DatePickerModel>(
    () => {
      return merged.defaultValue ?? null;
    },
  );

  const [uncontrolledPreview, setUncontrolledPreview] = useState<Date | null>(
    null,
  );

  const [uncontrolledViewDate] = useState(() => {
    return (
      props.viewDate ??
      merged.viewDate ??
      adapter.startOfMonth(adapter.now(context), context)
    );
  });

  const value = derived((): DatePickerModel => {
    if (isControlled) {
      return props.value ?? null;
    }

    return uncontrolledValue;
  });

  const previewDate = derived(() => {
    if (!isNil(props.previewDate)) {
      return props.previewDate;
    }

    return uncontrolledPreview;
  });

  const viewDate = derived(() => {
    if (isViewDateControlled) {
      return props.viewDate as Date;
    }

    return uncontrolledViewDate;
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

  const canPreviewRange = derived(() => {
    if (mode !== "range" || !isDateRangeValue(value)) {
      return false;
    }

    const [start, end] = value;

    return adapter.isSameDay(start, end, context);
  });

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
        onMouseLeave: () => {
          if (canPreviewRange) {
            setPreview(null);
          }
        },
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
        onMouseEnter: () => {
          if (canPreviewRange && !cell.disabled) {
            setPreview(cell.date);
          }
        },
      },
      cn({
        "relative flex h-8 w-full cursor-pointer items-center justify-center text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50": true,
        [roundedClass ?? ""]: true,
        [color?.base ?? ""]: cell.state === "base",
        [color?.hover ?? ""]: cell.state === "base",
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
    hideOutsideDays: Boolean(merged.hideOutsideDays),
  };
}
