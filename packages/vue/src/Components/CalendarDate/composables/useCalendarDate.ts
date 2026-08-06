// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { computed, ref, toValue, useAttrs, type MaybeRefOrGetter } from "vue";

// ** Core Imports
import {
  applyDateSelection,
  cn,
  isDateDisabled,
  isDateInRangePreview,
  isDateSelected,
  mergeBridgeUILayeredClasses,
  resolveCalendarDayInteractionState,
  resolveDatePickerMode,
  resolveStartOfWeek,
  splitComponentProps,
  type DateAdapterContext,
  type DatePickerModel,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  colorProps,
  dayProps,
  roundedProps,
} from "@bridge-ui/core/Tokens/Calendar";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type {
  CalendarDateClasses,
  CalendarDateDayCell,
  CalendarDateEmits,
  CalendarDateOwnProps,
} from "@/Components/CalendarDate/calendarDate.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const calendarDateBridgeKeys = [
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
  "customProps",
  "previewDate",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
] as const satisfies readonly (keyof CalendarDateOwnProps)[];

type CalendarDateLibDefaults = LibDefaultsShape<
  CalendarDateOwnProps,
  "color" | "rounded" | "startOfWeek"
>;

type CalendarDateMerged = MergeLibDefaults<
  CalendarDateOwnProps,
  CalendarDateLibDefaults
>;

