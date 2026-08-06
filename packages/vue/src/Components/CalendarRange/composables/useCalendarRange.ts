// ** External Imports
import { get, isFunction, isNil, omit } from "es-toolkit/compat";
import {
  computed,
  getCurrentInstance,
  ref,
  toValue,
  useAttrs,
  type MaybeRefOrGetter,
} from "vue";

// ** Core Imports
import {
  cn,
  isDateRangeValue,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type DateAdapter,
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
  CalendarRangeView,
} from "@/Components/CalendarRange/calendarRange.types";
import {
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
  adapter: DateAdapter,
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
  props: MaybeRefOrGetter<CalendarRangeOwnProps>,
  libDefaults: CalendarRangeLibDefaults,
  emit: {
    (event: "change", value: null | DateRangeValue): void;
    (event: "viewDateChange", date: Date): void;
    (event: "previewDateChange", date: Date | null): void;
  },
) {
  const attrs = useAttrs();
  const adapter = useDateAdapter();
  const resolveMessage = useResolveMessage();
  const resolveContext = useDateAdapterContext();

  const split = computed(() => {
    return splitComponentProps<
      CalendarRangeOwnProps,
      typeof calendarRangeBridgeKeys
    >({
      bridgeKeys: calendarRangeBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged } = useBridgeUIComponent<CalendarRangeMerged>({
    libDefaults,
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, [
      "onChange",
      "onViewDateChange",
      "onPreviewDateChange",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarRangeClasses>({
    props: () => split.value.componentProps,
    entry: computed(() => {
      return undefined;
    }),
  });

  const context = computed((): DateAdapterContext => {
    return resolveContext(merged.value.timeZone);
  });

  const propsValue = computed(() => {
    return toValue(props);
  });

  const isValueControlled = computed(() => {
    return !isNil(propsValue.value.value);
  });

  const isViewDateControlled = computed(() => {
    const vnodeProps = getCurrentInstance()?.vnode.props ?? {};

    const hasListener =
      isFunction(vnodeProps.onViewDateChange) ||
      isFunction(vnodeProps["onUpdate:viewDate"]);

    return !isNil(propsValue.value.viewDate) && hasListener;
  });

  const isPreviewControlled = computed(() => {
    return !isNil(propsValue.value.previewDate);
  });

  const uncontrolledValue = ref<null | DateRangeValue>(
    merged.value.defaultValue ?? null,
  );

  const uncontrolledView = ref<CalendarRangeView>("date");

  const uncontrolledViewDate = ref<Date>(
    adapter.value.startOfMonth(
      !isNil(propsValue.value.viewDate)
        ? (propsValue.value.viewDate as Date)
        : resolveFocusDate(
            merged.value.defaultValue ?? null,
            adapter.value,
            context.value,
          ),
      context.value,
    ),
  );

  const uncontrolledPreview = ref<Date | null>(null);

  const yearPageSize = 15;
  const yearPageStart = ref<null | number>(null);
  const monthTarget = ref<"end" | "start">("start");

  const value = computed((): null | DateRangeValue => {
    if (isValueControlled.value) {
      return propsValue.value.value ?? null;
    }

    return uncontrolledValue.value;
  });

  const view = computed((): CalendarRangeView => {
    if (uncontrolledView.value === "year" && merged.value.hideYears) {
      return "date";
    }

    if (uncontrolledView.value === "month" && merged.value.hideMonths) {
      return "date";
    }

    return uncontrolledView.value;
  });

  const viewDate = computed(() => {
    if (isViewDateControlled.value) {
      return propsValue.value.viewDate as Date;
    }

    return uncontrolledViewDate.value;
  });

  const endViewDate = computed(() => {
    return adapter.value.addMonths(viewDate.value, 1, context.value);
  });

  const previewDate = computed(() => {
    if (isPreviewControlled.value) {
      return propsValue.value.previewDate ?? null;
    }

    return uncontrolledPreview.value;
  });

  const yearLabel = computed(() => {
    return String(adapter.value.getYear(viewDate.value, context.value));
  });

  const monthLabel = computed(() => {
    const names = adapter.value.getMonthNames(context.value);

    return names[adapter.value.getMonth(viewDate.value, context.value)] ?? "";
  });

  const endMonthLabel = computed(() => {
    const names = adapter.value.getMonthNames(context.value);

    return (
      names[adapter.value.getMonth(endViewDate.value, context.value)] ?? ""
    );
  });

  const viewYear = computed(() => {
    return adapter.value.getYear(viewDate.value, context.value);
  });

  const viewMonth = computed(() => {
    return adapter.value.getMonth(viewDate.value, context.value);
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
      merged.value.tokens?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const setView = (next: CalendarRangeView) => {
    uncontrolledView.value = next;
  };

  const openYearView = () => {
    yearPageStart.value = Math.max(
      1,
      viewYear.value - Math.floor(yearPageSize / 2),
    );
    setView("year");
  };

  const setViewDate = (next: Date) => {
    const normalized = adapter.value.startOfMonth(next, context.value);

    if (!isViewDateControlled.value) {
      uncontrolledViewDate.value = normalized;
    }

    emit("viewDateChange", normalized);
  };

  const handleStartViewDateChange = (next: Date) => {
    setViewDate(next);
  };

  const handleEndViewDateChange = (next: Date) => {
    setViewDate(adapter.value.addMonths(next, -1, context.value));
  };

  const handleChange = (next: DatePickerModel) => {
    const rangeValue = toRangeValue(next);

    if (!isValueControlled.value) {
      uncontrolledValue.value = rangeValue;
    }

    emit("change", rangeValue);
  };

  const handlePreviewDateChange = (next: Date | null) => {
    if (!isPreviewControlled.value) {
      uncontrolledPreview.value = next;
    }

    emit("previewDateChange", next);
  };

  const goToPrevious = () => {
    if (view.value === "year") {
      yearPageStart.value = Math.max(
        1,
        resolvedYearPageStart.value - yearPageSize,
      );
      return;
    }

    setViewDate(adapter.value.addMonths(viewDate.value, -1, context.value));
  };

  const goToNext = () => {
    if (view.value === "year") {
      yearPageStart.value = resolvedYearPageStart.value + yearPageSize;
      return;
    }

    setViewDate(adapter.value.addMonths(viewDate.value, 1, context.value));
  };

  /**
   * Jumps to the date panels on today's month without changing the selection.
   */
  const goToToday = () => {
    const today = adapter.value.startOfMonth(
      adapter.value.now(context.value),
      context.value,
    );

    yearPageStart.value = null;
    setViewDate(today);
    setView("date");
  };

  const handleYearSelect = (year: number) => {
    yearPageStart.value = null;
    monthTarget.value = "start";
    setViewDate(adapter.value.setYear(viewDate.value, year, context.value));
    setView(merged.value.hideMonths ? "date" : "month");
  };

  const openStartMonthView = () => {
    monthTarget.value = "start";
    setView("month");
  };

  const openEndMonthView = () => {
    monthTarget.value = "end";
    setView("month");
  };

  const handleMonthSelect = (month: number) => {
    if (monthTarget.value === "end") {
      const endYear = adapter.value.getYear(endViewDate.value, context.value);
      const endBase = adapter.value.setMonth(
        adapter.value.setYear(viewDate.value, endYear, context.value),
        month,
        context.value,
      );

      setViewDate(adapter.value.addMonths(endBase, -1, context.value));
    } else {
      setViewDate(adapter.value.setMonth(viewDate.value, month, context.value));
    }

    setView("date");
  };

  const monthPanelYear = computed(() => {
    if (monthTarget.value === "end") {
      return adapter.value.getYear(endViewDate.value, context.value);
    }

    return viewYear.value;
  });

  const monthPanelValue = computed(() => {
    if (monthTarget.value === "end") {
      return adapter.value.getMonth(endViewDate.value, context.value);
    }

    return viewMonth.value;
  });

  const shared = computed(() => {
    return {
      color: merged.value.color,
      tokens: merged.value.tokens,
      rounded: merged.value.rounded,
      maxDate: merged.value.maxDate,
      minDate: merged.value.minDate,
      disabled: merged.value.disabled,
      readOnly: merged.value.readOnly,
      timeZone: merged.value.timeZone,
    };
  });

  const isVertical = computed(() => {
    return merged.value.orientation === "vertical";
  });

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      rootInheritedAttrs.value,
      cn({
        "flex flex-col overflow-hidden": true,
        "min-w-[38rem]": !isVertical.value,
        "min-w-72": isVertical.value,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const headerBind = computed(() => {
    return mergePartBind(
      customProps.value?.header,
      {},
      cn({
        "flex items-center p-2.5": true,
        [mergedClasses.value.header ?? ""]: true,
      }),
    );
  });

  const monthsBind = computed(() => {
    return mergePartBind(
      customProps.value?.months,
      {},
      cn({
        "flex shrink-0 items-center gap-x-10": true,
        [mergedClasses.value.months ?? ""]: true,
      }),
    );
  });

  const endHeaderBind = computed(() => {
    return mergePartBind(
      customProps.value?.endHeader,
      {},
      cn({
        "flex items-center justify-center px-2.5 pb-1 pt-2": true,
        [mergedClasses.value.endHeader ?? ""]: true,
      }),
    );
  });

  const bodyBind = computed(() => {
    return mergePartBind(
      customProps.value?.body,
      {},
      cn({
        "flex min-h-64 flex-col p-2.5": true,
        [mergedClasses.value.body ?? ""]: true,
      }),
    );
  });

  const panelsBind = computed(() => {
    return mergePartBind(
      customProps.value?.panels,
      {},
      cn({
        "flex gap-4": true,
        "flex-row": !isVertical.value,
        "flex-col": isVertical.value,
        [mergedClasses.value.panels ?? ""]: true,
      }),
    );
  });

  const startBind = computed(() => {
    return mergePartBind(
      customProps.value?.start,
      {},
      cn({
        "flex w-72 shrink-0 flex-col": true,
        [mergedClasses.value.start ?? ""]: true,
      }),
    );
  });

  const endBind = computed(() => {
    return mergePartBind(
      customProps.value?.end,
      {},
      cn({
        "flex w-72 shrink-0 flex-col": true,
        [mergedClasses.value.end ?? ""]: true,
      }),
    );
  });

  const pickerFillBind = computed(() => {
    return cn({
      "flex min-h-64 flex-1 flex-col": true,
    });
  });

  const selectorBind = computed(() => {
    return mergePartBind(
      customProps.value?.selector,
      {
        type: "button" as const,
        disabled: merged.value.disabled,
      },
      cn({
        "inline-flex cursor-pointer items-center gap-x-2 px-1.5 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 focus:outline-none disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-gray-800": true,
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
        "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-gray-800": true,
        [roundedClass.value ?? ""]: true,
        [mergedClasses.value.navButton ?? ""]: true,
      }),
    );
  });

  const previousNavLabel = computed(() => {
    if (view.value === "year") {
      return resolveMessage("Previous years");
    }

    return resolveMessage("Previous month");
  });

  const nextNavLabel = computed(() => {
    if (view.value === "year") {
      return resolveMessage("Next years");
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
        "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center hover:bg-gray-100 disabled:cursor-not-allowed dark:hover:bg-gray-800": true,
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
      disabled: merged.value.disabled || merged.value.hideYears,
    });
  });

  const monthSelectorBind = computed(() => {
    const bind = mergePartBind(customProps.value?.selector, undefined, {
      ...selectorBind.value,
      type: "button" as const,
      "aria-label": resolveMessage("Select month"),
      disabled: merged.value.disabled || merged.value.hideMonths,
    });

    return {
      ...bind,
      onClick: openStartMonthView,
    };
  });

  const endMonthSelectorBind = computed(() => {
    const bind = mergePartBind(customProps.value?.selector, undefined, {
      ...selectorBind.value,
      type: "button" as const,
      "aria-label": resolveMessage("Select end month"),
      disabled: merged.value.disabled || merged.value.hideMonths,
    });

    return {
      ...bind,
      onClick: openEndMonthView,
    };
  });

  const showYearSelector = computed(() => {
    return !merged.value.hideYears;
  });

  const showMonthSelector = computed(() => {
    return !merged.value.hideMonths;
  });

  const showNav = computed(() => {
    return true;
  });

  const navIconBind = computed(() => {
    return customProps.value?.navIcon;
  });

  return {
    view,
    value,
    shared,
    merged,
    showNav,
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
    navIconBind,
    monthTarget,
    handleChange,
    yearPageSize,
    endMonthLabel,
    endHeaderBind,
    nextButtonBind,
    pickerFillBind,
    monthPanelYear,
    todayButtonBind,
    monthPanelValue,
    yearSelectorBind,
    handleYearSelect,
    showYearSelector,
    monthSelectorBind,
    handleMonthSelect,
    showMonthSelector,
    previousButtonBind,
    endMonthSelectorBind,
    handleEndViewDateChange,
    handlePreviewDateChange,
    handleStartViewDateChange,
    yearPageStart: resolvedYearPageStart,
  };
}
