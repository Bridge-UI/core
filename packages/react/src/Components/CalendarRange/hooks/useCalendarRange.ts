// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { useMemo, useRef, useState } from "react";

// ** Core Imports
import {
  cn,
  isDateRangeValue,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type DateAdapterContext,
  type DatePickerModel,
  type DateRangeValue,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { roundedProps } from "@bridge-ui/core/Tokens/Calendar";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  CalendarRangeClasses,
  CalendarRangeOwnProps,
  CalendarRangeProps,
  CalendarRangeView,
} from "@/Components/CalendarRange/calendarRange.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const calendarRangeBridgeKeys = [
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
  "viewDate",
  "hideYears",
  "hideMonths",
  "customProps",
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
  context: DateAdapterContext,
): Date {
  if (isNil(value)) {
    return adapter.now(context);
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
  const resolveContext = useDateAdapterContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    CalendarRangeProps,
    typeof calendarRangeBridgeKeys
  >({
    props,
    bridgeKeys: calendarRangeBridgeKeys,
  });

  const { merged } = useBridgeUIComponent<CalendarRangeMerged>({
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

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarRangeClasses>({
    props: componentProps,
  });

  const context = derived((): DateAdapterContext => {
    return resolveContext(merged.timeZone);
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

  const [uncontrolledView, setUncontrolledView] =
    useState<CalendarRangeView>("date");

  const [monthTarget, setMonthTarget] = useState<"end" | "start">("start");
  const monthTargetRef = useRef<"end" | "start">("start");

  const [uncontrolledViewDate, setUncontrolledViewDate] = useState(() => {
    return adapter.startOfMonth(
      !isNil(props.viewDate)
        ? props.viewDate
        : resolveFocusDate(
            props.value ?? merged.defaultValue ?? null,
            adapter,
            resolveContext(merged.timeZone),
          ),
      resolveContext(merged.timeZone),
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

  const view = derived((): CalendarRangeView => {
    if (uncontrolledView === "year" && merged.hideYears) {
      return "date";
    }

    if (uncontrolledView === "month" && merged.hideMonths) {
      return "date";
    }

    return uncontrolledView;
  });

  const viewDate = derived(() => {
    if (isViewDateControlled) {
      return props.viewDate as Date;
    }

    return uncontrolledViewDate;
  });

  const endViewDate = derived(() => {
    return adapter.addMonths(viewDate, 1, context);
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
      merged.tokens?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, merged.tokens?.rounded]);

  const yearLabel = derived(() => {
    return String(adapter.getYear(viewDate, context));
  });

  const monthLabel = derived(() => {
    const names = adapter.getMonthNames(context);

    return names[adapter.getMonth(viewDate, context)] ?? "";
  });

  const endMonthLabel = derived(() => {
    const names = adapter.getMonthNames(context);

    return names[adapter.getMonth(endViewDate, context)] ?? "";
  });

  const viewYear = derived(() => {
    return adapter.getYear(viewDate, context);
  });

  const viewMonth = derived(() => {
    return adapter.getMonth(viewDate, context);
  });

  const resolvedYearPageStart = derived(() => {
    if (!isNil(yearPageStart)) {
      return yearPageStart;
    }

    return Math.max(1, viewYear - Math.floor(yearPageSize / 2));
  });

  const setView = (next: CalendarRangeView) => {
    setUncontrolledView(next);
  };

  const openYearView = () => {
    setYearPageStart(Math.max(1, viewYear - Math.floor(yearPageSize / 2)));
    setView("year");
  };

  const setViewDate = (next: Date) => {
    const normalized = adapter.startOfMonth(next, context);

    if (!isViewDateControlled) {
      setUncontrolledViewDate(normalized);
    }

    props.onViewDateChange?.(normalized);
  };

  const handleStartViewDateChange = (next: Date) => {
    setViewDate(next);
  };

  const handleEndViewDateChange = (next: Date) => {
    setViewDate(adapter.addMonths(next, -1, context));
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

    setViewDate(adapter.addMonths(viewDate, -1, context));
  };

  const goToNext = () => {
    if (view === "year") {
      setYearPageStart(resolvedYearPageStart + yearPageSize);
      return;
    }

    setViewDate(adapter.addMonths(viewDate, 1, context));
  };

  /**
   * Jumps to the date panels on today's month without changing the selection.
   */
  const goToToday = () => {
    const today = adapter.startOfMonth(adapter.now(context), context);

    setYearPageStart(null);
    setViewDate(today);
    setView("date");
  };

  const handleYearSelect = (year: number) => {
    setYearPageStart(null);
    monthTargetRef.current = "start";
    setMonthTarget("start");
    setViewDate(adapter.setYear(viewDate, year, context));
    setView(merged.hideMonths ? "date" : "month");
  };

  const openStartMonthView = () => {
    monthTargetRef.current = "start";
    setMonthTarget("start");
    setView("month");
  };

  const openEndMonthView = () => {
    monthTargetRef.current = "end";
    setMonthTarget("end");
    setView("month");
  };

  const handleMonthSelect = (month: number) => {
    if (monthTargetRef.current === "end") {
      const endYear = adapter.getYear(endViewDate, context);
      const endBase = adapter.setMonth(
        adapter.setYear(viewDate, endYear, context),
        month,
        context,
      );

      setViewDate(adapter.addMonths(endBase, -1, context));
    } else {
      setViewDate(adapter.setMonth(viewDate, month, context));
    }

    setView("date");
  };

  const monthPanelYear = derived(() => {
    if (monthTarget === "end") {
      return adapter.getYear(endViewDate, context);
    }

    return viewYear;
  });

  const monthPanelValue = derived(() => {
    if (monthTarget === "end") {
      return adapter.getMonth(endViewDate, context);
    }

    return viewMonth;
  });

  const shared = derived(() => {
    return {
      color: merged.color,
      tokens: merged.tokens,
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
        "min-w-[38rem]": !isVertical,
        "min-w-72": isVertical,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const headerBind = derived(() => {
    return mergePartBind(
      customProps?.header,
      {},
      cn({
        "flex items-center p-2.5": true,
        [mergedClasses.header ?? ""]: true,
      }),
    );
  });

  const monthsBind = derived(() => {
    return mergePartBind(
      customProps?.months,
      {},
      cn({
        "flex shrink-0 items-center gap-x-10": true,
        [mergedClasses.months ?? ""]: true,
      }),
    );
  });

  const endHeaderBind = derived(() => {
    return mergePartBind(
      customProps?.endHeader,
      {},
      cn({
        "flex items-center justify-center px-2.5 pb-1 pt-2": true,
        [mergedClasses.endHeader ?? ""]: true,
      }),
    );
  });

  const bodyBind = derived(() => {
    return mergePartBind(
      customProps?.body,
      {},
      cn({
        "flex min-h-64 flex-col p-2.5": true,
        [mergedClasses.body ?? ""]: true,
      }),
    );
  });

  const panelsBind = derived(() => {
    return mergePartBind(
      customProps?.panels,
      {},
      cn({
        "flex gap-4": true,
        "flex-row": !isVertical,
        "flex-col": isVertical,
        [mergedClasses.panels ?? ""]: true,
      }),
    );
  });

  const startBind = derived(() => {
    return mergePartBind(
      customProps?.start,
      {},
      cn({
        "flex w-72 shrink-0 flex-col": true,
        [mergedClasses.start ?? ""]: true,
      }),
    );
  });

  const endBind = derived(() => {
    return mergePartBind(
      customProps?.end,
      {},
      cn({
        "flex w-72 shrink-0 flex-col": true,
        [mergedClasses.end ?? ""]: true,
      }),
    );
  });

  const pickerFillBind = derived(() => {
    return cn({
      "flex min-h-64 flex-1 flex-col": true,
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
        "inline-flex cursor-pointer items-center gap-x-2 px-1.5 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 focus:outline-none disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-gray-800": true,
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
        "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-gray-800": true,
        [roundedClass ?? ""]: true,
        [mergedClasses.navButton ?? ""]: true,
      }),
    );
  });

  const previousNavLabel = derived(() => {
    if (view === "year") {
      return resolveMessage("Previous years");
    }

    return resolveMessage("Previous month");
  });

  const nextNavLabel = derived(() => {
    if (view === "year") {
      return resolveMessage("Next years");
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
        "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center hover:bg-gray-100 disabled:cursor-not-allowed dark:hover:bg-gray-800": true,
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
      disabled: merged.disabled || merged.hideYears,
    });
  });

  const monthSelectorBind = derived(() => {
    const bind = mergePartBind(customProps?.selector, undefined, {
      ...selectorBind,
      type: "button" as const,
      "aria-label": resolveMessage("Select month"),
      disabled: merged.disabled || merged.hideMonths,
    });

    return {
      ...bind,
      onClick: openStartMonthView,
    };
  });

  const endMonthSelectorBind = derived(() => {
    const bind = mergePartBind(customProps?.selector, undefined, {
      ...selectorBind,
      type: "button" as const,
      disabled: merged.disabled || merged.hideMonths,
      "aria-label": resolveMessage("Select end month"),
    });

    return {
      ...bind,
      onClick: openEndMonthView,
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
    monthTarget,
    handleChange,
    yearPageSize,
    endMonthLabel,
    showNav: true,
    endHeaderBind,
    nextButtonBind,
    pickerFillBind,
    monthPanelYear,
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
    showYearSelector: !merged.hideYears,
    yearPageStart: resolvedYearPageStart,
    showMonthSelector: !merged.hideMonths,
  };
}
