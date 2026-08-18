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
import type { DatePickerModel } from "@bridge-ui/core/Domain";
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
  DatePickerClasses,
  DatePickerEmits,
  DatePickerOwnProps,
} from "@/Components/DatePicker/datePicker.types";
import { FIELD_OVERLAY_INJECTION_KEY } from "@/Components/FieldOverlay/fieldOverlayInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const datePickerBridgeKeys = [
  "fill",
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
  "hideYears",
  "hideMonths",
  "showFooter",
  "customProps",
  "defaultView",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
  "hideOutsideDays",
] as const satisfies readonly (keyof DatePickerOwnProps)[];

type DatePickerLibDefaults = LibDefaultsShape<
  DatePickerOwnProps,
  "color" | "rounded" | "startOfWeek"
>;

type DatePickerMerged = MergeLibDefaults<
  DatePickerOwnProps,
  DatePickerLibDefaults
>;

export function useDatePicker(
  props: MaybeRefOrGetter<DatePickerOwnProps>,
  libDefaults: DatePickerLibDefaults,
  emit: SetupContext<DatePickerEmits>["emit"],
) {
  const attrs = useAttrs();
  const overlayFooter = inject(FIELD_OVERLAY_INJECTION_KEY, {
    apply: () => undefined,
    cancel: () => undefined,
  });
  const resolveMessage = useResolveMessage();

  const split = computed(() => {
    return splitComponentProps<DatePickerOwnProps, typeof datePickerBridgeKeys>(
      {
        bridgeKeys: datePickerBridgeKeys,
        props: { ...attrs, ...toValue(props) },
      },
    );
  });

  const { merged, entry: bridgeDatePicker } = useBridgeUIComponent<
    DatePickerMerged,
    "DatePicker"
  >({
    libDefaults,
    componentName: "DatePicker",
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

  const mergedClasses = useBridgeUIMergedRegistryClasses<DatePickerClasses>({
    entry: bridgeDatePicker,
    props: () => split.value.componentProps,
  });

  const propsValue = computed(() => {
    return toValue(props);
  });

  const isControlled = computed(() => {
    return !isNil(propsValue.value.value);
  });

  const uncontrolledValue = ref<DatePickerModel>(
    merged.value.defaultValue ?? null,
  );

  const committedValue = computed((): DatePickerModel => {
    return isControlled.value
      ? (propsValue.value.value ?? null)
      : uncontrolledValue.value;
  });

  const draftValue = ref<DatePickerModel>(committedValue.value);

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

  const commitValue = (next: DatePickerModel) => {
    if (!isControlled.value) {
      uncontrolledValue.value = next;
    }

    emit("change", next);
  };

  const handleCalendarChange = (next: DatePickerModel) => {
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
        "flex flex-col overflow-hidden bg-white shadow-lg dark:bg-dark-900": true,
        "w-full": merged.value.fill,
        "w-fit": !merged.value.fill,
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
