// ** External Imports
import { get, isArray, isNil, omit } from "es-toolkit/compat";
import { useMemo, useState } from "react";

// ** Core Imports
import {
  cn,
  isDateRangeValue,
  mergeBridgeUILayeredClasses,
  resolveDatePickerMode,
  splitComponentProps,
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
  CalendarProps,
  CalendarView,
} from "@/Components/Calendar/calendar.types";
import {
  derived,
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
  adapter: ReturnType<typeof useDateAdapter>,
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
  props: CalendarProps,
  libDefaults: CalendarLibDefaults,
) {
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();
  const resolveMessage = useResolveMessage();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    CalendarProps,
    typeof calendarBridgeKeys
  >({
    props,
    bridgeKeys: calendarBridgeKeys,
  });

  const { merged } = useBridgeUIComponent<CalendarMerged>({
    libDefaults,
    props: componentProps,
  });

  const customProps = derived(() => merged.customProps);

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, [
      "slots",
      "onChange",
      "onViewChange",
      "onViewDateChange",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarClasses>({
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

  const isValueControlled = derived(() => !isNil(props.value));
  const isViewControlled = derived(() => !isNil(props.view));
  const isViewDateControlled = derived(() => !isNil(props.viewDate));

  const [uncontrolledValue, setUncontrolledValue] = useState<DatePickerModel>(
    () => merged.defaultValue ?? null,
  );

  const [uncontrolledView, setUncontrolledView] = useState<CalendarView>(
    () => merged.defaultView ?? "date",
  );

  const [uncontrolledViewDate, setUncontrolledViewDate] = useState(() => {
    const focus = resolveFocusDate(
      merged.defaultValue ?? null,
      adapter,
      context,
    );

    return adapter.startOfMonth(focus, context);
  });

  const value = derived((): DatePickerModel => {
    return isValueControlled ? (props.value ?? null) : uncontrolledValue;
  });

  const view = derived((): CalendarView => {
    const next = isViewControlled ? (props.view ?? "date") : uncontrolledView;

    if (next === "year" && merged.hideYears) {
      return "date";
    }

    if (next === "month" && merged.hideMonths) {
      return "date";
    }

    return next;
  });

  const viewDate = derived(() => {
    return isViewDateControlled
      ? (props.viewDate as Date)
      : uncontrolledViewDate;
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

  const viewYear = derived(() => adapter.getYear(viewDate, context));

  const viewMonth = derived(() => adapter.getMonth(viewDate, context));

  const setView = (next: CalendarView) => {
    if (!isViewControlled) {
      setUncontrolledView(next);
    }

    props.onViewChange?.(next);
  };

  const setViewDate = (next: Date) => {
    const normalized = adapter.startOfMonth(next, context);

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

  const goToPreviousMonth = () => {
    setViewDate(adapter.addMonths(viewDate, -1, context));
  };

  const goToNextMonth = () => {
    setViewDate(adapter.addMonths(viewDate, 1, context));
  };

  const goToToday = () => {
    const today = adapter.startOfMonth(adapter.now(context), context);

    setViewDate(today);
    setView("date");
  };

  const handleYearSelect = (year: number) => {
    setViewDate(adapter.setYear(viewDate, year, context));
    setView(merged.hideMonths ? "date" : "month");
  };

  const handleMonthSelect = (month: number) => {
    setViewDate(adapter.setMonth(viewDate, month, context));
    setView("date");
  };

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "flex w-72 flex-col gap-3 p-3": true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const headerBind = derived(() => {
    return mergePartBind(
      customProps?.header,
      {},
      cn({
        "flex items-center justify-between gap-2": true,
        [mergedClasses.header ?? ""]: true,
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
        "inline-flex items-center gap-1 px-1.5 py-1 text-sm font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800": true,
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
        "inline-flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800": true,
        [roundedClass ?? ""]: true,
        [mergedClasses.navButton ?? ""]: true,
      }),
    );
  });

  const previousButtonBind = derived(() => {
    return mergePartBind(
      customProps?.previousButton,
      {
        ...navButtonBind,
        type: "button" as const,
        disabled: merged.disabled,
        onClick: goToPreviousMonth,
        "aria-label": resolveMessage("Previous month"),
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
        onClick: goToNextMonth,
        type: "button" as const,
        disabled: merged.disabled,
        "aria-label": resolveMessage("Next month"),
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
        "inline-flex h-8 w-8 items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800": true,
        [roundedClass ?? ""]: true,
        [mergedClasses.navButton ?? ""]: true,
      }),
    );
  });

  const yearSelectorBind = derived(() => {
    return mergePartBind(customProps?.selector, undefined, {
      ...selectorBind,
      type: "button" as const,
      onClick: () => setView("year"),
      "aria-label": resolveMessage("Select year"),
      disabled: merged.disabled || merged.hideYears,
    });
  });

  const monthSelectorBind = derived(() => {
    return mergePartBind(customProps?.selector, undefined, {
      ...selectorBind,
      type: "button" as const,
      onClick: () => setView("month"),
      "aria-label": resolveMessage("Select month"),
      disabled: merged.disabled || merged.hideMonths,
    });
  });

  return {
    view,
    mode,
    value,
    merged,
    context,
    rootBind,
    viewDate,
    viewYear,
    viewMonth,
    yearLabel,
    monthLabel,
    headerBind,
    setViewDate,
    handleChange,
    nextButtonBind,
    todayButtonBind,
    yearSelectorBind,
    handleYearSelect,
    monthSelectorBind,
    handleMonthSelect,
    previousButtonBind,
    showDateNav: view === "date",
    navIconBind: customProps?.navIcon,
    showYearSelector: !merged.hideYears,
    showMonthSelector: !merged.hideMonths,
  };
}
