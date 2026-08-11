// ** External Imports
import { get, isNil, omit, pick } from "es-toolkit/compat";
import type {
  ClipboardEvent,
  FormEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  RefObject,
} from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
} from "@/Components/BaseField/hooks/useBaseField";
import type {
  OtpFieldClasses,
  OtpFieldOwnProps,
  OtpFieldProps,
} from "@/Components/OtpField/otpField.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export const otpFieldBridgeKeys = [
  "mask",
  "type",
  "color",
  "value",
  "length",
  "rounded",
  "variant",
  "onChange",
  "autoFocus",
  "onComplete",
  "placeholder",
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
  props: OtpFieldProps,
  libDefaults: OtpFieldLibDefaults = {
    length: 6,
    size: "md",
    rounded: "md",
    type: "numeric",
    color: "primary",
    variant: "outline",
  },
) {
  const pinRefs = useRef<Array<null | HTMLInputElement>>([]);

  const { componentProps, inheritedAttrs } = splitComponentProps<
    OtpFieldProps,
    typeof otpFieldBridgeKeys
  >({
    props,
    bridgeKeys: otpFieldBridgeKeys,
  });

  const { merged, entry: bridgeOtpField } = useBridgeUIComponent<
    OtpFieldMerged,
    "OtpField"
  >({
    libDefaults,
    props: componentProps,
    componentName: "OtpField",
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<OtpFieldClasses>({
    props: componentProps,
    entry: bridgeOtpField,
  });

  const baseFieldCustomProps = useMemo(() => {
    return resolveBaseFieldCustomProps(merged.customProps);
  }, [merged.customProps]);

  const baseField = useBaseField(
    {
      ...pick(componentProps, baseFieldBridgeKeys),
      slots: props.slots,
      customProps: baseFieldCustomProps,
      id: inheritedAttrs.id as string | undefined,
      className: inheritedAttrs.className as string | undefined,
      ...omit(inheritedAttrs, ["className", "id", "slots"]),
    },
    {
      size: "md",
      error: false,
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

  const length = derived(() => {
    return resolveOtpLength(merged.length);
  });

  const inputType = derived((): OtpInputType => {
    return merged.type ?? "numeric";
  });

  const variantKey = derived(() => {
    return merged.variant ?? "outline";
  });

  const isUnderlined = derived(() => {
    return variantKey === "underlined";
  });

  const isControlled = !isNil(props.value);

  const [internalValue, setInternalValue] = useState(() => {
    return normalizeOtpValue(props.value, length, inputType);
  });

  const value = useMemo(() => {
    if (isControlled) {
      return normalizeOtpValue(props.value, length, inputType);
    }

    return internalValue;
  }, [isControlled, props.value, internalValue, length, inputType]);

  const digits = useMemo(() => {
    return splitOtpValue(value, length);
  }, [value, length]);

  useEffect(() => {
    pinRefs.current = pinRefs.current.slice(0, length);
  }, [length]);

  useEffect(() => {
    if (!merged.autoFocus || isDisabled || isReadonly) {
      return;
    }

    const emptyIndex = digits.findIndex((digit) => digit === "");
    const focusIndex = emptyIndex === -1 ? 0 : emptyIndex;
    pinRefs.current[focusIndex]?.focus();
  }, []);

  const commitValue = useCallback(
    (nextDigits: string[], focusIndex: null | number) => {
      const nextValue = joinOtpDigits(nextDigits);

      if (!isControlled) {
        setInternalValue(nextValue);
      }

      merged.onChange?.(nextValue);

      if (isOtpComplete(nextValue, length)) {
        merged.onComplete?.(nextValue);
      }

      if (focusIndex != null) {
        requestAnimationFrame(() => {
          pinRefs.current[focusIndex]?.focus();
          pinRefs.current[focusIndex]?.select();
        });
      }
    },
    [isControlled, length, merged],
  );

  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeOtpField?.tokens?.size,
    );

    return get(classes, merged.size ?? "md");
  }, [merged.size, bridgeOtpField?.tokens?.size]);

  const colorPalette = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeOtpField?.tokens?.color,
    );

    return get(classes, merged.color ?? "primary");
  }, [merged.color, bridgeOtpField?.tokens?.color]);

  const invalidatedPalette = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      invalidatedProps,
      bridgeOtpField?.tokens?.invalidated,
      merged.customProps?.invalidated,
    );
  }, [merged.customProps?.invalidated, bridgeOtpField?.tokens?.invalidated]);

  const invalidatedColors = useMemo(() => {
    return invalidated ? invalidatedPalette : undefined;
  }, [invalidated, invalidatedPalette]);

  const roundedClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeOtpField?.tokens?.rounded,
    );

    return get(classes, merged.rounded ?? "md");
  }, [merged.rounded, bridgeOtpField?.tokens?.rounded]);

  const variantClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeOtpField?.tokens?.variant,
    );

    return get(classes, variantKey);
  }, [variantKey, bridgeOtpField?.tokens?.variant]);

  const pinsBind = derived(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "flex flex-wrap items-center": true,
        [baseField.sizeClasses?.group ?? ""]: true,
      }),
    );
  });

  const pinBind = useCallback(
    (_index: number) => {
      return mergePartBind(
        customProps?.pin,
        {},
        cn({
          "relative flex shrink-0 items-center justify-center overflow-hidden": true,
          [sizeClasses?.pin ?? ""]: true,
          [variantClasses?.pin ?? ""]: true,
          [roundedClasses?.pin ?? ""]: !isUnderlined,
          [colorPalette?.pin ?? ""]: !invalidated && !isUnderlined,
          [colorPalette?.underlined ?? ""]: !invalidated && isUnderlined,
          [invalidatedColors?.pin ?? ""]: invalidated && !isUnderlined,
          [invalidatedColors?.pinUnderlined ?? ""]: invalidated && isUnderlined,
          [mergedClasses.pin ?? ""]: true,
        }),
      );
    },
    [
      customProps?.pin,
      sizeClasses,
      variantClasses,
      roundedClasses,
      colorPalette,
      invalidatedColors,
      invalidated,
      isUnderlined,
      mergedClasses.pin,
    ],
  );

  const inputBind = useCallback(
    (index: number): InputHTMLAttributes<HTMLInputElement> => {
      return mergePartBind(
        {
          ...customProps?.input,
          maxLength: length,
          disabled: isDisabled,
          readOnly: isReadonly,
          value: digits[index] ?? "",
          id: `${controlId}-${index}`,
          placeholder: merged.placeholder,
          "aria-describedby": ariaDescribedBy,
          type: merged.mask ? "password" : "text",
          "aria-invalid": invalidated || undefined,
          "aria-label": `Digit ${index + 1} of ${length}`,
          autoComplete: index === 0 ? "one-time-code" : "off",
          inputMode: inputType === "numeric" ? "numeric" : "text",
        },
        {},
        cn({
          "h-full w-full min-w-0 bg-transparent border-0 shadow-none text-center": true,
          "text-dark-900 dark:text-dark-100 placeholder:text-dark-400": true,
          "outline-none ring-0 focus:outline-none focus:ring-0": true,
          "disabled:cursor-not-allowed": true,
          [sizeClasses?.input ?? ""]: true,
          [mergedClasses.input ?? ""]: true,
        }),
      );
    },
    [
      customProps?.input,
      controlId,
      digits,
      isDisabled,
      isReadonly,
      inputType,
      length,
      merged.placeholder,
      merged.mask,
      invalidated,
      ariaDescribedBy,
      sizeClasses,
      mergedClasses.input,
    ],
  );

  const setPinRef = useCallback(
    (index: number, element: null | HTMLInputElement) => {
      pinRefs.current[index] = element;
    },
    [],
  );

  const handlePinInput = useCallback(
    (index: number, event: FormEvent<HTMLInputElement>) => {
      const input = (event.target as HTMLInputElement).value;
      const update = applyOtpInput({
        index,
        input,
        digits,
        type: inputType,
      });
      commitValue(update.digits, update.focusIndex);
    },
    [commitValue, digits, inputType],
  );

  const handlePinKeyDown = useCallback(
    (index: number, event: KeyboardEvent<HTMLInputElement>) => {
      const update = applyOtpKeyNavigation({
        index,
        digits,
        key: event.key,
      });

      if (!update) {
        return;
      }

      event.preventDefault();
      commitValue(update.digits, update.focusIndex);
    },
    [commitValue, digits],
  );

  const handlePinPaste = useCallback(
    (index: number, event: ClipboardEvent<HTMLInputElement>) => {
      const pasted = event.clipboardData.getData("text");
      const update = applyOtpPaste({
        index,
        pasted,
        digits,
        type: inputType,
      });

      if (
        update.focusIndex == null &&
        update.digits.every((d, i) => d === digits[i])
      ) {
        return;
      }

      event.preventDefault();
      commitValue(update.digits, update.focusIndex);
    },
    [commitValue, digits, inputType],
  );

  const handlePinFocus = useCallback((index: number) => {
    pinRefs.current[index]?.select();
  }, []);

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
    pinRefs: pinRefs as RefObject<Array<null | HTMLInputElement>>,
  };
}

export type UseOtpFieldReturn = ReturnType<typeof useOtpField>;
