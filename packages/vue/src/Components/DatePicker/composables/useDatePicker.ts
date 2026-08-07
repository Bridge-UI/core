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
  splitComponentProps,
  type DatePickerModel,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  DatePickerClasses,
  DatePickerOwnProps,
} from "@/Components/DatePicker/datePicker.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const datePickerBridgeKeys = [
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
  "color" | "rounded" | "showFooter" | "startOfWeek"
>;

type DatePickerMerged = MergeLibDefaults<
  DatePickerOwnProps,
  DatePickerLibDefaults
>;

export function useDatePicker(
  props: MaybeRefOrGetter<DatePickerOwnProps>,
  libDefaults: DatePickerLibDefaults,
  emit: {
    (event: "change", value: DatePickerModel): void;
    (event: "cancel"): void;
  },
) {
  const attrs = useAttrs();
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
    return omit(split.value.inheritedAttrs, ["onChange", "onCancel"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<DatePickerClasses>({
    entry: bridgeDatePicker,
    props: () => split.value.componentProps,
  });

  const propsValue = computed(() => {
    return toValue(props);
  });

  const isControlled = computed(() => !isNil(propsValue.value.value));

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

  const calendarTokens = computed(() => {
    return {
      day: merged.value.tokens?.calendar?.day ?? merged.value.tokens?.day,
      color: merged.value.tokens?.calendar?.color ?? merged.value.tokens?.color,
      rounded:
        merged.value.tokens?.calendar?.rounded ?? merged.value.tokens?.rounded,
    };
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

  const showFooter = computed(() => Boolean(merged.value.showFooter));

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
    applyLabel: computed(() => resolveMessage("Apply")),
    cancelLabel: computed(() => resolveMessage("Cancel")),
    applyButtonProps: computed(() => customProps.value?.applyButton),
    cancelButtonProps: computed(() => customProps.value?.cancelButton),
  };
}
