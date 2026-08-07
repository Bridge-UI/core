// ** External Imports
import { isArray, isNil, omit } from "es-toolkit/compat";
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
  isDateRangeValue,
  splitComponentProps,
  type DateAdapterContext,
  type DatePickerModel,
  type LibDefaultsShape,
  type MergeLibDefaults,
  type TimeValue,
} from "@bridge-ui/core";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  DateTimePickerClasses,
  DateTimePickerOwnProps,
} from "@/Components/DateTimePicker/dateTimePicker.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const dateTimePickerBridgeKeys = [
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
  "defaultView",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableTimes",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
  "hideOutsideDays",
] as const satisfies readonly (keyof DateTimePickerOwnProps)[];

type DateTimePickerLibDefaults = LibDefaultsShape<
  DateTimePickerOwnProps,
  | "ampm"
  | "color"
  | "rounded"
  | "interval"
  | "showFooter"
  | "defaultView"
  | "startOfWeek"
>;

type DateTimePickerMerged = MergeLibDefaults<
  DateTimePickerOwnProps,
  DateTimePickerLibDefaults
>;

/**
 * Owns controlled/uncontrolled datetime value, optional footer draft, and binds.
 */
export function useDateTimePicker(
  props: MaybeRefOrGetter<DateTimePickerOwnProps>,
  libDefaults: DateTimePickerLibDefaults,
  emit: {
    (event: "change", value: Date | null): void;
    (event: "cancel"): void;
  },
) {
  const attrs = useAttrs();
  const adapter = useDateAdapter();
  const resolveMessage = useResolveMessage();
  const resolveContext = useDateAdapterContext();

  const split = computed(() => {
    return splitComponentProps<
      DateTimePickerOwnProps,
      typeof dateTimePickerBridgeKeys
    >({
      bridgeKeys: dateTimePickerBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged, entry: bridgeDateTimePicker } = useBridgeUIComponent<
    DateTimePickerMerged,
    "DateTimePicker"
  >({
    libDefaults,
    componentName: "DateTimePicker",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["onChange", "onCancel"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<DateTimePickerClasses>(
    {
      entry: bridgeDateTimePicker,
      props: () => split.value.componentProps,
    },
  );

  const propsValue = computed(() => {
    return toValue(props);
  });

  const context = computed((): DateAdapterContext => {
    return resolveContext(merged.value.timeZone);
  });

  const isControlled = computed(() => {
    return !isNil(propsValue.value.value);
  });

  const uncontrolledValue = ref<Date | null>(merged.value.defaultValue ?? null);

  const committedValue = computed((): Date | null => {
    return isControlled.value
      ? (propsValue.value.value ?? null)
      : uncontrolledValue.value;
  });

  const draftValue = ref<Date | null>(committedValue.value);

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

  const commitValue = (next: Date | null) => {
    if (!isControlled.value) {
      uncontrolledValue.value = next;
    }

    emit("change", next);
  };

  const applyCombined = (next: Date | null) => {
    if (merged.value.showFooter) {
      draftValue.value = next;

      return;
    }

    commitValue(next);
  };

  const handleCalendarChange = (next: DatePickerModel) => {
    if (isNil(next) || isArray(next) || isDateRangeValue(next)) {
      applyCombined(null);

      return;
    }

    const combined = combineDateAndTime(
      next,
      displayValue.value ?? adapter.value.now(context.value),
      adapter.value,
      context.value,
    );

    applyCombined(combined);
  };

  const handlePanelChange = (next: null | TimeValue) => {
    if (isNil(next)) {
      applyCombined(null);

      return;
    }

    const combined = combineDateAndTime(
      displayValue.value ?? adapter.value.now(context.value),
      next,
      adapter.value,
      context.value,
    );

    applyCombined(combined);
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
        "flex w-fit flex-col overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-900": true,
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
      "shrink-0": true,
      [mergedClasses.value.calendar ?? ""]: true,
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

  /**
   * Time column shell: stretches to the calendar height without letting
   * TimePanel content contribute to the row's intrinsic height.
   */
  const timePanelBind = computed(() => {
    return cn({
      "relative isolate shrink-0 self-stretch overflow-hidden border-l border-gray-100 dark:border-gray-800": true,
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
      "absolute inset-0 flex px-2.5": true,
    });
  });

  const showFooter = computed(() => {
    return Boolean(merged.value.showFooter);
  });

  return {
    merged,
    rootBind,
    footerBind,
    showFooter,
    timeTokens,
    handleApply,
    contentBind,
    displayValue,
    handleCancel,
    calendarBind,
    timeFillBind,
    timeSizerBind,
    timePanelBind,
    calendarTokens,
    handlePanelChange,
    handleCalendarChange,
    timePanelCustomProps,
    applyLabel: computed(() => resolveMessage("Apply")),
    cancelLabel: computed(() => resolveMessage("Cancel")),
    applyButtonProps: computed(() => customProps.value?.applyButton),
    cancelButtonProps: computed(() => customProps.value?.cancelButton),
  };
}
