// ** External Imports
import { get, isNil, isUndefined, omit } from "es-toolkit/compat";
import { computed, ref, toValue, useAttrs, type MaybeRefOrGetter } from "vue";

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
} from "@/Components/CalendarMonth/calendarMonth.types";
import {
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
  props: MaybeRefOrGetter<CalendarMonthOwnProps>,
  libDefaults: CalendarMonthLibDefaults,
  emit: {
    (event: "change", month: number): void;
    (event: "previewDateChange", date: Date | null): void;
  },
) {
  const attrs = useAttrs();
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();

  const split = computed(() => {
    return splitComponentProps<
      CalendarMonthOwnProps,
      typeof calendarMonthBridgeKeys
    >({
      bridgeKeys: calendarMonthBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged, entry: bridgeCalendar } = useBridgeUIComponent<
    CalendarMonthMerged,
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
      "onPreviewDateChange",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarMonthClasses>({
    props: () => split.value.componentProps,
    entry: computed(() => {
      return undefined;
    }),
  });

  const context = computed((): DateAdapterContext => {
    return resolveContext(merged.value.timeZone);
  });

  const year = computed(() => {
    return (
      merged.value.year ??
      adapter.value.getYear(adapter.value.now(context.value), context.value)
    );
  });

  const mode = computed(() => {
    return resolveDatePickerMode({
      range: merged.value.range,
      multiple: merged.value.multiple,
    });
  });

  const isCommitPanel = computed(() => {
    return !isUndefined(merged.value.selection);
  });

  const uncontrolledPreview = ref<Date | null>(null);

  const previewDate = computed(() => {
    if (!isNil(merged.value.previewDate)) {
      return merged.value.previewDate;
    }

    return uncontrolledPreview.value;
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeCalendar.value?.tokens?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const colorClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeCalendar.value?.tokens?.color,
    );

    return getColorToken({
      tokens: classes,
      color: merged.value.color,
      invalid: merged.value.error,
    });
  });

  const months = computed((): CalendarMonthCell[] => {
    const names = adapter.value.getMonthNames(context.value);

    return names.map((label, month) => {
      const date = dateFromYearMonth({
        month,
        year: year.value,
        adapter: adapter.value,
        context: context.value,
      });
      const disabled =
        Boolean(merged.value.disabled) ||
        (isCommitPanel.value
          ? isDateDisabled(date, {
              granularity: "month",
              adapter: adapter.value,
              context: context.value,
              maxDate: merged.value.maxDate,
              minDate: merged.value.minDate,
              disableDates: merged.value.disableDates,
              disableYears: merged.value.disableYears,
              disableMonths: merged.value.disableMonths,
            })
          : isMonthDisabled({
              month,
              year: year.value,
              adapter: adapter.value,
              context: context.value,
              maxDate: merged.value.maxDate,
              minDate: merged.value.minDate,
              disableMonths: merged.value.disableMonths,
            }));

      const selected = isCommitPanel.value
        ? isDateSelected({
            date,
            mode: mode.value,
            granularity: "month",
            adapter: adapter.value,
            context: context.value,
            value: merged.value.selection ?? null,
          })
        : !isNil(merged.value.value) && merged.value.value === month;

      const preview =
        isCommitPanel.value &&
        mode.value === "range" &&
        isDateInRangePreview({
          date,
          granularity: "month",
          adapter: adapter.value,
          context: context.value,
          previewDate: previewDate.value,
          value: merged.value.selection ?? null,
        });

      const state = resolveCalendarDayInteractionState({
        disabled,
        selected,
        readOnly: merged.value.readOnly,
      });

      return {
        date,
        label,
        month,
        state,
        preview,
        selected,
        disabled: disabled || Boolean(merged.value.readOnly),
      };
    });
  });

  const setPreview = (date: Date | null) => {
    if (isNil(merged.value.previewDate)) {
      uncontrolledPreview.value = date;
    }

    emit("previewDateChange", date);
  };

  const canPreviewRange = computed(() => {
    if (
      !isCommitPanel.value ||
      mode.value !== "range" ||
      !isDateRangeValue(merged.value.selection)
    ) {
      return false;
    }

    const [start, end] = merged.value.selection;

    return isSameAtGranularity(
      start,
      end,
      "month",
      adapter.value,
      context.value,
    );
  });

  const selectMonth = (month: number) => {
    if (merged.value.disabled || merged.value.readOnly) {
      return;
    }

    const date = dateFromYearMonth({
      month,
      year: year.value,
      adapter: adapter.value,
      context: context.value,
    });

    if (isCommitPanel.value) {
      if (
        isDateDisabled(date, {
          granularity: "month",
          adapter: adapter.value,
          context: context.value,
          maxDate: merged.value.maxDate,
          minDate: merged.value.minDate,
          disableDates: merged.value.disableDates,
          disableYears: merged.value.disableYears,
          disableMonths: merged.value.disableMonths,
        })
      ) {
        return;
      }
    } else if (
      isMonthDisabled({
        month,
        year: year.value,
        adapter: adapter.value,
        context: context.value,
        maxDate: merged.value.maxDate,
        minDate: merged.value.minDate,
        disableMonths: merged.value.disableMonths,
      })
    ) {
      return;
    }

    emit("change", month);

    if (mode.value === "range") {
      setPreview(null);
    }
  };

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      rootInheritedAttrs.value,
      cn({
        "flex flex-col": true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const gridBind = computed(() => {
    return mergePartBind(
      customProps.value?.grid,
      {
        role: "grid",
        onMouseLeave: () => {
          if (canPreviewRange.value) {
            setPreview(null);
          }
        },
      },
      cn({
        "grid grid-cols-3 gap-2": true,
        [mergedClasses.value.grid ?? ""]: true,
      }),
    );
  });

  const getMonthBind = (cell: CalendarMonthCell) => {
    const color = colorClass.value;

    return mergePartBind(
      customProps.value?.month,
      {
        type: "button" as const,
        disabled: cell.disabled,
        "aria-pressed": cell.selected,
        onClick: () => selectMonth(cell.month),
        "data-preview": cell.preview ? "" : undefined,
        onMouseEnter: () => {
          if (canPreviewRange.value && !cell.disabled) {
            setPreview(cell.date);
          }
        },
      },
      cn({
        "cursor-pointer px-2 py-4 text-xs uppercase transition-all duration-150 ease-in-out outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed": true,
        [roundedClass.value ?? ""]: true,
        [color?.soft ?? ""]: cell.state === "base",
        [color?.hover ?? ""]: cell.state === "base",
        [color?.selected ?? ""]: cell.state === "selected",
        [color?.disabled ?? ""]: cell.state === "disabled",
        [mergedClasses.value.month ?? ""]: true,
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
