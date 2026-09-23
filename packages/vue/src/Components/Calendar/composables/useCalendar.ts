// ** External Imports
import { get, isArray, isFunction, isNil, omit } from "es-toolkit/compat";
import {
  computed,
  getCurrentInstance,
  ref,
  toValue,
  useAttrs,
  type MaybeRefOrGetter,
} from "vue";

// ** Core Imports
import type { DateAdapter } from "@bridge-ui/core/Adapters";
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
} from "@/Components/Calendar/calendar.types";
import {
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
  adapter: DateAdapter,
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
  props: MaybeRefOrGetter<CalendarOwnProps>,
  libDefaults: CalendarLibDefaults,
  emit: {
    (event: "change", value: DatePickerModel): void;
    (event: "viewChange", view: CalendarView): void;
    (event: "viewDateChange", date: Date): void;
  },
) {
  const attrs = useAttrs();
  const adapter = useDateAdapter();
  const resolveMessage = useResolveMessage();

  const split = computed(() => {
    return splitComponentProps<CalendarOwnProps, typeof calendarBridgeKeys>({
      bridgeKeys: calendarBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged, entry: bridgeCalendar } = useBridgeUIComponent<
    CalendarMerged,
    "Calendar"
  >({
    libDefaults,
    componentName: "Calendar",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, [
      "onChange",
      "onViewChange",
      "onViewDateChange",
      "onPreviewDateChange",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarClasses>({
    props: () => split.value.componentProps,
    entry: computed(() => {
      return undefined;
    }),
  });

  const timeZone = computed((): string | undefined => {
    return merged.value.timeZone;
  });

  const mode = computed(() => {
    return resolveDatePickerMode({
      range: merged.value.range,
      multiple: merged.value.multiple,
    });
  });

  const propsValue = computed(() => {
    return toValue(props);
  });

  const isValueControlled = computed(() => {
    return !isNil(propsValue.value.value);
  });

  const isViewControlled = computed(() => {
    const vnodeProps = getCurrentInstance()?.vnode.props ?? {};

    const hasListener =
      isFunction(vnodeProps.onViewChange) ||
      isFunction(vnodeProps["onUpdate:view"]);

    return !isNil(propsValue.value.view) && hasListener;
  });
  const isViewDateControlled = computed(() => {
    const vnodeProps = getCurrentInstance()?.vnode.props ?? {};

    const hasListener =
      isFunction(vnodeProps.onViewDateChange) ||
      isFunction(vnodeProps["onUpdate:viewDate"]);

    return !isNil(propsValue.value.viewDate) && hasListener;
  });

  const uncontrolledValue = ref<DatePickerModel>(
    merged.value.defaultValue ?? null,
  );

  const uncontrolledView = ref<CalendarView>(
    resolveCalendarPanelView({
      hideYears: merged.value.hideYears,
      hideMonths: merged.value.hideMonths,
      granularity: propsValue.value.granularity ?? "day",
      view:
        propsValue.value.view ??
        merged.value.defaultView ??
        calendarPanelViewFromGranularity(propsValue.value.granularity ?? "day"),
    }),
  );

  const uncontrolledViewDate = ref<Date>(
    adapter.value.startOfMonth(
      !isNil(propsValue.value.viewDate)
        ? (propsValue.value.viewDate as Date)
        : resolveFocusDate(
            propsValue.value.value ?? merged.value.defaultValue ?? null,
            adapter.value,
            timeZone.value,
          ),
      timeZone.value,
    ),
  );

  const yearPageSize = 15;
  const yearPageStart = ref<null | number>(null);

  const value = computed((): DatePickerModel => {
    if (isValueControlled.value) {
      return propsValue.value.value ?? null;
    }

    return uncontrolledValue.value;
  });

  const granularity = computed(() => {
    return merged.value.granularity ?? "day";
  });

  const view = computed((): CalendarView => {
    const next = isViewControlled.value
      ? (propsValue.value.view ?? "date")
      : uncontrolledView.value;

    return resolveCalendarPanelView({
      view: next,
      granularity: granularity.value,
      hideYears: merged.value.hideYears,
      hideMonths: merged.value.hideMonths,
    });
  });

  const viewDate = computed(() => {
    if (isViewDateControlled.value) {
      return propsValue.value.viewDate as Date;
    }

    return uncontrolledViewDate.value;
  });

  const yearLabel = computed(() => {
    return String(adapter.value.getYear(viewDate.value, timeZone.value));
  });

  const monthLabel = computed(() => {
    const names = adapter.value.getMonthNames();

    return names[adapter.value.getMonth(viewDate.value, timeZone.value)] ?? "";
  });

  const viewYear = computed(() => {
    return adapter.value.getYear(viewDate.value, timeZone.value);
  });

  const viewMonth = computed(() => {
    return adapter.value.getMonth(viewDate.value, timeZone.value);
  });

  const resolvedYearPageStart = computed(() => {
    if (!isNil(yearPageStart.value)) {
      return yearPageStart.value;
    }

    return Math.max(1, viewYear.value - Math.floor(yearPageSize / 2));
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeCalendar.value?.tokens?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const setView = (next: CalendarView) => {
    if (!isViewControlled.value) {
      uncontrolledView.value = next;
    }

    emit("viewChange", next);
  };

  const openYearView = () => {
    yearPageStart.value = Math.max(
      1,
      viewYear.value - Math.floor(yearPageSize / 2),
    );
    setView("year");
  };

  const setViewDate = (next: Date) => {
    const normalized = adapter.value.startOfMonth(next, timeZone.value);

    if (!isViewDateControlled.value) {
      uncontrolledViewDate.value = normalized;
    }

    emit("viewDateChange", normalized);
  };

  const handleChange = (next: DatePickerModel) => {
    if (!isValueControlled.value) {
      uncontrolledValue.value = next;
    }

    emit("change", next);
  };

  const goToPrevious = () => {
    if (view.value === "year") {
      yearPageStart.value = Math.max(
        1,
        resolvedYearPageStart.value - yearPageSize,
      );
      return;
    }

    if (view.value === "month") {
      setViewDate(adapter.value.addYears(viewDate.value, -1, timeZone.value));
      return;
    }

    setViewDate(adapter.value.addMonths(viewDate.value, -1, timeZone.value));
  };

  const goToNext = () => {
    if (view.value === "year") {
      yearPageStart.value = resolvedYearPageStart.value + yearPageSize;
      return;
    }

    if (view.value === "month") {
      setViewDate(adapter.value.addYears(viewDate.value, 1, timeZone.value));
      return;
    }

    setViewDate(adapter.value.addMonths(viewDate.value, 1, timeZone.value));
  };

  /**
   * Jumps to today's month on the commit panel without changing the selection.
   */
  const goToToday = () => {
    const today = adapter.value.startOfMonth(
      adapter.value.now(timeZone.value),
      timeZone.value,
    );

    yearPageStart.value = null;
    setViewDate(today);
    setView(calendarPanelViewFromGranularity(granularity.value));
  };

  const handleYearSelect = (year: number) => {
    yearPageStart.value = null;
    const nextDate = adapter.value.setYear(
      viewDate.value,
      year,
      timeZone.value,
    );
    setViewDate(nextDate);

    if (granularity.value === "year") {
      handleChange(
        applyDateSelection({
          mode: mode.value,
          value: value.value,
          granularity: "year",
          adapter: adapter.value,
          timeZone: timeZone.value,
          next: normalizeDateToGranularity(
            nextDate,
            "year",
            adapter.value,
            timeZone.value,
          ),
        }),
      );
      return;
    }

    setView(
      isCalendarMonthPanelHidden({
        granularity: granularity.value,
        hideMonths: merged.value.hideMonths,
      })
        ? calendarPanelViewFromGranularity(granularity.value)
        : "month",
    );
  };

  const handleMonthSelect = (month: number) => {
    const nextDate = adapter.value.setMonth(
      viewDate.value,
      month,
      timeZone.value,
    );
    setViewDate(nextDate);

    if (granularity.value === "month") {
      handleChange(
        applyDateSelection({
          mode: mode.value,
          value: value.value,
          granularity: "month",
          adapter: adapter.value,
          timeZone: timeZone.value,
          next: normalizeDateToGranularity(
            nextDate,
            "month",
            adapter.value,
            timeZone.value,
          ),
        }),
      );
      return;
    }

    setView("date");
  };

  const shared = computed(() => {
    return {
      color: merged.value.color,
      error: merged.value.error,
      rounded: merged.value.rounded,
      maxDate: merged.value.maxDate,
      minDate: merged.value.minDate,
      disabled: merged.value.disabled,
      readOnly: merged.value.readOnly,
      timeZone: merged.value.timeZone,
    };
  });

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      rootInheritedAttrs.value,
      cn({
        "flex flex-col overflow-hidden": true,
        "w-full min-w-72": merged.value.fill,
        "w-72": !merged.value.fill,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const headerBind = computed(() => {
    return mergePartBind(
      customProps.value?.header,
      {},
      cn({
        "flex items-center justify-between p-2.5": true,
        [mergedClasses.value.header ?? ""]: true,
      }),
    );
  });

  /**
   * Panel hosting date / month / year. Padding matches WireUI picker body.
   */
  const bodyBind = computed(() => {
    return mergePartBind(
      customProps.value?.body,
      {},
      cn({
        "flex flex-col p-2.5": true,
        [mergedClasses.value.body ?? ""]: true,
      }),
    );
  });

  const selectorBind = computed(() => {
    return mergePartBind(
      customProps.value?.selector,
      {
        type: "button" as const,
        disabled: merged.value.disabled,
      },
      cn({
        "inline-flex cursor-pointer items-center gap-x-2 px-1.5 py-1 text-sm font-medium text-dark-600 hover:bg-dark-100 focus:outline-none disabled:cursor-not-allowed dark:text-dark-300 dark:hover:bg-dark-800": true,
        [roundedClass.value ?? ""]: true,
        [mergedClasses.value.selector ?? ""]: true,
      }),
    );
  });

  const navButtonBind = computed(() => {
    return mergePartBind(
      customProps.value?.navButton,
      {
        type: "button" as const,
        disabled: merged.value.disabled,
      },
      cn({
        "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center text-dark-600 hover:bg-dark-100 disabled:cursor-not-allowed dark:text-dark-300 dark:hover:bg-dark-800": true,
        [roundedClass.value ?? ""]: true,
        [mergedClasses.value.navButton ?? ""]: true,
      }),
    );
  });

  const previousNavLabel = computed(() => {
    if (view.value === "year") {
      return resolveMessage("Previous years");
    }

    if (view.value === "month") {
      return resolveMessage("Previous year");
    }

    return resolveMessage("Previous month");
  });

  const nextNavLabel = computed(() => {
    if (view.value === "year") {
      return resolveMessage("Next years");
    }

    if (view.value === "month") {
      return resolveMessage("Next year");
    }

    return resolveMessage("Next month");
  });

  const previousButtonBind = computed(() => {
    return mergePartBind(
      customProps.value?.previousButton,
      {
        ...navButtonBind.value,
        onClick: goToPrevious,
        type: "button" as const,
        disabled: merged.value.disabled,
        "aria-label": previousNavLabel.value,
      },
      cn({
        [mergedClasses.value.navButton ?? ""]: true,
      }),
    );
  });

  const nextButtonBind = computed(() => {
    return mergePartBind(
      customProps.value?.nextButton,
      {
        ...navButtonBind.value,
        onClick: goToNext,
        type: "button" as const,
        disabled: merged.value.disabled,
        "aria-label": nextNavLabel.value,
      },
      cn({
        [mergedClasses.value.navButton ?? ""]: true,
      }),
    );
  });

  const todayButtonBind = computed(() => {
    return mergePartBind(
      customProps.value?.todayButton,
      {
        onClick: goToToday,
        type: "button" as const,
        disabled: merged.value.disabled,
        "aria-label": resolveMessage("Today"),
      },
      cn({
        "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center hover:bg-dark-100 disabled:cursor-not-allowed dark:hover:bg-dark-800": true,
        [roundedClass.value ?? ""]: true,
        [mergedClasses.value.navButton ?? ""]: true,
      }),
    );
  });

  const yearSelectorBind = computed(() => {
    return mergePartBind(customProps.value?.selector, undefined, {
      ...selectorBind.value,
      onClick: openYearView,
      type: "button" as const,
      "aria-label": resolveMessage("Select year"),
      disabled:
        merged.value.disabled ||
        isCalendarYearPanelHidden({
          granularity: granularity.value,
          hideYears: merged.value.hideYears,
        }),
    });
  });

  const monthSelectorBind = computed(() => {
    return mergePartBind(customProps.value?.selector, undefined, {
      ...selectorBind.value,
      type: "button" as const,
      onClick: () => setView("month"),
      "aria-label": resolveMessage("Select month"),
      disabled:
        merged.value.disabled ||
        isCalendarMonthPanelHidden({
          granularity: granularity.value,
          hideMonths: merged.value.hideMonths,
        }),
    });
  });

  const showYearSelector = computed(() => {
    return !isCalendarYearPanelHidden({
      granularity: granularity.value,
      hideYears: merged.value.hideYears,
    });
  });
  const showMonthSelector = computed(() => {
    return !isCalendarMonthPanelHidden({
      granularity: granularity.value,
      hideMonths: merged.value.hideMonths,
    });
  });
  const showNav = computed(() => {
    return true;
  });

  const navIconBind = computed(() => {
    return customProps.value?.navIcon;
  });

  return {
    view,
    mode,
    value,
    merged,
    shared,
    showNav,
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
    navIconBind,
    granularity,
    handleChange,
    yearPageSize,
    nextButtonBind,
    todayButtonBind,
    yearSelectorBind,
    handleYearSelect,
    showYearSelector,
    monthSelectorBind,
    handleMonthSelect,
    showMonthSelector,
    previousButtonBind,
    yearPageStart: resolvedYearPageStart,
  };
}
