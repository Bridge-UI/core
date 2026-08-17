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
import type { DateRangeValue } from "@bridge-ui/core/Domain";
import { menuRoundedProps as shellRoundedProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  DateRangePickerClasses,
  DateRangePickerEmits,
  DateRangePickerOwnProps,
} from "@/Components/DateRangePicker/dateRangePicker.types";
import { FIELD_OVERLAY_INJECTION_KEY } from "@/Components/FieldOverlay/fieldOverlayInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const dateRangePickerBridgeKeys = [
  "color",
  "error",
  "value",
  "tokens",
  "classes",
  "maxDate",
  "minDate",
  "rounded",
  "disabled",
  "readOnly",
  "timeZone",
  "hideYears",
  "hideMonths",
  "showFooter",
  "customProps",
  "orientation",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
  "hideOutsideDays",
] as const satisfies readonly (keyof DateRangePickerOwnProps)[];

type DateRangePickerLibDefaults = LibDefaultsShape<
  DateRangePickerOwnProps,
  "color" | "rounded" | "orientation" | "startOfWeek"
>;

type DateRangePickerMerged = MergeLibDefaults<
  DateRangePickerOwnProps,
  DateRangePickerLibDefaults
>;

export function useDateRangePicker(
  props: MaybeRefOrGetter<DateRangePickerOwnProps>,
  libDefaults: DateRangePickerLibDefaults,
  emit: SetupContext<DateRangePickerEmits>["emit"],
) {
  const attrs = useAttrs();
  const overlayFooter = inject(FIELD_OVERLAY_INJECTION_KEY, {
    apply: () => undefined,
    cancel: () => undefined,
  });
  const resolveMessage = useResolveMessage();

  const split = computed(() => {
    return splitComponentProps<
      DateRangePickerOwnProps,
      typeof dateRangePickerBridgeKeys
    >({
      bridgeKeys: dateRangePickerBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged, entry: bridgeDateRangePicker } = useBridgeUIComponent<
    DateRangePickerMerged,
    "DateRangePicker"
  >({
    libDefaults,
    componentName: "DateRangePicker",
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
    useBridgeUIMergedRegistryClasses<DateRangePickerClasses>({
      entry: bridgeDateRangePicker,
      props: () => split.value.componentProps,
    });

  const propsValue = computed(() => {
    return toValue(props);
  });

  const isControlled = computed(() => {
    return !isNil(propsValue.value.value);
  });

  const uncontrolledValue = ref<null | DateRangeValue>(
    merged.value.defaultValue ?? null,
  );

  const committedValue = computed((): null | DateRangeValue => {
    if (isControlled.value) {
      return propsValue.value.value ?? null;
    }

    return uncontrolledValue.value;
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
    if (merged.value.showFooter) {
      return draftValue.value;
    }

    return committedValue.value;
  });

  const calendarTokens = computed(() => {
    return {
      day: merged.value.tokens?.calendar?.day ?? merged.value.tokens?.day,
      color: merged.value.tokens?.calendar?.color ?? merged.value.tokens?.color,
      rounded:
        merged.value.tokens?.calendar?.rounded ?? merged.value.tokens?.rounded,
    };
  });

  const commitValue = (next: null | DateRangeValue) => {
    if (!isControlled.value) {
      uncontrolledValue.value = next;
    }

    emit("change", next);
  };

  const handleCalendarChange = (next: null | DateRangeValue) => {
    if (merged.value.showFooter) {
      draftValue.value = next;

      return;
    }

    commitValue(next);
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
    footerBind,
    showFooter,
    handleApply,
    displayValue,
    handleCancel,
    calendarTokens,
    handleCalendarChange,
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
