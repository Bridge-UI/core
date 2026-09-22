// ** External Imports
import { get, isNil, isUndefined, omit } from "es-toolkit/compat";
import { useMemo, useState } from "react";

// ** Core Imports
import {
  dateFromYear,
  isDateDisabled,
  isDateInRangePreview,
  isDateRangeValue,
  isDateSelected,
  isSameAtGranularity,
  isYearDisabled,
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
import { useDateAdapter } from "@/Adapters/Date";
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
  "error",
  "range",
  "value",
  "classes",
  "maxDate",
  "minDate",
  "rounded",
  "disabled",
  "multiple",
  "pageSize",
  "readOnly",
  "timeZone",
  "selection",
  "startYear",
  "customProps",
  "previewDate",
  "disableDates",
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
  date: Date;
  disabled: boolean;
  label: string;
  preview: boolean;
  selected: boolean;
  state: ReturnType<typeof resolveCalendarDayInteractionState>;
  year: number;
};

export function useCalendarYear(
  props: CalendarYearProps,
  libDefaults: CalendarYearLibDefaults,
) {
  const adapter = useDateAdapter();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    CalendarYearProps,
    typeof calendarYearBridgeKeys
  >({
    props,
    bridgeKeys: calendarYearBridgeKeys,
  });

  const { merged, entry: bridgeCalendar } = useBridgeUIComponent<
    CalendarYearMerged,
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

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarYearClasses>({
    props: componentProps,
  });

  const context = derived((): string | undefined => {
    return merged.timeZone;
  });

  const pageSize = derived(() => {
    return merged.pageSize ?? DEFAULT_PAGE_SIZE;
  });

  const startYear = derived(() => {
    if (!isNil(merged.startYear)) {
      return merged.startYear;
    }

    const focusYear =
      merged.value ?? adapter.getYear(adapter.now(context), context);
    const offset = Math.floor(pageSize / 2);

    return Math.max(1, focusYear - offset);
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

  const years = derived((): CalendarYearCell[] => {
    return Array.from({ length: pageSize }, (_, index) => {
      const year = startYear + index;
      const date = dateFromYear({ year, adapter, context });
      const disabled =
        Boolean(merged.disabled) ||
        (isCommitPanel
          ? isDateDisabled(date, {
              adapter,
              context,
              granularity: "year",
              maxDate: merged.maxDate,
              minDate: merged.minDate,
              disableDates: merged.disableDates,
              disableYears: merged.disableYears,
            })
          : isYearDisabled({
              year,
              adapter,
              context,
              maxDate: merged.maxDate,
              minDate: merged.minDate,
              disableYears: merged.disableYears,
            }));

      const selected = isCommitPanel
        ? isDateSelected({
            date,
            mode,
            adapter,
            context,
            granularity: "year",
            value: merged.selection ?? null,
          })
        : !isNil(merged.value) && merged.value === year;

      const preview =
        isCommitPanel &&
        mode === "range" &&
        isDateInRangePreview({
          date,
          adapter,
          context,
          previewDate,
          granularity: "year",
          value: merged.selection ?? null,
        });

      const state = resolveCalendarDayInteractionState({
        disabled,
        selected,
        readOnly: merged.readOnly,
      });

      return {
        date,
        year,
        state,
        preview,
        selected,
        label: String(year),
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

    return isSameAtGranularity(start, end, "year", adapter, context);
  });

  const selectYear = (year: number) => {
    if (merged.disabled || merged.readOnly) {
      return;
    }

    const date = dateFromYear({ year, adapter, context });

    if (isCommitPanel) {
      if (
        isDateDisabled(date, {
          adapter,
          context,
          granularity: "year",
          maxDate: merged.maxDate,
          minDate: merged.minDate,
          disableDates: merged.disableDates,
          disableYears: merged.disableYears,
        })
      ) {
        return;
      }
    } else if (
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

  const getYearBind = (cell: CalendarYearCell) => {
    const color = colorClass;

    return mergePartBind(
      customProps?.year,
      {
        type: "button" as const,
        disabled: cell.disabled,
        "aria-pressed": cell.selected,
        onClick: () => selectYear(cell.year),
        "data-preview": cell.preview ? "" : undefined,
        onMouseEnter: () => {
          if (canPreviewRange && !cell.disabled) {
            setPreview(cell.date);
          }
        },
      },
      cn({
        "cursor-pointer p-2.5 text-xs uppercase transition-all duration-150 ease-in-out outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed": true,
        [roundedClass ?? ""]: true,
        [color?.soft ?? ""]: cell.state === "base",
        [color?.hover ?? ""]: cell.state === "base",
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
