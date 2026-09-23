// ** External Imports
import { get, isArray, isNil, omit } from "es-toolkit/compat";
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
  resolveDatePickerMode,
  type CalendarView,
  type DatePickerModel,
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
  CalendarClasses,
  CalendarOwnProps,
  CalendarProps,
} from "@/Components/Calendar/calendar.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const calendarBridgeKeys = [
  "fill",
  "view",
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
  "viewDate",
  "hideYears",
  "hideMonths",
  "customProps",
  "defaultView",
  "granularity",
  "previewDate",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
  "hideOutsideDays",
] as const satisfies readonly (keyof CalendarOwnProps)[];

type CalendarLibDefaults = LibDefaultsShape<
  CalendarOwnProps,
  "color" | "rounded" | "defaultView" | "startOfWeek"
>;

type CalendarMerged = MergeLibDefaults<CalendarOwnProps, CalendarLibDefaults>;

function resolveFocusDate(
  value: DatePickerModel,
  adapter: ReturnType<typeof useDateAdapter>,
  timeZone?: string,
): Date {
  if (isNil(value)) {
    return adapter.now(timeZone);
  }

  if (isDateRangeValue(value)) {
    return value[0];
  }

  if (isArray(value)) {
    return value[0] ?? adapter.now(timeZone);
  }

  return value;
}

export function useCalendar(
  props: CalendarProps,
  libDefaults: CalendarLibDefaults,
) {
  const adapter = useDateAdapter();
  const resolveMessage = useResolveMessage();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    CalendarProps,
    typeof calendarBridgeKeys
  >({
    props,
    bridgeKeys: calendarBridgeKeys,
  });

  const { merged, entry: bridgeCalendar } = useBridgeUIComponent<
    CalendarMerged,
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
      "onViewChange",
      "onViewDateChange",
      "onPreviewDateChange",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarClasses>({
    props: componentProps,
  });

  const timeZone = derived((): string | undefined => {
    return merged.timeZone;
  });

  const mode = derived(() => {
    return resolveDatePickerMode({
      range: merged.range,
      multiple: merged.multiple,
    });
  });

  const isValueControlled = derived(() => {
    return !isNil(props.value);
  });

  const isViewControlled = derived(() => {
    return !isNil(props.view) && !isNil(props.onViewChange);
  });
  const isViewDateControlled = derived(() => {
    return !isNil(props.viewDate) && !isNil(props.onViewDateChange);
  });

  const [uncontrolledValue, setUncontrolledValue] = useState<DatePickerModel>(
    () => {
      return merged.defaultValue ?? null;
    },
  );

  const [uncontrolledView, setUncontrolledView] = useState<CalendarView>(() => {
    const granularity = merged.granularity ?? "day";

    return resolveCalendarPanelView({
      granularity,
      hideYears: merged.hideYears,
      hideMonths: merged.hideMonths,
      view:
        props.view ??
        merged.defaultView ??
        calendarPanelViewFromGranularity(granularity),
    });
  });

  const [uncontrolledViewDate, setUncontrolledViewDate] = useState(() => {
    const focus = !isNil(props.viewDate)
      ? (props.viewDate as Date)
      : resolveFocusDate(
          props.value ?? merged.defaultValue ?? null,
          adapter,
          timeZone,
        );

    return adapter.startOfMonth(focus, timeZone);
  });

  const yearPageSize = 15;

  const [yearPageStart, setYearPageStart] = useState<null | number>(null);

  const value = derived((): DatePickerModel => {
    if (isValueControlled) {
      return props.value ?? null;
    }

    return uncontrolledValue;
  });

  const granularity = derived(() => {
    return merged.granularity ?? "day";
  });

  const view = derived((): CalendarView => {
    const next = isViewControlled ? (props.view ?? "date") : uncontrolledView;

    return resolveCalendarPanelView({
      view: next,
      granularity,
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
    if (!isViewControlled) {
      setUncontrolledView(next);
    }

    props.onViewChange?.(next);
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

  const handleChange = (next: DatePickerModel) => {
    if (!isValueControlled) {
      setUncontrolledValue(next);
    }

    props.onChange?.(next);
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
          mode,
          value,
          adapter,
          timeZone,
          granularity,
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

  const handleMonthSelect = (month: number) => {
    const nextDate = adapter.setMonth(viewDate, month, timeZone);
    setViewDate(nextDate);

    if (granularity === "month") {
      handleChange(
        applyDateSelection({
          mode,
          value,
          adapter,
          timeZone,
          granularity,
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

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "flex flex-col overflow-hidden": true,
        "w-full min-w-72": merged.fill,
        "w-72": !merged.fill,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const headerBind = derived(() => {
    return mergePartBind(
      customProps?.header,
      {},
      cn({
        "flex items-center justify-between p-2.5": true,
        [mergedClasses.header ?? ""]: true,
      }),
    );
  });

  /**
   * Panel hosting date / month / year. Padding matches WireUI picker body.
   */
  const bodyBind = derived(() => {
    return mergePartBind(
      customProps?.body,
      {},
      cn({
        "flex flex-col p-2.5": true,
        [mergedClasses.body ?? ""]: true,
      }),
    );
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
    return mergePartBind(customProps?.selector, undefined, {
      ...selectorBind,
      type: "button" as const,
      onClick: () => setView("month"),
      "aria-label": resolveMessage("Select month"),
      disabled:
        merged.disabled ||
        isCalendarMonthPanelHidden({
          granularity,
          hideMonths: merged.hideMonths,
        }),
    });
  });

  return {
    view,
    mode,
    value,
    merged,
    timeZone,
    rootBind,
    viewDate,
    viewYear,
    bodyBind,
    viewMonth,
    yearLabel,
    monthLabel,
    headerBind,
    setViewDate,
    granularity,
    handleChange,
    yearPageSize,
    showNav: true,
    nextButtonBind,
    todayButtonBind,
    yearSelectorBind,
    handleYearSelect,
    monthSelectorBind,
    handleMonthSelect,
    previousButtonBind,
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
