// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { useMemo, useState } from "react";

// ** Core Imports
import {
  applyDateSelection,
  calendarPanelViewFromGranularity,
  isCalendarMonthPanelHidden,
  isCalendarYearPanelHidden,
  isDateRangeValue,
  normalizeDateToGranularity,
  resolveCalendarPanelView,
  type CalendarView,
  type DatePickerModel,
  type DateRangeValue,
} from "@bridge-ui/core/Domain";
import { calendarRoundedProps as roundedProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useDateAdapter } from "@/Adapters/Date";
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  CalendarRangeClasses,
  CalendarRangeOwnProps,
  CalendarRangeProps,
} from "@/Components/CalendarRange/calendarRange.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const calendarRangeBridgeKeys = [
  "fill",
  "color",
  "error",
  "value",
  "classes",
  "maxDate",
  "minDate",
  "rounded",
  "disabled",
  "readOnly",
  "timeZone",
  "viewDate",
  "hideYears",
  "hideMonths",
  "customProps",
  "defaultView",
  "granularity",
  "orientation",
  "previewDate",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
  "hideOutsideDays",
] as const satisfies readonly (keyof CalendarRangeOwnProps)[];

type CalendarRangeLibDefaults = LibDefaultsShape<
  CalendarRangeOwnProps,
  "color" | "rounded" | "orientation" | "startOfWeek"
>;

type CalendarRangeMerged = MergeLibDefaults<
  CalendarRangeOwnProps,
  CalendarRangeLibDefaults
>;

function resolveFocusDate(
  value: null | DateRangeValue,
  adapter: ReturnType<typeof useDateAdapter>,
  timeZone?: string,
): Date {
  if (isNil(value)) {
    return adapter.now(timeZone);
  }

  return value[0];
}

function toRangeValue(value: DatePickerModel): null | DateRangeValue {
  if (isDateRangeValue(value)) {
    return value;
  }

  return null;
}

