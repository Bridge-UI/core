// ** External Imports
import { isNil, omit } from "es-toolkit/compat";
import {
  computed,
  ref,
  toValue,
  useAttrs,
  watch,
  type MaybeRefOrGetter,
} from "vue";

// ** Core Imports
import {
  cn,
  combineDateAndTime,
  splitComponentProps,
  type DateAdapter,
  type DateAdapterContext,
  type DateRangeValue,
  type LibDefaultsShape,
  type MergeLibDefaults,
  type TimeValue,
} from "@bridge-ui/core";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  DateTimeRangePickerClasses,
  DateTimeRangePickerOwnProps,
} from "@/Components/DateTimeRangePicker/dateTimeRangePicker.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const dateTimeRangePickerBridgeKeys = [
  "ampm",
  "color",
  "value",
  "tokens",
  "classes",
  "maxDate",
  "maxTime",
  "minDate",
  "minTime",
  "rounded",
  "disabled",
  "interval",
  "readOnly",
  "timeZone",
  "hideYears",
  "hideMonths",
  "showFooter",
  "customProps",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableTimes",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
] as const satisfies readonly (keyof DateTimeRangePickerOwnProps)[];

type DateTimeRangePickerLibDefaults = LibDefaultsShape<
  DateTimeRangePickerOwnProps,
  "ampm" | "color" | "rounded" | "interval" | "showFooter" | "startOfWeek"
>;

type DateTimeRangePickerMerged = MergeLibDefaults<
  DateTimeRangePickerOwnProps,
  DateTimeRangePickerLibDefaults
>;

/**
 * Sorts a datetime range so the earlier instant comes first.
 */
function sortDateTimeRangeValue(
  value: DateRangeValue,
  adapter: DateAdapter,
  context?: DateAdapterContext,
): DateRangeValue {
  const [start, end] = value;

  if (adapter.isAfter(start, end, context)) {
    return [end, start];
  }

  return value;
}

/**
 * Owns controlled/uncontrolled datetime range value, optional footer draft, and binds.
 */
