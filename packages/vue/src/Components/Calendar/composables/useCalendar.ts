// ** External Imports
import { get, isArray, isNil, omit } from "es-toolkit/compat";
import { computed, ref, toValue, useAttrs, type MaybeRefOrGetter } from "vue";

// ** Core Imports
import {
  cn,
  isDateRangeValue,
  mergeBridgeUILayeredClasses,
  resolveDatePickerMode,
  splitComponentProps,
  type DateAdapter,
  type DateAdapterContext,
  type DatePickerModel,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { roundedProps } from "@bridge-ui/core/Tokens/Calendar";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  CalendarClasses,
  CalendarOwnProps,
  CalendarView,
} from "@/Components/Calendar/calendar.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const calendarBridgeKeys = [
  "view",
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
  "hideYears",
  "hideMonths",
  "customProps",
  "defaultView",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
] as const satisfies readonly (keyof CalendarOwnProps)[];

type CalendarLibDefaults = LibDefaultsShape<
  CalendarOwnProps,
  "color" | "rounded" | "defaultView" | "startOfWeek"
>;

type CalendarMerged = MergeLibDefaults<CalendarOwnProps, CalendarLibDefaults>;

function resolveFocusDate(
  value: DatePickerModel,
  adapter: DateAdapter,
  context: DateAdapterContext,
): Date {
  if (isNil(value)) {
    return adapter.now(context);
  }

  if (isDateRangeValue(value)) {
    return value[0];
  }

  if (isArray(value)) {
    return value[0] ?? adapter.now(context);
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
  const resolveContext = useDateAdapterContext();
  const resolveMessage = useResolveMessage();

  const split = computed(() => {
    return splitComponentProps<CalendarOwnProps, typeof calendarBridgeKeys>({
      bridgeKeys: calendarBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged } = useBridgeUIComponent<CalendarMerged>({
    libDefaults,
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
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarClasses>({
    entry: computed(() => undefined),
    props: () => split.value.componentProps,
  });

  const context = computed((): DateAdapterContext => {
    return resolveContext(merged.value.timeZone);
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

  const isValueControlled = computed(() => !isNil(propsValue.value.value));
  const isViewControlled = computed(() => !isNil(propsValue.value.view));
  const isViewDateControlled = computed(
    () => !isNil(propsValue.value.viewDate),
  );

  const uncontrolledValue = ref<DatePickerModel>(
    merged.value.defaultValue ?? null,
  );

  const uncontrolledView = ref<CalendarView>(
    merged.value.defaultView ?? "date",
  );

  const uncontrolledViewDate = ref<Date>(
    adapter.value.startOfMonth(
      resolveFocusDate(
        merged.value.defaultValue ?? null,
        adapter.value,
        context.value,
      ),
      context.value,
    ),
  );

  const value = computed((): DatePickerModel => {
    return isValueControlled.value
      ? (propsValue.value.value ?? null)
      : uncontrolledValue.value;
  });

  const view = computed((): CalendarView => {
    const next = isViewControlled.value
      ? (propsValue.value.view ?? "date")
      : uncontrolledView.value;

    if (next === "year" && merged.value.hideYears) {
      return "date";
    }

    if (next === "month" && merged.value.hideMonths) {
      return "date";
    }

    return next;
  });

  const viewDate = computed(() => {
    return isViewDateControlled.value
      ? (propsValue.value.viewDate as Date)
      : uncontrolledViewDate.value;
  });

  const yearLabel = computed(() => {
    return String(adapter.value.getYear(viewDate.value, context.value));
  });

  const monthLabel = computed(() => {
    const names = adapter.value.getMonthNames(context.value);

    return names[adapter.value.getMonth(viewDate.value, context.value)] ?? "";
  });

  const viewYear = computed(() =>
    adapter.value.getYear(viewDate.value, context.value),
  );

  const viewMonth = computed(() =>
    adapter.value.getMonth(viewDate.value, context.value),
  );

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      merged.value.tokens?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const setView = (next: CalendarView) => {
    if (!isViewControlled.value) {
      uncontrolledView.value = next;
    }

    emit("viewChange", next);
  };

  const setViewDate = (next: Date) => {
    const normalized = adapter.value.startOfMonth(next, context.value);

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

  const goToPreviousMonth = () => {
    setViewDate(adapter.value.addMonths(viewDate.value, -1, context.value));
  };

  const goToNextMonth = () => {
    setViewDate(adapter.value.addMonths(viewDate.value, 1, context.value));
  };

  const goToToday = () => {
    const today = adapter.value.startOfMonth(
      adapter.value.now(context.value),
      context.value,
    );

    setViewDate(today);
    setView("date");
  };

  const handleYearSelect = (year: number) => {
    setViewDate(adapter.value.setYear(viewDate.value, year, context.value));
    setView(merged.value.hideMonths ? "date" : "month");
  };

  const handleMonthSelect = (month: number) => {
    setViewDate(adapter.value.setMonth(viewDate.value, month, context.value));
    setView("date");
  };

  const shared = computed(() => ({
    color: merged.value.color,
    tokens: merged.value.tokens,
    rounded: merged.value.rounded,
    maxDate: merged.value.maxDate,
    minDate: merged.value.minDate,
    disabled: merged.value.disabled,
    readOnly: merged.value.readOnly,
    timeZone: merged.value.timeZone,
    disableYears: merged.value.disableYears,
    disableMonths: merged.value.disableMonths,
  }));

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      rootInheritedAttrs.value,
      cn({
        "flex w-72 flex-col gap-3 p-3": true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const headerBind = computed(() => {
    return mergePartBind(
      customProps.value?.header,
      {},
      cn({
        "flex items-center justify-between gap-2": true,
        [mergedClasses.value.header ?? ""]: true,
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
        "inline-flex items-center gap-1 px-1.5 py-1 text-sm font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800": true,
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
        "inline-flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800": true,
        [roundedClass.value ?? ""]: true,
        [mergedClasses.value.navButton ?? ""]: true,
      }),
    );
  });

  const previousButtonBind = computed(() => {
    return mergePartBind(
      customProps.value?.previousButton,
      {
        ...navButtonBind.value,
        type: "button" as const,
        onClick: goToPreviousMonth,
        disabled: merged.value.disabled,
        "aria-label": resolveMessage("Previous month"),
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
        onClick: goToNextMonth,
        type: "button" as const,
        disabled: merged.value.disabled,
        "aria-label": resolveMessage("Next month"),
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
        "inline-flex h-8 w-8 items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800": true,
        [roundedClass.value ?? ""]: true,
        [mergedClasses.value.navButton ?? ""]: true,
      }),
    );
  });

  const yearSelectorBind = computed(() => {
    return mergePartBind(customProps.value?.selector, undefined, {
      ...selectorBind.value,
      type: "button" as const,
      onClick: () => setView("year"),
      "aria-label": resolveMessage("Select year"),
      disabled: merged.value.disabled || merged.value.hideYears,
    });
  });

  const monthSelectorBind = computed(() => {
    return mergePartBind(customProps.value?.selector, undefined, {
      ...selectorBind.value,
      type: "button" as const,
      onClick: () => setView("month"),
      "aria-label": resolveMessage("Select month"),
      disabled: merged.value.disabled || merged.value.hideMonths,
    });
  });

  const showYearSelector = computed(() => !merged.value.hideYears);
  const showMonthSelector = computed(() => !merged.value.hideMonths);
  const showDateNav = computed(() => view.value === "date");

  return {
    view,
    mode,
    value,
    merged,
    shared,
    context,
    rootBind,
    viewDate,
    viewYear,
    viewMonth,
    yearLabel,
    monthLabel,
    headerBind,
    setViewDate,
    showDateNav,
    handleChange,
    nextButtonBind,
    todayButtonBind,
    yearSelectorBind,
    handleYearSelect,
    showYearSelector,
    monthSelectorBind,
    handleMonthSelect,
    showMonthSelector,
    previousButtonBind,
    navIconBind: computed(() => customProps.value?.navIcon),
  };
}