export function useCalendarRange(
  props: CalendarRangeProps,
  libDefaults: CalendarRangeLibDefaults,
) {
  const adapter = useDateAdapter();
  const resolveMessage = useResolveMessage();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    CalendarRangeProps,
    typeof calendarRangeBridgeKeys
  >({
    props,
    bridgeKeys: calendarRangeBridgeKeys,
  });

  const { merged, entry: bridgeCalendar } = useBridgeUIComponent<
    CalendarRangeMerged,
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
    return omit(inheritedAttrs, [
      "slots",
      "onChange",
      "onViewDateChange",
      "onPreviewDateChange",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarRangeClasses>({
    props: componentProps,
  });

  const timeZone = derived((): string | undefined => {
    return merged.timeZone;
  });

  const isValueControlled = derived(() => {
    return !isNil(props.value);
  });

  const isViewDateControlled = derived(() => {
    return !isNil(props.viewDate) && !isNil(props.onViewDateChange);
  });

  const isPreviewControlled = derived(() => {
    return !isNil(props.previewDate);
  });

  const [uncontrolledValue, setUncontrolledValue] =
    useState<null | DateRangeValue>(() => {
      return merged.defaultValue ?? null;
    });

  const [uncontrolledView, setUncontrolledView] = useState<CalendarView>(() => {
    const granularity = merged.granularity ?? "day";

    return resolveCalendarPanelView({
      granularity,
      hideYears: merged.hideYears,
      hideMonths: merged.hideMonths,
      view: merged.defaultView ?? calendarPanelViewFromGranularity(granularity),
    });
  });

  const [uncontrolledViewDate, setUncontrolledViewDate] = useState(() => {
    return adapter.startOfMonth(
      !isNil(props.viewDate)
        ? props.viewDate
        : resolveFocusDate(
            props.value ?? merged.defaultValue ?? null,
            adapter,
            merged.timeZone,
          ),
      merged.timeZone,
    );
  });

  const [uncontrolledPreview, setUncontrolledPreview] = useState<Date | null>(
    null,
  );

  const yearPageSize = 15;

  const [yearPageStart, setYearPageStart] = useState<null | number>(null);

  const value = derived((): null | DateRangeValue => {
    if (isValueControlled) {
      return props.value ?? null;
    }

    return uncontrolledValue;
  });

  const granularity = derived(() => {
    return merged.granularity ?? "day";
  });

  const view = derived((): CalendarView => {
    return resolveCalendarPanelView({
      granularity,
      view: uncontrolledView,
      hideYears: merged.hideYears,
      hideMonths: merged.hideMonths,
    });
  });

  const viewDate = derived(() => {
    if (isViewDateControlled) {
      return props.viewDate as Date;
    }

    return uncontrolledViewDate;
  });

  const endViewDate = derived(() => {
    return adapter.addMonths(viewDate, 1, timeZone);
  });

  const previewDate = derived(() => {
    if (isPreviewControlled) {
      return props.previewDate ?? null;
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

  const yearLabel = derived(() => {
    return String(adapter.getYear(viewDate, timeZone));
  });

  const monthLabel = derived(() => {
    const names = adapter.getMonthNames();

    return names[adapter.getMonth(viewDate, timeZone)] ?? "";
  });

  const endMonthLabel = derived(() => {
    const names = adapter.getMonthNames();

    return names[adapter.getMonth(endViewDate, timeZone)] ?? "";
  });

  const viewYear = derived(() => {
    return adapter.getYear(viewDate, timeZone);
  });

  const viewMonth = derived(() => {
    return adapter.getMonth(viewDate, timeZone);
  });

  const resolvedYearPageStart = derived(() => {
    if (!isNil(yearPageStart)) {
      return yearPageStart;
    }

    return Math.max(1, viewYear - Math.floor(yearPageSize / 2));
  });

  const setView = (next: CalendarView) => {
    setUncontrolledView(next);
  };

  const openYearView = () => {
    setYearPageStart(Math.max(1, viewYear - Math.floor(yearPageSize / 2)));
    setView("year");
  };

  const setViewDate = (next: Date) => {
    const normalized = adapter.startOfMonth(next, timeZone);

    if (!isViewDateControlled) {
      setUncontrolledViewDate(normalized);
    }

    props.onViewDateChange?.(normalized);
  };

  const handleStartViewDateChange = (next: Date) => {
    setViewDate(next);
  };

  const handleEndViewDateChange = (next: Date) => {
    setViewDate(adapter.addMonths(next, -1, timeZone));
  };

  const handleChange = (next: DatePickerModel) => {
    const rangeValue = toRangeValue(next);

    if (!isValueControlled) {
      setUncontrolledValue(rangeValue);
    }

    props.onChange?.(rangeValue);
  };

  const handlePreviewDateChange = (next: Date | null) => {
    if (!isPreviewControlled) {
      setUncontrolledPreview(next);
    }

    props.onPreviewDateChange?.(next);
  };

  const goToPrevious = () => {
    if (view === "year") {
      setYearPageStart(Math.max(1, resolvedYearPageStart - yearPageSize));
      return;
    }

    if (view === "month") {
      setViewDate(adapter.addYears(viewDate, -1, timeZone));
      return;
    }

    setViewDate(adapter.addMonths(viewDate, -1, timeZone));
  };

  const goToNext = () => {
    if (view === "year") {
      setYearPageStart(resolvedYearPageStart + yearPageSize);
      return;
    }

    if (view === "month") {
      setViewDate(adapter.addYears(viewDate, 1, timeZone));
      return;
    }

    setViewDate(adapter.addMonths(viewDate, 1, timeZone));
  };

  /**
   * Jumps to today's month on the commit panel without changing the selection.
   */
  const goToToday = () => {
    const today = adapter.startOfMonth(adapter.now(timeZone), timeZone);

    setYearPageStart(null);
    setViewDate(today);
    setView(calendarPanelViewFromGranularity(granularity));
  };

  const handleYearSelect = (year: number) => {
    setYearPageStart(null);
    const nextDate = adapter.setYear(viewDate, year, timeZone);
    setViewDate(nextDate);

    if (granularity === "year") {
      handleChange(
        applyDateSelection({
          value,
          adapter,
          timeZone,
          granularity,
          mode: "range",
          next: normalizeDateToGranularity(nextDate, "year", adapter, timeZone),
        }),
      );
      return;
    }

    setView(
      isCalendarMonthPanelHidden({
        granularity,
        hideMonths: merged.hideMonths,
      })
        ? calendarPanelViewFromGranularity(granularity)
        : "month",
    );
  };

  const openMonthView = () => {
    setView("month");
  };

  const handleMonthSelect = (month: number) => {
    const nextDate = adapter.setMonth(viewDate, month, timeZone);
    setViewDate(nextDate);

    if (granularity === "month") {
      handleChange(
        applyDateSelection({
          value,
          adapter,
          timeZone,
          granularity,
          mode: "range",
          next: normalizeDateToGranularity(
            nextDate,
            "month",
            adapter,
            timeZone,
          ),
        }),
      );
      return;
    }

    setView("date");
  };

  const monthPanelYear = viewYear;
  const monthPanelValue = viewMonth;

  const shared = derived(() => {
    return {
      color: merged.color,
      error: merged.error,
      rounded: merged.rounded,
      maxDate: merged.maxDate,
      minDate: merged.minDate,
      disabled: merged.disabled,
      readOnly: merged.readOnly,
      timeZone: merged.timeZone,
    };
  });

  const isVertical = derived(() => {
    return merged.orientation === "vertical";
  });

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "flex flex-col overflow-hidden": true,
        "w-full": merged.fill,
        "min-w-max": true,
        "w-fit": !merged.fill && isVertical,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const headerBind = derived(() => {
    return mergePartBind(
      customProps?.header,
      {},
      cn({
        "relative flex w-full items-center p-2.5": true,
        [mergedClasses.header ?? ""]: true,
      }),
    );
  });

  const monthsBind = derived(() => {
    return mergePartBind(
      customProps?.months,
      {},
      cn({
        "flex min-w-0 flex-1 items-center justify-center": true,
        [mergedClasses.months ?? ""]: true,
      }),
    );
  });

  const startHeaderBind = derived(() => {
    return mergePartBind(
      customProps?.startHeader,
      {},
      cn({
        "flex min-w-0 flex-1 items-center pr-4": true,
        [mergedClasses.startHeader ?? ""]: true,
      }),
    );
  });

  const endHeaderBind = derived(() => {
    return mergePartBind(
      customProps?.endHeader,
      {},
      cn({
        "items-center": true,
        "flex min-w-0 flex-1 items-center pl-4":
          !isVertical || view === "month",
        "flex justify-center": isVertical && view !== "month",
        [mergedClasses.endHeader ?? ""]: true,
      }),
    );
  });

  const bodyBind = derived(() => {
    return mergePartBind(
      customProps?.body,
      {},
      cn({
        "relative flex min-h-64 flex-col": true,
        [mergedClasses.body ?? ""]: true,
      }),
    );
  });

  const panelsBind = derived(() => {
    return mergePartBind(
      customProps?.panels,
      {
        "aria-hidden": view !== "date",
      },
      cn({
        "flex w-full": true,
        "flex-row": !isVertical,
        "flex-col": isVertical,
        invisible: view !== "date",
        [mergedClasses.panels ?? ""]: true,
      }),
    );
  });

  const startBind = derived(() => {
    return mergePartBind(
      customProps?.start,
      {},
      cn({
        "flex min-w-72 flex-1 flex-col px-2.5": true,
        "pb-2.5": !isVertical,
        [mergedClasses.start ?? ""]: true,
      }),
    );
  });

  const endBind = derived(() => {
    return mergePartBind(
      customProps?.end,
      {},
      cn({
        "flex min-w-72 flex-1 flex-col px-2.5 pb-2.5": true,
        [mergedClasses.end ?? ""]: true,
      }),
    );
  });

  const monthYearBind = derived(() => {
    return cn({
      "absolute inset-0 z-10 flex flex-col bg-white p-2.5 dark:bg-dark-900": true,
    });
  });

  const selectorBind = derived(() => {
    return mergePartBind(
      customProps?.selector,
      {
        type: "button" as const,
        disabled: merged.disabled,
      },
      cn({
        "inline-flex cursor-pointer items-center gap-x-2 px-1.5 py-1 text-sm font-medium text-dark-600 hover:bg-dark-100 focus:outline-none disabled:cursor-not-allowed dark:text-dark-300 dark:hover:bg-dark-800": true,
        [roundedClass ?? ""]: true,
        [mergedClasses.selector ?? ""]: true,
      }),
    );
  });

  const navButtonBind = derived(() => {
    return mergePartBind(
      customProps?.navButton,
      {
        type: "button" as const,
        disabled: merged.disabled,
      },
      cn({
        "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center text-dark-600 hover:bg-dark-100 disabled:cursor-not-allowed dark:text-dark-300 dark:hover:bg-dark-800": true,
        [roundedClass ?? ""]: true,
        [mergedClasses.navButton ?? ""]: true,
      }),
    );
  });

  const previousNavLabel = derived(() => {
    if (view === "year") {
      return resolveMessage("Previous years");
    }

    if (view === "month") {
      return resolveMessage("Previous year");
    }

    return resolveMessage("Previous month");
  });

  const nextNavLabel = derived(() => {
    if (view === "year") {
      return resolveMessage("Next years");
    }

    if (view === "month") {
      return resolveMessage("Next year");
    }

    return resolveMessage("Next month");
  });

  const previousButtonBind = derived(() => {
    return mergePartBind(
      customProps?.previousButton,
      {
        ...navButtonBind,
        onClick: goToPrevious,
        type: "button" as const,
        disabled: merged.disabled,
        "aria-label": previousNavLabel,
      },
      cn({
        [mergedClasses.navButton ?? ""]: true,
      }),
    );
  });

  const nextButtonBind = derived(() => {
    return mergePartBind(
      customProps?.nextButton,
      {
        ...navButtonBind,
        onClick: goToNext,
        type: "button" as const,
        disabled: merged.disabled,
        "aria-label": nextNavLabel,
      },
      cn({
        [mergedClasses.navButton ?? ""]: true,
      }),
    );
  });

  const todayButtonBind = derived(() => {
    return mergePartBind(
      customProps?.todayButton,
      {
        onClick: goToToday,
        type: "button" as const,
        disabled: merged.disabled,
        "aria-label": resolveMessage("Today"),
      },
      cn({
        "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center hover:bg-dark-100 disabled:cursor-not-allowed dark:hover:bg-dark-800": true,
        [roundedClass ?? ""]: true,
        [mergedClasses.navButton ?? ""]: true,
      }),
    );
  });

  const yearSelectorBind = derived(() => {
    return mergePartBind(customProps?.selector, undefined, {
      ...selectorBind,
      onClick: openYearView,
      type: "button" as const,
      "aria-label": resolveMessage("Select year"),
      disabled:
        merged.disabled ||
        isCalendarYearPanelHidden({
          granularity,
          hideYears: merged.hideYears,
        }),
    });
  });

  const monthSelectorBind = derived(() => {
    const bind = mergePartBind(customProps?.selector, undefined, {
      ...selectorBind,
      type: "button" as const,
      "aria-label": resolveMessage("Select month"),
      disabled:
        merged.disabled ||
        isCalendarMonthPanelHidden({
          granularity,
          hideMonths: merged.hideMonths,
        }),
    });

    return {
      ...bind,
      onClick: openMonthView,
    };
  });

  const endMonthSelectorBind = derived(() => {
    const bind = mergePartBind(customProps?.selector, undefined, {
      ...selectorBind,
      type: "button" as const,
      "aria-label": resolveMessage("Select end month"),
      disabled:
        merged.disabled ||
        isCalendarMonthPanelHidden({
          granularity,
          hideMonths: merged.hideMonths,
        }),
    });

    return {
      ...bind,
      onClick: openMonthView,
    };
  });

  return {
    view,
    value,
    shared,
    merged,
    endBind,
    rootBind,
    bodyBind,
    viewDate,
    viewYear,
    startBind,
    viewMonth,
    yearLabel,
    monthLabel,
    headerBind,
    monthsBind,
    panelsBind,
    isVertical,
    endViewDate,
    previewDate,
    setViewDate,
    granularity,
    handleChange,
    yearPageSize,
    endMonthLabel,
    showNav: true,
    endHeaderBind,
    monthYearBind,
    nextButtonBind,
    monthPanelYear,
    startHeaderBind,
    todayButtonBind,
    monthPanelValue,
    yearSelectorBind,
    handleYearSelect,
    monthSelectorBind,
    handleMonthSelect,
    previousButtonBind,
    endMonthSelectorBind,
    handleEndViewDateChange,
    handlePreviewDateChange,
    handleStartViewDateChange,
    navIconBind: customProps?.navIcon,
    yearPageStart: resolvedYearPageStart,
    showYearSelector: !isCalendarYearPanelHidden({
      granularity,
      hideYears: merged.hideYears,
    }),
    showMonthSelector: !isCalendarMonthPanelHidden({
      granularity,
      hideMonths: merged.hideMonths,
    }),
  };
}
