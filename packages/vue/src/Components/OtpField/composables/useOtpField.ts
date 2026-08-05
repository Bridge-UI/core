// ** External Imports
import { get, isUndefined, omit, pick } from "es-toolkit/compat";
import {
  computed,
  nextTick,
  onMounted,
  ref,
  toValue,
  useAttrs,
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
import {
  baseFieldBridgeKeys,
  useBaseField,
} from "@/Components/BaseField/composables/useBaseField";
import type {
  OtpFieldClasses,
  OtpFieldOwnProps,
  OtpFieldProps,
} from "@/Components/OtpField/otpField.types";
import {
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
  "type",
  "color",
  "length",
  "rounded",
  "variant",
  "autoFocus",
  "placeholder",
  "defaultValue",
  ...baseFieldBridgeKeys,
] as const satisfies readonly (keyof OtpFieldOwnProps)[];

type OtpFieldLibDefaults = LibDefaultsShape<
  OtpFieldOwnProps,
  "size" | "type" | "color" | "length" | "rounded" | "variant"
>;

type OtpFieldMerged = MergeLibDefaults<OtpFieldOwnProps, OtpFieldLibDefaults>;

function resolveBaseFieldCustomProps(
  customProps: OtpFieldOwnProps["customProps"],
) {
  if (!customProps) {
    return undefined;
  }

  const { pin: _pin, invalidated, input: _input, ...chrome } = customProps;

  return {
    ...chrome,
    ...(invalidated?.errorMessage
      ? { invalidated: { errorMessage: invalidated.errorMessage } }
      : {}),
  };
}

/**
 * Composes OTP pin state, field chrome via {@link useBaseField}, and per-pin input handlers.
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
    props: () => {
      return split.value.componentProps;
    },
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<OtpFieldClasses>({
    entry: bridgeOtpField,
    props: () => {
      return split.value.componentProps;
    },
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const baseFieldCustomProps = computed(() => {
    return resolveBaseFieldCustomProps(merged.value.customProps);
  });

  const baseFieldProps = computed(() => {
    return {
      ...pick(split.value.componentProps, baseFieldBridgeKeys),
      customProps: baseFieldCustomProps.value,
      id: split.value.inheritedAttrs.id as string | undefined,
      class: split.value.inheritedAttrs.class as string | undefined,
      ...omit(split.value.inheritedAttrs, ["class", "id"]),
    };
  });

  const baseField = useBaseField(
    () => baseFieldProps.value,
    {
      size: "md",
      hideErrorMessage: false,
    },
    {
      componentName: "OtpField",
      labelHtmlFor: (controlId) => {
        return `${controlId}-0`;
      },
    },
  );

  const { controlId, isDisabled, isReadonly, invalidated, ariaDescribedBy } =
    baseField;

  const length = computed(() => {
    return resolveOtpLength(merged.value.length);
  });

  const inputType = computed((): OtpInputType => {
    return merged.value.type ?? "numeric";
  });

  const variantKey = computed(() => {
    return merged.value.variant ?? "outline";
  });

  const isUnderlined = computed(() => {
    return variantKey.value === "underlined";
  });

  const isControlled = computed(() => {
    return !isUndefined(model.value);
  });

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

  const digits = computed(() => {
    return splitOtpValue(value.value, length.value);
  });

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

  const pinsBind = computed(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "flex flex-wrap items-center": true,
        [baseField.sizeClasses.value?.group ?? ""]: true,
      }),
    );
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
    merged,
    digits,
    length,
    pinBind,
    pinsBind,
    baseField,
    inputBind,
    setPinRef,
    inputType,
    handlePinInput,
    handlePinFocus,
    handlePinPaste,
    handlePinKeyDown,
  };
}

export type UseOtpFieldReturn = ReturnType<typeof useOtpField>;
