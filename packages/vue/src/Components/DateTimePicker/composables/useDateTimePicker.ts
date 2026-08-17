// ** External Imports
import { get, isArray, isNil, omit } from "es-toolkit/compat";
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
import type { DateAdapterContext } from "@bridge-ui/core/Adapters";
import {
  combineDateAndTime,
  isDateRangeValue,
  type DatePickerModel,
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
  DateTimePickerClasses,
  DateTimePickerEmits,
  DateTimePickerOwnProps,
} from "@/Components/DateTimePicker/dateTimePicker.types";
import { FIELD_OVERLAY_INJECTION_KEY } from "@/Components/FieldOverlay/fieldOverlayInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const dateTimePickerBridgeKeys = [
  "ampm",
  "fill",
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
  "invalidated",
  "showSeconds",
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
  | "defaultView"
  | "showSeconds"
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
  emit: SetupContext<DateTimePickerEmits>["emit"],
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
    return omit(split.value.inheritedAttrs, [
      "onApply",
      "onCancel",
      "onChange",
    ]);
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
        "flex flex-col overflow-hidden bg-white shadow-lg dark:bg-dark-900": true,
        "w-full": merged.value.fill,
        "w-fit": !merged.value.fill,
        [shellRounded]: true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const contentBind = computed(() => {
    return cn({
      "flex w-full flex-row items-stretch": true,
    });
  });

  const calendarBind = computed(() => {
    return cn({
      "min-w-0 flex-1": true,
      [mergedClasses.value.calendar ?? ""]: true,
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

  /**
   * Time column shell: stretches to the calendar height without letting
   * TimePanel content contribute to the row's intrinsic height.
   */
  const timePanelBind = computed(() => {
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
