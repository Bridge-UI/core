// ** External Imports
import { get, isUndefined, omit } from "es-toolkit/compat";
import {
  computed,
  nextTick,
  onMounted,
  ref,
  toValue,
  useAttrs,
  useId,
  useSlots,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";

// ** Core Imports
import {
  applyOtpInput,
  applyOtpKeyNavigation,
  applyOtpPaste,
  cn,
  isOtpComplete,
  joinOtpDigits,
  mergeBridgeUILayeredClasses,
  normalizeOtpValue,
  resolveOtpLength,
  splitComponentProps,
  splitOtpValue,
  type LibDefaultsShape,
  type MergeLibDefaults,
  type OtpInputType,
} from "@bridge-ui/core";
import {
  colorProps,
  invalidatedProps,
  roundedProps,
  sizeProps,
  variantProps,
} from "@bridge-ui/core/Tokens/OtpField";

// ** Local Imports
import type { LabelProps } from "@/Components/Label/label.types";
import type {
  OtpFieldClasses,
  OtpFieldOwnProps,
  OtpFieldProps,
} from "@/Components/OtpField/otpField.types";
import {
  hasSlotOrProp,
  mergeNestedComponentProps,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export type UseOtpFieldOptions = {
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
};

export const otpFieldBridgeKeys = [
  "mask",
  "size",
  "type",
  "color",
  "error",
  "label",
  "corner",
  "length",
  "classes",
  "rounded",
  "variant",
  "disabled",
  "readonly",
  "required",
  "autoFocus",
  "controlId",
  "customProps",
  "description",
  "placeholder",
  "defaultValue",
  "errorMessage",
  "hideErrorMessage",
] as const satisfies readonly (keyof OtpFieldOwnProps)[];

type OtpFieldLibDefaults = LibDefaultsShape<
  OtpFieldOwnProps,
  "size" | "type" | "color" | "length" | "rounded" | "variant"
>;

type OtpFieldMerged = MergeLibDefaults<OtpFieldOwnProps, OtpFieldLibDefaults>;

/**
 * Composes OTP pin state, field chrome binds, and per-pin input handlers.
 */
export function useOtpField(
  props: MaybeRefOrGetter<OtpFieldOwnProps>,
  model: Ref<null | string | undefined>,
  options: UseOtpFieldOptions = {},
  libDefaults: OtpFieldLibDefaults = {
    length: 6,
    size: "md",
    rounded: "md",
    type: "numeric",
    color: "primary",
    variant: "outline",
  },
) {
  const attrs = useAttrs();
  const slots = useSlots();
  const autoId = useId();
  const pinRefs = ref<Array<null | HTMLInputElement>>([]);

  const split = computed(() => {
    return splitComponentProps<OtpFieldProps, typeof otpFieldBridgeKeys>({
      bridgeKeys: otpFieldBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged, entry: bridgeOtpField } = useBridgeUIComponent<
    OtpFieldMerged,
    "OtpField"
  >({
    libDefaults,
    componentName: "OtpField",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<OtpFieldClasses>({
    entry: bridgeOtpField,
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => merged.value.customProps);

  const length = computed(() => resolveOtpLength(merged.value.length));

  const inputType = computed(
    (): OtpInputType => merged.value.type ?? "numeric",
  );

  const invalidated = computed(() => merged.value.error === true);

  const isDisabled = computed(() => Boolean(merged.value.disabled));

  const isReadonly = computed(() => Boolean(merged.value.readonly));

  const variantKey = computed(() => merged.value.variant ?? "outline");

  const isUnderlined = computed(() => variantKey.value === "underlined");

  const controlId = computed(
    () =>
      merged.value.controlId ??
      (split.value.inheritedAttrs.id as string | undefined) ??
      autoId,
  );

  const isControlled = computed(() => !isUndefined(model.value));

  const uncontrolledValue = ref(
    normalizeOtpValue(
      toValue(props).defaultValue,
      length.value,
      inputType.value,
    ),
  );

  const value = computed(() => {
    if (isControlled.value) {
      return normalizeOtpValue(model.value, length.value, inputType.value);
    }

    return uncontrolledValue.value;
  });

  const digits = computed(() => splitOtpValue(value.value, length.value));

  onMounted(() => {
    if (!merged.value.autoFocus || isDisabled.value || isReadonly.value) {
      return;
    }

    const emptyIndex = digits.value.findIndex((digit) => digit === "");
    const focusIndex = emptyIndex === -1 ? 0 : emptyIndex;
    pinRefs.value[focusIndex]?.focus();
  });

  const commitValue = (nextDigits: string[], focusIndex: null | number) => {
    const nextValue = joinOtpDigits(nextDigits);

    if (!isControlled.value) {
      uncontrolledValue.value = nextValue;
    }

    model.value = nextValue;
    options.onChange?.(nextValue);

    if (isOtpComplete(nextValue, length.value)) {
      options.onComplete?.(nextValue);
    }

    if (focusIndex != null) {
      void nextTick(() => {
        pinRefs.value[focusIndex]?.focus();
        pinRefs.value[focusIndex]?.select();
      });
    }
  };

  const sizeClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeOtpField.value?.tokens?.size,
    );

    return get(classes, merged.value.size ?? "md");
  });

  const colorPalette = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeOtpField.value?.tokens?.color,
    );

    return get(classes, merged.value.color ?? "primary");
  });

  const invalidatedPalette = computed(() => {
    return mergeBridgeUILayeredClasses(
      invalidatedProps,
      bridgeOtpField.value?.tokens?.invalidated,
      merged.value.customProps?.invalidated,
    );
  });

  const invalidatedColors = computed(() => {
    return invalidated.value ? invalidatedPalette.value : undefined;
  });

  const roundedClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeOtpField.value?.tokens?.rounded,
    );

    return get(classes, merged.value.rounded ?? "md");
  });

  const variantClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeOtpField.value?.tokens?.variant,
    );

    return get(classes, variantKey.value);
  });

  const reservesErrorMessageSpace = computed(
    () => !merged.value.hideErrorMessage,
  );

  const showErrorMessageContent = computed(() => {
    return (
      invalidated.value &&
      hasSlotOrProp(slots, "errorMessage", merged.value.errorMessage)
    );
  });

  const ariaDescribedBy = computed(() => {
    const ids: string[] = [];

    if (
      !invalidated.value &&
      hasSlotOrProp(slots, "description", merged.value.description)
    ) {
      ids.push(`${controlId.value}-description`);
    }

    if (
      invalidated.value &&
      !merged.value.hideErrorMessage &&
      hasSlotOrProp(slots, "errorMessage", merged.value.errorMessage)
    ) {
      ids.push(`${controlId.value}-error`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      {
        class: cn(split.value.inheritedAttrs.class as string | undefined),
        ...omit(split.value.inheritedAttrs, ["class", "id"]),
      },
      cn({
        "group w-full relative": true,
        "aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60": true,
        "aria-readonly:pointer-events-none aria-readonly:select-none": true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const headerBind = computed(() => {
    return mergePartBind(
      customProps.value?.header,
      {},
      cn({
        "flex w-full gap-x-2 mb-1.5": true,
        "justify-between items-end": hasSlotOrProp(
          slots,
          "label",
          merged.value.label,
        ),
        "justify-end": !hasSlotOrProp(slots, "label", merged.value.label),
        [mergedClasses.value.header ?? ""]: true,
      }),
    );
  });

  const cornerBind = computed(() => {
    return mergePartBind(
      customProps.value?.corner,
      {},
      cn({
        "text-gray-500 dark:text-gray-400": true,
        [sizeClasses.value?.text ?? ""]: true,
        [mergedClasses.value.corner ?? ""]: true,
      }),
    );
  });

  const groupBind = computed(() => {
    return mergePartBind(
      customProps.value?.group,
      {
        role: "group",
        id: controlId.value,
        "aria-describedby": ariaDescribedBy.value,
        "aria-disabled": isDisabled.value || undefined,
        "aria-invalid": invalidated.value || undefined,
      },
      cn({
        "flex flex-wrap items-center": true,
        [sizeClasses.value?.group ?? ""]: true,
        [mergedClasses.value.group ?? ""]: true,
      }),
    );
  });

  const startSlotBind = computed(() => {
    return mergePartBind(
      customProps.value?.start,
      {},
      cn({
        "group/start wrapper-start-slot shrink-0 flex items-center [&>*]:min-h-0": true,
        [mergedClasses.value.start ?? ""]: true,
      }),
    );
  });

  const endSlotBind = computed(() => {
    return mergePartBind(
      customProps.value?.end,
      {},
      cn({
        "group/end wrapper-end-slot shrink-0 flex items-center [&>*]:min-h-0": true,
        [mergedClasses.value.end ?? ""]: true,
      }),
    );
  });

  const descriptionBind = computed(() => {
    return mergePartBind(
      customProps.value?.description,
      {},
      cn({
        "mt-2 text-gray-500 dark:text-gray-400": true,
        [sizeClasses.value?.text ?? ""]: true,
        [mergedClasses.value.description ?? ""]: true,
      }),
    );
  });

  const errorBind = computed(() => {
    return mergePartBind(
      customProps.value?.errorMessage,
      {},
      cn({
        "mt-2": true,
        "min-h-[1lh]": reservesErrorMessageSpace.value,
        [invalidatedColors.value?.errorMessage ?? ""]: true,
        [sizeClasses.value?.text ?? ""]: true,
        [mergedClasses.value.errorMessage ?? ""]: true,
      }),
    );
  });

  const fieldLabelProps = computed((): LabelProps => {
    return mergeNestedComponentProps(customProps.value?.label, {
      size: merged.value.size,
      error: invalidated.value,
      for: `${controlId.value}-0`,
      required: merged.value.required,
      classes: {
        required: mergedClasses.value.required,
        root: cn({
          [mergedClasses.value.label ?? ""]: true,
        }),
      },
    });
  });

  const pinBind = (_index: number) => {
    return mergePartBind(
      customProps.value?.pin,
      {},
      cn({
        "relative flex shrink-0 items-center justify-center overflow-hidden": true,
        [sizeClasses.value?.pin ?? ""]: true,
        [variantClasses.value?.pin ?? ""]: true,
        [roundedClasses.value?.pin ?? ""]: !isUnderlined.value,
        [colorPalette.value?.pin ?? ""]:
          !invalidated.value && !isUnderlined.value,
        [colorPalette.value?.underlined ?? ""]:
          !invalidated.value && isUnderlined.value,
        [invalidatedColors.value?.pin ?? ""]:
          invalidated.value && !isUnderlined.value,
        [invalidatedColors.value?.pinUnderlined ?? ""]:
          invalidated.value && isUnderlined.value,
        [mergedClasses.value.pin ?? ""]: true,
      }),
    );
  };

  const inputBind = (index: number) => {
    const inputMode = (inputType.value === "numeric" ? "numeric" : "text") as
      | "text"
      | "numeric";

    return mergePartBind(
      {
        ...customProps.value?.input,
        inputmode: inputMode,
        maxlength: length.value,
        disabled: isDisabled.value,
        readOnly: isReadonly.value,
        value: digits.value[index] ?? "",
        id: `${controlId.value}-${index}`,
        placeholder: merged.value.placeholder,
        "aria-describedby": ariaDescribedBy.value,
        type: merged.value.mask ? "password" : "text",
        "aria-invalid": invalidated.value || undefined,
        autocomplete: index === 0 ? "one-time-code" : "off",
        "aria-label": `Digit ${index + 1} of ${length.value}`,
      },
      {},
      cn({
        "h-full w-full min-w-0 bg-transparent border-0 shadow-none text-center": true,
        "text-gray-900 dark:text-gray-100 placeholder:text-gray-400": true,
        "outline-none ring-0 focus:outline-none focus:ring-0": true,
        "disabled:cursor-not-allowed": true,
        [sizeClasses.value?.input ?? ""]: true,
        [mergedClasses.value.input ?? ""]: true,
      }),
    );
  };

  const setPinRef = (index: number, element: null | HTMLInputElement) => {
    pinRefs.value[index] = element;
  };

  const handlePinInput = (index: number, event: Event) => {
    const input = (event.target as HTMLInputElement).value;
    const update = applyOtpInput({
      index,
      input,
      digits: digits.value,
      type: inputType.value,
    });
    commitValue(update.digits, update.focusIndex);
  };

  const handlePinKeyDown = (index: number, event: KeyboardEvent) => {
    const update = applyOtpKeyNavigation({
      index,
      key: event.key,
      digits: digits.value,
    });

    if (!update) {
      return;
    }

    event.preventDefault();
    commitValue(update.digits, update.focusIndex);
  };

  const handlePinPaste = (index: number, event: ClipboardEvent) => {
    const pasted = event.clipboardData?.getData("text") ?? "";
    const update = applyOtpPaste({
      index,
      pasted,
      digits: digits.value,
      type: inputType.value,
    });

    if (
      update.focusIndex == null &&
      update.digits.every((digit, i) => digit === digits.value[i])
    ) {
      return;
    }

    event.preventDefault();
    commitValue(update.digits, update.focusIndex);
  };

  const handlePinFocus = (index: number) => {
    pinRefs.value[index]?.select();
  };

  return {
    slots,
    merged,
    digits,
    length,
    pinBind,
    rootBind,
    errorBind,
    groupBind,
    inputBind,
    setPinRef,
    controlId,
    inputType,
    headerBind,
    cornerBind,
    isDisabled,
    isReadonly,
    endSlotBind,
    invalidated,
    startSlotBind,
    mergedClasses,
    handlePinInput,
    handlePinFocus,
    handlePinPaste,
    fieldLabelProps,
    descriptionBind,
    handlePinKeyDown,
    showErrorMessageContent,
  };
}

export type UseOtpFieldReturn = ReturnType<typeof useOtpField>;