export function useDateTimeRangePicker(
  props: MaybeRefOrGetter<DateTimeRangePickerOwnProps>,
  libDefaults: DateTimeRangePickerLibDefaults,
  emit: {
    (event: "change", value: null | DateRangeValue): void;
    (event: "cancel"): void;
  },
) {
  const attrs = useAttrs();
  const adapter = useDateAdapter();
  const resolveMessage = useResolveMessage();
  const resolveContext = useDateAdapterContext();

  const split = computed(() => {
    return splitComponentProps<
      DateTimeRangePickerOwnProps,
      typeof dateTimeRangePickerBridgeKeys
    >({
      props: { ...attrs, ...toValue(props) },
      bridgeKeys: dateTimeRangePickerBridgeKeys,
    });
  });

  const { merged, entry: bridgeDateTimeRangePicker } = useBridgeUIComponent<
    DateTimeRangePickerMerged,
    "DateTimeRangePicker"
  >({
    libDefaults,
    componentName: "DateTimeRangePicker",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["onChange", "onCancel"]);
  });

  const mergedClasses =
    useBridgeUIMergedRegistryClasses<DateTimeRangePickerClasses>({
      entry: bridgeDateTimeRangePicker,
      props: () => split.value.componentProps,
    });

  const propsValue = computed(() => {
    return toValue(props);
  });

  const context = computed((): DateAdapterContext => {
    return resolveContext(merged.value.timeZone);
  });

  const isControlled = computed(() => {
    return !isNil(propsValue.value.value);
  });

  const uncontrolledValue = ref<null | DateRangeValue>(
    merged.value.defaultValue ?? null,
  );

  const committedValue = computed((): null | DateRangeValue => {
    return isControlled.value
      ? (propsValue.value.value ?? null)
      : uncontrolledValue.value;
  });

  const draftValue = ref<null | DateRangeValue>(committedValue.value);

  watch(
    () => [committedValue.value, merged.value.showFooter] as const,
    ([committed, showFooter]) => {
      if (showFooter) {
        draftValue.value = committed;
      }
    },
  );

  const displayValue = computed(() => {
    return merged.value.showFooter ? draftValue.value : committedValue.value;
  });

  const calendarTokens = computed(() => {
    return {
      day: merged.value.tokens?.calendar?.day ?? merged.value.tokens?.day,
      color: merged.value.tokens?.calendar?.color ?? merged.value.tokens?.color,
      rounded:
        merged.value.tokens?.calendar?.rounded ?? merged.value.tokens?.rounded,
    };
  });

  const timeTokens = computed(() => {
    return {
      color: merged.value.tokens?.time?.color ?? merged.value.tokens?.color,
      rounded:
        merged.value.tokens?.time?.rounded ?? merged.value.tokens?.rounded,
    };
  });

  const startTimeValue = computed(() => {
    return displayValue.value?.[0] ?? null;
  });

  const endTimeValue = computed(() => {
    return displayValue.value?.[1] ?? null;
  });

  const commitValue = (next: null | DateRangeValue) => {
    if (!isControlled.value) {
      uncontrolledValue.value = next;
    }

    emit("change", next);
  };

  const applyNext = (next: null | DateRangeValue) => {
    if (merged.value.showFooter) {
      draftValue.value = next;

      return;
    }

    commitValue(next);
  };

  const handleCalendarChange = (next: null | DateRangeValue) => {
    if (isNil(next)) {
      applyNext(null);

      return;
    }

    const now = adapter.value.now(context.value);
    const start = combineDateAndTime(
      next[0],
      displayValue.value?.[0] ?? now,
      adapter.value,
      context.value,
    );
    const end = combineDateAndTime(
      next[1],
      displayValue.value?.[1] ?? now,
      adapter.value,
      context.value,
    );

    applyNext(
      sortDateTimeRangeValue([start, end], adapter.value, context.value),
    );
  };

  const handleStartPanelChange = (next: null | TimeValue) => {
    if (isNil(next)) {
      applyNext(null);

      return;
    }

    const now = adapter.value.now(context.value);
    const start = combineDateAndTime(
      displayValue.value?.[0] ?? now,
      next,
      adapter.value,
      context.value,
    );
    const end = displayValue.value?.[1] ?? now;

    applyNext(
      sortDateTimeRangeValue([start, end], adapter.value, context.value),
    );
  };

  const handleEndPanelChange = (next: null | TimeValue) => {
    if (isNil(next)) {
      applyNext(null);

      return;
    }

    const now = adapter.value.now(context.value);
    const start = displayValue.value?.[0] ?? now;
    const end = combineDateAndTime(
      displayValue.value?.[1] ?? now,
      next,
      adapter.value,
      context.value,
    );

    applyNext(
      sortDateTimeRangeValue([start, end], adapter.value, context.value),
    );
  };

  const handleApply = () => {
    commitValue(draftValue.value);
  };

  const handleCancel = () => {
    draftValue.value = committedValue.value;
    emit("cancel");
  };

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      rootInheritedAttrs.value,
      cn({
        "flex flex-col overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-900": true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const contentBind = computed(() => {
    return cn({
      "flex flex-row items-stretch": true,
    });
  });

  const calendarBind = computed(() => {
    return cn({
      "min-w-0 shrink": true,
      [mergedClasses.value.calendar ?? ""]: true,
    });
  });

  const timeBind = computed(() => {
    return cn({
      "flex flex-row border-l border-gray-100 dark:border-gray-800": true,
      [mergedClasses.value.time ?? ""]: true,
    });
  });

  const footerBind = computed(() => {
    return mergePartBind(
      customProps.value?.footer,
      {},
      cn({
        "flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-950/40": true,
        [mergedClasses.value.footer ?? ""]: true,
      }),
    );
  });

  const showFooter = computed(() => {
    return Boolean(merged.value.showFooter);
  });

  return {
    merged,
    rootBind,
    timeBind,
    footerBind,
    showFooter,
    timeTokens,
    handleApply,
    contentBind,
    displayValue,
    handleCancel,
    calendarBind,
    endTimeValue,
    calendarTokens,
    startTimeValue,
    handleCalendarChange,
    handleEndPanelChange,
    handleStartPanelChange,
    applyLabel: computed(() => resolveMessage("Apply")),
    cancelLabel: computed(() => resolveMessage("Cancel")),
    applyButtonProps: computed(() => customProps.value?.applyButton),
    cancelButtonProps: computed(() => customProps.value?.cancelButton),
  };
}
