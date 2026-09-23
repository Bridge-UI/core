// ** External Imports
import { get, isNil, isUndefined, omit } from "es-toolkit/compat";
import { useMemo, useState } from "react";

// ** Core Imports
import type { DateAdapterContext } from "@bridge-ui/core/Adapters";
import {
  dateFromYearMonth,
  isDateDisabled,
  isDateInRangePreview,
  isDateRangeValue,
  isDateSelected,
  isMonthDisabled,
  isSameAtGranularity,
  resolveCalendarDayInteractionState,
  resolveDatePickerMode,
} from "@bridge-ui/core/Domain";
import {
  calendarColorProps as colorProps,
  calendarRoundedProps as roundedProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  getColorToken,
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
  "error",
  "range",
  "value",
  "classes",
  "maxDate",
  "minDate",
  "rounded",
  "disabled",
  "multiple",
  "readOnly",
  "timeZone",
  "selection",
  "customProps",
  "previewDate",
  "disableDates",
  "disableYears",
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
  date: Date;
  disabled: boolean;
  label: string;
  month: number;
  preview: boolean;
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

  const { merged, entry: bridgeCalendar } = useBridgeUIComponent<
    CalendarMonthMerged,
    "Calendar"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Calendar",
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["onChange", "onPreviewDateChange"]);
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

  const mode = derived(() => {
    return resolveDatePickerMode({
      range: merged.range,
      multiple: merged.multiple,
    });
  });

  const isCommitPanel = derived(() => {
    return !isUndefined(merged.selection);
  });

  const [uncontrolledPreview, setUncontrolledPreview] = useState<Date | null>(
    null,
  );

  const previewDate = derived(() => {
    if (!isNil(props.previewDate)) {
      return props.previewDate;
    }

    return uncontrolledPreview;
  });

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeCalendar?.tokens?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeCalendar?.tokens?.rounded]);

  const colorClass = derived(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeCalendar?.tokens?.color,
    );

    return getColorToken({
      tokens: classes,
      color: merged.color,
      invalid: merged.error,
    });
  });

  const months = derived((): CalendarMonthCell[] => {
    const names = adapter.getMonthNames(context);

    return names.map((label, month) => {
      const date = dateFromYearMonth({
        year,
        month,
        adapter,
        context,
      });
      const disabled =
        Boolean(merged.disabled) ||
        (isCommitPanel
          ? isDateDisabled(date, {
              adapter,
              context,
              granularity: "month",
              maxDate: merged.maxDate,
              minDate: merged.minDate,
              disableDates: merged.disableDates,
              disableYears: merged.disableYears,
              disableMonths: merged.disableMonths,
            })
          : isMonthDisabled({
              year,
              month,
              adapter,
              context,
              maxDate: merged.maxDate,
              minDate: merged.minDate,
              disableMonths: merged.disableMonths,
            }));

      const selected = isCommitPanel
        ? isDateSelected({
            date,
            mode,
            adapter,
            context,
            granularity: "month",
            value: merged.selection ?? null,
          })
        : !isNil(merged.value) && merged.value === month;

      const preview =
        isCommitPanel &&
        mode === "range" &&
        isDateInRangePreview({
          date,
          adapter,
          context,
          previewDate,
          granularity: "month",
          value: merged.selection ?? null,
        });

      const state = resolveCalendarDayInteractionState({
        disabled,
        selected,
        readOnly: merged.readOnly,
      });

      return {
        date,
        label,
        month,
        state,
        preview,
        selected,
        disabled: disabled || Boolean(merged.readOnly),
      };
    });
  });

  const setPreview = (date: Date | null) => {
    if (isNil(props.previewDate)) {
      setUncontrolledPreview(date);
    }

    props.onPreviewDateChange?.(date);
  };

  const canPreviewRange = derived(() => {
    if (
      !isCommitPanel ||
      mode !== "range" ||
      !isDateRangeValue(merged.selection)
    ) {
      return false;
    }

    const [start, end] = merged.selection;

    return isSameAtGranularity(start, end, "month", adapter, context);
  });

  const selectMonth = (month: number) => {
    if (merged.disabled || merged.readOnly) {
      return;
    }

    const date = dateFromYearMonth({
      year,
      month,
      adapter,
      context,
    });

    if (isCommitPanel) {
      if (
        isDateDisabled(date, {
          adapter,
          context,
          granularity: "month",
          maxDate: merged.maxDate,
          minDate: merged.minDate,
          disableDates: merged.disableDates,
          disableYears: merged.disableYears,
          disableMonths: merged.disableMonths,
        })
      ) {
        return;
      }
    } else if (
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

    if (mode === "range") {
      setPreview(null);
    }
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
        onMouseLeave: () => {
          if (canPreviewRange) {
            setPreview(null);
          }
        },
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
        "data-preview": cell.preview ? "" : undefined,
        onMouseEnter: () => {
          if (canPreviewRange && !cell.disabled) {
            setPreview(cell.date);
          }
        },
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
