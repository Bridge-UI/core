// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import type {
  ClipboardEvent,
  FormEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  RefObject,
} from "react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

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
  OtpFieldSlots,
} from "@/Components/OtpField/otpField.types";
import {
  derived,
  hasSlotOrProp,
  mergeNestedComponentProps,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export const otpFieldBridgeKeys = [
  "mask",
  "size",
  "type",
  "color",
  "error",
  "label",
  "value",
  "corner",
  "length",
  "classes",
  "rounded",
  "variant",
  "disabled",
  "onChange",
  "readonly",
  "required",
  "autoFocus",
  "controlId",
  "onComplete",
  "customProps",
  "description",
  "placeholder",
  "errorMessage",
  "withoutErrorMessage",
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
  const autoId = useId();
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

  const slots = derived(() => props.slots as undefined | OtpFieldSlots);

  const customProps = derived(() => merged.customProps);

  const mergedClasses = useBridgeUIMergedRegistryClasses<OtpFieldClasses>({
    props: componentProps,
    entry: bridgeOtpField,
  });

  const length = derived(() => resolveOtpLength(merged.length));

  const inputType = derived((): OtpInputType => merged.type ?? "numeric");

  const invalidated = derived(() => merged.error === true);

  const isDisabled = derived(() => Boolean(merged.disabled));

  const isReadonly = derived(() => Boolean(merged.readonly));

  const variantKey = derived(() => merged.variant ?? "outline");

  const isUnderlined = derived(() => variantKey === "underlined");

  const controlId = derived(
    () =>
      merged.controlId ?? (inheritedAttrs.id as string | undefined) ?? autoId,
  );

  const isControlled = !isNil(props.value);

  const [internalValue, setInternalValue] = useState(() =>
    normalizeOtpValue(props.value, length, inputType),
  );

  const value = useMemo(() => {
    if (isControlled) {
      return normalizeOtpValue(props.value, length, inputType);
    }

    return internalValue;
  }, [isControlled, props.value, internalValue, length, inputType]);

  const digits = useMemo(() => splitOtpValue(value, length), [value, length]);

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

  const reservesErrorMessageSpace = derived(() => !merged.withoutErrorMessage);

  const showErrorMessageContent = derived(() => {
    return (
      invalidated && hasSlotOrProp(slots, "errorMessage", merged.errorMessage)
    );
  });

  const ariaDescribedBy = derived(() => {
    const ids: string[] = [];

    if (
      !invalidated &&
      hasSlotOrProp(slots, "description", merged.description)
    ) {
      ids.push(`${controlId}-description`);
    }

    if (
      invalidated &&
      !merged.withoutErrorMessage &&
      hasSlotOrProp(slots, "errorMessage", merged.errorMessage)
    ) {
      ids.push(`${controlId}-error`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      {
        className: cn(inheritedAttrs.className as string | undefined),
        ...omit(inheritedAttrs, ["className", "slots", "id"]),
      },
      cn({
        "group w-full relative": true,
        "aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60": true,
        "aria-readonly:pointer-events-none aria-readonly:select-none": true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const headerBind = derived(() => {
    return mergePartBind(
      customProps?.header,
      {},
      cn({
        "flex w-full gap-x-2 mb-1.5": true,
        "justify-between items-end": hasSlotOrProp(
          slots,
          "label",
          merged.label,
        ),
        "justify-end": !hasSlotOrProp(slots, "label", merged.label),
        [mergedClasses.header ?? ""]: true,
      }),
    );
  });

  const cornerBind = derived(() => {
    return mergePartBind(
      customProps?.corner,
      {},
      cn({
        "text-gray-500 dark:text-gray-400": true,
        [sizeClasses?.text ?? ""]: true,
        [mergedClasses.corner ?? ""]: true,
      }),
    );
  });

  const groupBind = derived(() => {
    return mergePartBind(
      customProps?.group,
      {
        id: controlId,
        role: "group",
        "aria-describedby": ariaDescribedBy,
        "aria-disabled": isDisabled || undefined,
        "aria-invalid": invalidated || undefined,
      },
      cn({
        "flex flex-wrap items-center": true,
        [sizeClasses?.group ?? ""]: true,
        [mergedClasses.group ?? ""]: true,
      }),
    );
  });

  const descriptionBind = derived(() => {
    return mergePartBind(
      customProps?.description,
      {},
      cn({
        "mt-2 text-gray-500 dark:text-gray-400": true,
        [sizeClasses?.text ?? ""]: true,
        [mergedClasses.description ?? ""]: true,
      }),
    );
  });

  const errorBind = derived(() => {
    return mergePartBind(
      customProps?.errorMessage,
      {},
      cn({
        "mt-2": true,
        "min-h-[1lh]": reservesErrorMessageSpace,
        [invalidatedColors?.errorMessage ?? ""]: true,
        [sizeClasses?.text ?? ""]: true,
        [mergedClasses.errorMessage ?? ""]: true,
      }),
    );
  });

  const fieldLabelProps = derived((): LabelProps => {
    return mergeNestedComponentProps(customProps?.label, {
      size: merged.size,
      error: invalidated,
      htmlFor: `${controlId}-0`,
      required: merged.required,
      classes: {
        required: mergedClasses.required,
        root: cn({
          [mergedClasses.label ?? ""]: true,
        }),
      },
    });
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
          "text-gray-900 dark:text-gray-100 placeholder:text-gray-400": true,
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
    invalidated,
    mergedClasses,
    handlePinInput,
    handlePinFocus,
    handlePinPaste,
    fieldLabelProps,
    descriptionBind,
    handlePinKeyDown,
    showErrorMessageContent,
    pinRefs: pinRefs as RefObject<Array<null | HTMLInputElement>>,
  };
}

export type UseOtpFieldReturn = ReturnType<typeof useOtpField>;