export function useCalendarDate(
  props: MaybeRefOrGetter<CalendarDateOwnProps>,
  libDefaults: CalendarDateLibDefaults,
  emit: {
    (event: "viewDateChange", date: Date): void;
    (event: "change", value: DatePickerModel): void;
    (event: "previewDateChange", date: Date | null): void;
  },
) {
  const attrs = useAttrs();
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();

  const split = computed(() => {
    return splitComponentProps<
      CalendarDateOwnProps,
      typeof calendarDateBridgeKeys
    >({
      bridgeKeys: calendarDateBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged } = useBridgeUIComponent<CalendarDateMerged>({
    libDefaults,
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, [
      "onChange",
      "onPreviewDateChange",
      "onViewDateChange",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarDateClasses>({
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

  const isControlled = computed(() => !isNil(propsValue.value.value));

  const isPreviewControlled = computed(
    () => !isNil(propsValue.value.previewDate),
  );

  const isViewDateControlled = computed(
    () => !isNil(propsValue.value.viewDate),
  );

  const uncontrolledValue = ref<DatePickerModel>(
    merged.value.defaultValue ?? null,
  );

  const uncontrolledPreview = ref<Date | null>(null);

  const uncontrolledViewDate = ref<Date>(
    merged.value.viewDate ??
      adapter.value.startOfMonth(
        adapter.value.now(context.value),
        context.value,
      ),
  );

  const value = computed((): DatePickerModel => {
    return isControlled.value
      ? (propsValue.value.value ?? null)
      : uncontrolledValue.value;
  });

  const previewDate = computed(() => {
    return isPreviewControlled.value
      ? propsValue.value.previewDate
      : uncontrolledPreview.value;
  });

  const viewDate = computed(() => {
    return isViewDateControlled.value
      ? (propsValue.value.viewDate as Date)
      : uncontrolledViewDate.value;
  });

  const startOfWeek = computed(() => {
    return resolveStartOfWeek(merged.value.startOfWeek);
  });

  const colorTokens = computed(() => {
    return mergeBridgeUILayeredClasses(colorProps, merged.value.tokens?.color);
  });

  const dayTokens = computed(() => {
    return mergeBridgeUILayeredClasses(dayProps, merged.value.tokens?.day);
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      merged.value.tokens?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const colorClass = computed(() => get(colorTokens.value, merged.value.color));

  const weekdays = computed(() => {
    const names = adapter.value.getWeekdayNames(context.value);
    const start = startOfWeek.value;

    return Array.from({ length: 7 }, (_, index) => {
      return names[(start + index) % 7] ?? "";
    });
  });

  const days = computed((): CalendarDateDayCell[] => {
    const grid = adapter.value.getCalendarDays(
      viewDate.value,
      startOfWeek.value,
      context.value,
    );
    const today = adapter.value.now(context.value);

    return grid.map((date) => {
      const disabled =
        Boolean(merged.value.disabled) ||
        isDateDisabled(date, {
          adapter: adapter.value,
          context: context.value,
          maxDate: merged.value.maxDate,
          minDate: merged.value.minDate,
          disableDates: merged.value.disableDates,
          disableYears: merged.value.disableYears,
          disableMonths: merged.value.disableMonths,
        });

      const selected = isDateSelected({
        date,
        mode: mode.value,
        value: value.value,
        adapter: adapter.value,
        context: context.value,
      });

      const preview =
        mode.value === "range" &&
        isDateInRangePreview({
          date,
          value: value.value,
          adapter: adapter.value,
          context: context.value,
          previewDate: previewDate.value,
        });

      const state = resolveCalendarDayInteractionState({
        preview,
        disabled,
        selected,
        readOnly: merged.value.readOnly,
      });

      return {
        date,
        state,
        preview,
        selected,
        disabled: disabled || Boolean(merged.value.readOnly),
        label: String(adapter.value.getDate(date, context.value)),
        today: adapter.value.isSameDay(date, today, context.value),
        outside: !adapter.value.isSameMonth(
          date,
          viewDate.value,
          context.value,
        ),
      };
    });
  });

  const selectDay = (date: Date) => {
    if (merged.value.disabled || merged.value.readOnly) {
      return;
    }

    if (
      isDateDisabled(date, {
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

    if (!adapter.value.isSameMonth(date, viewDate.value, context.value)) {
      const nextView = adapter.value.startOfMonth(date, context.value);

      if (isNil(merged.value.viewDate)) {
        uncontrolledViewDate.value = nextView;
      }

      emit("viewDateChange", nextView);
    }

    const next = applyDateSelection({
      next: date,
      mode: mode.value,
      value: value.value,
      adapter: adapter.value,
      context: context.value,
    });

    if (!isControlled.value) {
      uncontrolledValue.value = next;
    }

    emit("change", next);

    if (mode.value === "range") {
      setPreview(null);
    }
  };

  const setPreview = (date: Date | null) => {
    if (!isPreviewControlled.value) {
      uncontrolledPreview.value = date;
    }

    emit("previewDateChange", date);
  };

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      rootInheritedAttrs.value,
      cn({
        "flex flex-col gap-2": true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const gridBind = computed(() => {
    return mergePartBind(
      customProps.value?.grid,
      {
        role: "grid",
      },
      cn({
        "grid grid-cols-7 gap-1": true,
        [mergedClasses.value.grid ?? ""]: true,
      }),
    );
  });

  const getWeekdayBind = (_label: string) => {
    return mergePartBind(
      customProps.value?.weekday,
      {},
      cn({
        "flex items-center justify-center py-1": true,
        [dayTokens.value.weekday ?? ""]: true,
        [mergedClasses.value.weekday ?? ""]: true,
      }),
    );
  };

  const getDayBind = (cell: CalendarDateDayCell) => {
    const color = colorClass.value;

    return mergePartBind(
      customProps.value?.day,
      {
        type: "button" as const,
        disabled: cell.disabled,
        "aria-pressed": cell.selected,
        onClick: () => selectDay(cell.date),
        "data-preview": cell.preview ? "" : undefined,
        "aria-current": cell.today ? ("date" as const) : undefined,
        onMouseleave: () => {
          if (mode.value === "range") {
            setPreview(null);
          }
        },
        onMouseenter: () => {
          if (mode.value === "range" && !cell.disabled) {
            setPreview(cell.date);
          }
        },
      },
      cn({
        "flex h-9 w-9 items-center justify-center text-sm transition-colors": true,
        [roundedClass.value ?? ""]: true,
        [color?.base ?? ""]: cell.state === "base" || cell.state === "hover",
        [color?.hover ?? ""]: cell.state === "base" || cell.state === "hover",
        [color?.selected ?? ""]: cell.state === "selected",
        [color?.disabled ?? ""]: cell.state === "disabled",
        [dayTokens.value.outside ?? ""]:
          cell.outside && cell.state !== "selected",
        [dayTokens.value.today ?? ""]:
          cell.today && cell.state !== "selected" && cell.state !== "disabled",
        [mergedClasses.value.day ?? ""]: true,
      }),
    );
  };

  const hideWeekdays = computed(() => Boolean(merged.value.hideWeekdays));

  return {
    days,
    mode,
    value,
    merged,
    context,
    rootBind,
    gridBind,
    weekdays,
    viewDate,
    selectDay,
    getDayBind,
    previewDate,
    hideWeekdays,
    getWeekdayBind,
  };
}

export type UseCalendarDateEmit = CalendarDateEmits;
