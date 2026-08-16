// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import {
  computed,
  inject,
  ref,
  toValue,
  useAttrs,
  watch,
  type MaybeRefOrGetter,
  type SetupContext,
} from "vue";

// ** Core Imports
import type { DateAdapter, DateAdapterContext } from "@bridge-ui/core/Adapters";
import {
  combineDateAndTime,
  type DateRangeValue,
  type TimeValue,
} from "@bridge-ui/core/Domain";
import { menuRoundedProps as shellRoundedProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  DateTimeRangePickerClasses,
  DateTimeRangePickerEmits,
  DateTimeRangePickerOwnProps,
} from "@/Components/DateTimeRangePicker/dateTimeRangePicker.types";
import { FIELD_OVERLAY_INJECTION_KEY } from "@/Components/FieldOverlay/fieldOverlayInjectionKey";
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
  "orientation",
  "showSeconds",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableTimes",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
  "hideOutsideDays",
] as const satisfies readonly (keyof DateTimeRangePickerOwnProps)[];

type DateTimeRangePickerLibDefaults = LibDefaultsShape<
  DateTimeRangePickerOwnProps,
  | "ampm"
  | "color"
  | "rounded"
  | "interval"
  | "orientation"
  | "showSeconds"
  | "startOfWeek"
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
  emit: SetupContext<DateTimeRangePickerEmits>["emit"],
) {
  const attrs = useAttrs();
  const overlayFooter = inject(FIELD_OVERLAY_INJECTION_KEY, {
    apply: () => undefined,
    cancel: () => undefined,
  });
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
    return omit(split.value.inheritedAttrs, [
      "onApply",
      "onCancel",
      "onChange",
    ]);
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
    emit("apply");
    overlayFooter.apply();
  };

  const handleCancel = () => {
    draftValue.value = committedValue.value;
    emit("cancel");
    overlayFooter.cancel();
  };

  const rootBind = computed(() => {
    const shellRounded = get(shellRoundedProps, merged.value.rounded ?? "md");

    return mergePartBind(
      customProps.value?.root,
      rootInheritedAttrs.value,
      cn({
        "flex w-fit flex-col overflow-hidden bg-white shadow-lg dark:bg-dark-900": true,
        [shellRounded]: true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const contentBind = computed(() => {
    return cn({
      "flex min-w-0 flex-col": true,
    });
  });

  const calendarBind = computed(() => {
    return cn({
      "min-w-0": true,
      [mergedClasses.value.calendar ?? ""]: true,
    });
  });

  const timeBind = computed(() => {
    return cn({
      "relative isolate shrink-0 self-stretch overflow-hidden border-l border-dark-100 dark:border-dark-800": true,
      [mergedClasses.value.time ?? ""]: true,
    });
  });

  const timePanelCustomProps = computed(() => {
    return {
      root: { class: "h-full max-h-full overflow-hidden" },
    };
  });

  /** Invisible in-flow sizer so the shell keeps TimePanel's content width. */
  const timeSizerBind = computed(() => {
    return cn({
      "invisible flex h-px w-fit gap-2 overflow-hidden px-2.5": true,
    });
  });

  /** Absolutely fills the stretched shell; hosts the real TimePanel. */
  const timeFillBind = computed(() => {
    return cn({
      "absolute inset-0 flex w-full px-2.5": true,
    });
  });

  const footerBind = computed(() => {
    return mergePartBind(
      customProps.value?.footer,
      {},
      cn({
        "flex items-center justify-end gap-2 border-t border-dark-100 bg-dark-50 px-3 py-2 dark:border-dark-800 dark:bg-dark-950/40": true,
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
    timeFillBind,
    endTimeValue,
    timeSizerBind,
    calendarTokens,
    startTimeValue,
    handleCalendarChange,
    handleEndPanelChange,
    timePanelCustomProps,
    handleStartPanelChange,
    applyLabel: computed(() => {
      return resolveMessage("Apply");
    }),
    cancelLabel: computed(() => {
      return resolveMessage("Cancel");
    }),
    applyButtonProps: computed(() => {
      return customProps.value?.applyButton;
    }),
    cancelButtonProps: computed(() => {
      return customProps.value?.cancelButton;
    }),
  };
}
