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
import type { TimeValue } from "@bridge-ui/core/Domain";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  TimePickerClasses,
  TimePickerOwnProps,
} from "@/Components/TimePicker/timePicker.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const timePickerBridgeKeys = [
  "ampm",
  "color",
  "value",
  "tokens",
  "classes",
  "maxTime",
  "minTime",
  "rounded",
  "disabled",
  "interval",
  "readOnly",
  "timeZone",
  "showFooter",
  "customProps",
  "showSeconds",
  "defaultValue",
  "disableTimes",
] as const satisfies readonly (keyof TimePickerOwnProps)[];

type TimePickerLibDefaults = LibDefaultsShape<
  TimePickerOwnProps,
  "ampm" | "color" | "rounded" | "interval" | "showFooter" | "showSeconds"
>;

type TimePickerMerged = MergeLibDefaults<
  TimePickerOwnProps,
  TimePickerLibDefaults
>;

/**
 * Owns controlled/uncontrolled value, optional footer draft, and panel binds.
 */
export function useTimePicker(
  props: MaybeRefOrGetter<TimePickerOwnProps>,
  libDefaults: TimePickerLibDefaults,
  emit: {
    (event: "change", value: null | TimeValue): void;
    (event: "cancel"): void;
  },
) {
  const attrs = useAttrs();
  const resolveMessage = useResolveMessage();

  const split = computed(() => {
    return splitComponentProps<TimePickerOwnProps, typeof timePickerBridgeKeys>(
      {
        bridgeKeys: timePickerBridgeKeys,
        props: { ...attrs, ...toValue(props) },
      },
    );
  });

  const { merged, entry: bridgeTimePicker } = useBridgeUIComponent<
    TimePickerMerged,
    "TimePicker"
  >({
    libDefaults,
    componentName: "TimePicker",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["onChange", "onCancel"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TimePickerClasses>({
    entry: bridgeTimePicker,
    props: () => split.value.componentProps,
  });

  const propsValue = computed(() => {
    return toValue(props);
  });

  const isControlled = computed(() => {
    return !isNil(propsValue.value.value);
  });

  const uncontrolledValue = ref<null | TimeValue>(
    merged.value.defaultValue ?? null,
  );

  const committedValue = computed((): null | TimeValue => {
    return isControlled.value
      ? (propsValue.value.value ?? null)
      : uncontrolledValue.value;
  });

  const draftValue = ref<null | TimeValue>(committedValue.value);

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

  const timeTokens = computed(() => {
    return {
      color: merged.value.tokens?.time?.color ?? merged.value.tokens?.color,
      rounded:
        merged.value.tokens?.time?.rounded ?? merged.value.tokens?.rounded,
    };
  });

  const commitValue = (next: null | TimeValue) => {
    if (!isControlled.value) {
      uncontrolledValue.value = next;
    }

    emit("change", next);
  };

  const handlePanelChange = (next: null | TimeValue) => {
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
        "flex w-fit flex-col overflow-hidden rounded-lg bg-white shadow-lg dark:bg-dark-900": true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const contentBind = computed(() => {
    return cn({
      "px-2.5": true,
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
    footerBind,
    showFooter,
    timeTokens,
    contentBind,
    handleApply,
    displayValue,
    handleCancel,
    handlePanelChange,
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
