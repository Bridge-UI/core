// ** External Imports
import { get, omit } from "es-toolkit/compat";
import type { InputHTMLAttributes } from "react";
import { useId, useMemo } from "react";

// ** Core Imports
import {
  formFieldColorProps as colorProps,
  formFieldRoundedProps as roundedProps,
  formFieldSizeProps as sizeProps,
  formFieldVariantProps as variantProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  getColorToken,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldOwnProps,
  FormFieldProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";
import type { LabelProps } from "@/Components/Label/label.types";
import {
  derived,
  hasNamedSlot,
  hasSlotOrProp,
  mergeNestedComponentProps,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export type FormFieldReservedSlotName = Exclude<
  keyof FormFieldSlots,
  "default"
>;

export type FormFieldOptions = {
  /**
   * Public registry key that owns FormField chrome defaults/tokens.
   */
  componentName?:
    | "Select"
    | "Textarea"
    | "DateField"
    | "TextField"
    | "TimeField"
    | "ColorField"
    | "NumberField"
    | "Autocomplete"
    | "DateTimeField"
    | "PasswordField"
    | "DateRangeField"
    | "TimeRangeField"
    | "DateTimeRangeField";

  /**
   * Native control rendered by the field composable (`<input>` vs `<textarea>`).
   *
   * @default "input"
   */
  control?: () => string | undefined;

  /**
   * When the control is a `<textarea>`, use compact TextField-like sizing tokens.
   */
  likeInput?: () => boolean | undefined;

  /**
   * Slots rendered on `<FormField>` by the field wrapper instead of received
   * from a parent consumer. Reserves matching container inset spacing.
   */
  reservedSlots?: () => undefined | readonly FormFieldReservedSlotName[];
};

export const formFieldBridgeKeys = [
  "end",
  "size",
  "color",
  "error",
  "label",
  "start",
  "corner",
  "classes",
  "endIcon",
  "rounded",
  "variant",
  "disabled",
  "readonly",
  "required",
  "errorIcon",
  "startIcon",
  "customProps",
  "description",
  "errorMessage",
  "showErrorIcon",
  "hideErrorMessage",
] as const satisfies readonly (keyof FormFieldOwnProps)[];

type FormFieldLibDefaults = LibDefaultsShape<
  FormFieldOwnProps,
  "size" | "color" | "rounded" | "variant" | "errorIcon" | "showErrorIcon"
>;

type FormFieldMerged = MergeLibDefaults<
  FormFieldOwnProps,
  FormFieldLibDefaults
>;

export function useFormField(
  props: Omit<FormFieldProps, "field">,
  libDefaults: FormFieldLibDefaults,
  options: FormFieldOptions = {},
) {
  const autoId = useId();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    Omit<FormFieldProps, "field">,
    typeof formFieldBridgeKeys
  >({
    props,
    bridgeKeys: formFieldBridgeKeys,
  });

  const { merged, entry: bridgeFormField } = useBridgeUIComponent<
    FormFieldMerged,
    NonNullable<FormFieldOptions["componentName"]>
  >({
    libDefaults,
    props: componentProps,
    componentName: options.componentName,
  });

  const slots = derived(() => {
    return props.slots;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const control = derived(() => {
    return options.control?.() ?? "input";
  });

  const inputInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, [
      "slots",
      "children",
      "className",
    ]) as InputHTMLAttributes<HTMLInputElement>;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<FormFieldClasses>({
    props: componentProps,
    entry: bridgeFormField,
  });

  const invalidated = derived(() => {
    return merged.error === true;
  });

  const isDisabled = derived(() => {
    return Boolean(merged.disabled);
  });

  const isReadonly = derived(() => {
    return Boolean(merged.readonly);
  });

  const variantKey = derived(() => {
    return merged.variant ?? "outline";
  });

  const errorIcon = derived(() => {
    return merged.errorIcon ?? "alert";
  });

  const isNotched = derived(() => {
    return variantKey === "notched";
  });

  const isStacked = derived(() => {
    return variantKey === "stacked";
  });

  const isUnderlined = derived(() => {
    return variantKey === "underlined";
  });

  const isTextareaControl = derived(() => {
    return control === "textarea";
  });

  const isTextareaLikeInput = derived(() => {
    return isTextareaControl && Boolean(options.likeInput?.());
  });

  const controlId = derived(() => {
    return merged.controlId ?? inputInheritedAttrs.id ?? autoId;
  });

  const reservesErrorMessageSpace = derived(() => {
    return !merged.hideErrorMessage;
  });

  const showErrorMessageContent = derived(() => {
    return (
      invalidated && hasSlotOrProp(slots, "errorMessage", merged.errorMessage)
    );
  });

  const hasInsetLabelRow = derived(() => {
    return (
      (isNotched || isStacked) &&
      (hasSlotOrProp(slots, "label", merged.label) ||
        hasSlotOrProp(slots, "corner", merged.corner))
    );
  });

  const headerJustify = derived(() => {
    if (hasSlotOrProp(slots, "label", merged.label)) {
      return "justify-between items-end";
    }

    return "justify-end";
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
      !merged.hideErrorMessage &&
      hasSlotOrProp(slots, "errorMessage", merged.errorMessage)
    ) {
      ids.push(`${controlId}-error`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeFormField?.tokens?.size,
    );

    return get(classes, [merged.size, merged.variant ?? "outline"]);
  }, [merged.size, merged.variant, bridgeFormField?.tokens?.size]);

  const colorPalette = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeFormField?.tokens?.color,
    );

    return getColorToken({
      tokens: classes,
      color: merged.color,
      invalid: invalidated,
    });
  }, [invalidated, merged.color, bridgeFormField?.tokens?.color]);

  const roundedClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeFormField?.tokens?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeFormField?.tokens?.rounded]);

  const variantClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeFormField?.tokens?.variant,
    );

    return get(classes, merged.variant ?? "outline");
  }, [merged.variant, bridgeFormField?.tokens?.variant]);

  const containerColorFocus = derived(() => {
    if (isUnderlined) {
      return colorPalette?.underlined;
    }

    return colorPalette?.input;
  });

  const stackedBodySpacing = derived(() => {
    if (!isStacked) {
      return undefined;
    }

    return cn({
      [sizeClasses?.insetTop ?? ""]: true,
      [sizeClasses?.insetStart ?? ""]: true,
      [sizeClasses?.insetEnd ?? ""]: true,
    });
  });

  const containerSpacing = derived(() => {
    const reserved = options.reservedSlots?.() ?? [];

    const hasEndSlot = hasNamedSlot(slots, "end") || reserved.includes("end");
    const hasStartSlot =
      hasNamedSlot(slots, "start") || reserved.includes("start");

    if (isStacked) {
      return undefined;
    }

    if (!hasStartSlot && !hasEndSlot) {
      return sizeClasses?.padding;
    }

    return cn({
      [sizeClasses?.insetStart ?? ""]: !hasStartSlot,
      [sizeClasses?.insetEnd ?? ""]: !hasEndSlot,
    });
  });

  const endBind = derived(() => {
    return mergePartBind(
      customProps?.end,
      {},
      cn({
        "shrink-0 self-center flex items-center whitespace-nowrap select-none pointer-events-none": true,
        "text-dark-500": true,
        [roundedClasses?.end ?? ""]: !isUnderlined && !isStacked,
        [colorPalette?.end ?? ""]: true,
        [mergedClasses.end ?? ""]: true,
      }),
    );
  });

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      {
        className: cn(inheritedAttrs.className),
        ...omit(inheritedAttrs, ["className", "slots", "children"]),
      },
      cn({
        "group w-full relative": true,
        "aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60": true,
        "aria-readonly:pointer-events-none aria-readonly:select-none": true,
        [mergedClasses.root ?? ""]: true,
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
        "text-error-600 dark:text-error-400": true,
        [sizeClasses?.text ?? ""]: true,
        [mergedClasses.errorMessage ?? ""]: true,
      }),
    );
  });

  const inputBind = derived(() => {
    return mergePartBind(
      {
        ...customProps?.input,
        id: controlId,
        disabled: isDisabled,
        readOnly: isReadonly,
        "aria-describedby": ariaDescribedBy,
        "aria-invalid": invalidated || undefined,
      },
      inputInheritedAttrs,
      cn({
        "flex-1 min-w-0 min-h-0 bg-transparent border-0 shadow-none": true,
        "h-full": !isTextareaControl && !isStacked,
        "max-h-none": isTextareaControl,
        "text-dark-900 dark:text-dark-100 placeholder:text-dark-400": true,
        "outline-none ring-0 focus:outline-none focus:ring-0": true,
        "disabled:cursor-not-allowed": true,
        [sizeClasses?.input ?? ""]: !isTextareaControl,
        [sizeClasses?.textarea ?? ""]: isTextareaControl,
        [sizeClasses?.textareaLikeInput ?? ""]: isTextareaLikeInput,
        [mergedClasses.input ?? ""]: true,
      }),
    );
  });

  const fieldLabelProps = derived((): LabelProps => {
    return mergeNestedComponentProps(customProps?.label, {
      size: merged.size,
      error: invalidated,
      htmlFor: controlId,
      required: merged.required,
      classes: {
        required: mergedClasses.required,
        root: cn({
          [variantClasses?.label ?? ""]: isNotched,
          [mergedClasses.label ?? ""]: true,
        }),
      },
    });
  });

  const startBind = derived(() => {
    return mergePartBind(
      customProps?.start,
      {},
      cn({
        "shrink-0 self-center flex items-center whitespace-nowrap select-none pointer-events-none": true,
        "text-dark-400": true,
        [roundedClasses?.start ?? ""]: !isUnderlined && !isStacked,
        [colorPalette?.start ?? ""]: true,
        [mergedClasses.start ?? ""]: true,
      }),
    );
  });

  const cornerBind = derived(() => {
    return mergePartBind(
      customProps?.corner,
      {},
      cn({
        "text-dark-500 dark:text-dark-400": !isNotched,
        [sizeClasses?.text ?? ""]: true,
        [variantClasses?.corner ?? ""]: isNotched,
        [mergedClasses.corner ?? ""]: true,
      }),
    );
  });

  const headerBind = derived(() => {
    return mergePartBind(
      customProps?.header,
      {},
      cn({
        flex: true,
        "mb-1": true,
        [headerJustify]: true,
        [mergedClasses.header ?? ""]: true,
      }),
    );
  });

  const endIconBind = derived(() => {
    return mergePartBind(
      customProps?.endIcon,
      {},
      cn({
        "inline-flex shrink-0 items-center justify-center self-center":
          isStacked,
      }),
    );
  });

  const endSlotBind = derived(() => {
    return mergePartBind(
      customProps?.end,
      {},
      cn({
        "group/end wrapper-end-slot shrink-0 flex w-auto items-stretch self-stretch [&>*]:min-h-0": true,
        "self-stretch min-h-0 overflow-hidden py-0.5 pe-0.5": isStacked,
        "h-full min-h-0 overflow-hidden py-0.5 pe-0.5": !isStacked,
        [mergedClasses.end ?? ""]: true,
      }),
    );
  });

  const stackedBodyBind = derived(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "flex min-h-0 min-w-0 flex-1 flex-col": true,
        [stackedBodySpacing ?? ""]: true,
      }),
    );
  });

  const stackedInputRowBind = derived(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "flex w-full min-w-0 flex-1 items-stretch gap-x-2": true,
        [sizeClasses?.controlRow ?? ""]: true,
      }),
    );
  });

  const containerBind = derived(() => {
    return mergePartBind(
      customProps?.container,
      {
        "data-bridge-rounded": merged.rounded ?? "md",
      },
      cn({
        "group/field relative flex flex-row items-stretch overflow-hidden":
          isStacked,
        "group/field relative flex justify-start gap-x-2 items-stretch":
          !isStacked,
        "transition-all ease-in-out duration-150 outline-none": true,
        "bg-dark-100 dark:bg-dark-800": isDisabled && !invalidated,
        [sizeClasses?.container ?? ""]: !isTextareaControl,
        [sizeClasses?.containerTextareaLikeInput ?? ""]: isTextareaLikeInput,
        [sizeClasses?.containerTextarea ?? ""]:
          isTextareaControl && !isTextareaLikeInput,
        [variantClasses?.container ?? ""]: true,
        [roundedClasses?.input ?? ""]: !isUnderlined,
        [containerSpacing ?? ""]: true,
        [containerColorFocus ?? ""]: true,
        "rounded-none": isUnderlined,
        "bg-error-50 ring-error-500 dark:bg-error-700/10 dark:ring-error-600":
          invalidated && !isUnderlined,
        "border-error-500 dark:border-error-600": invalidated && isUnderlined,
        [mergedClasses.container ?? ""]: true,
      }),
    );
  });

  const startIconBind = derived(() => {
    return mergePartBind(
      customProps?.startIcon,
      {},
      cn({
        "inline-flex shrink-0 items-center justify-center self-center":
          isStacked,
      }),
    );
  });

  const startSlotBind = derived(() => {
    return mergePartBind(
      customProps?.start,
      {},
      cn({
        "group/start wrapper-start-slot shrink-0 flex w-auto items-stretch self-stretch [&>*]:min-h-0": true,
        "self-stretch min-h-0 overflow-hidden py-0.5 ps-0.5": isStacked,
        "h-full min-h-0 overflow-hidden py-0.5 ps-0.5": !isStacked,
        [mergedClasses.start ?? ""]: true,
      }),
    );
  });

  const descriptionBind = derived(() => {
    return mergePartBind(
      customProps?.description,
      {},
      cn({
        "mt-2 text-dark-500 dark:text-dark-400": true,
        [sizeClasses?.text ?? ""]: true,
        [mergedClasses.description ?? ""]: true,
      }),
    );
  });

  const insetLabelRowBind = derived(() => {
    const hasLabel = hasSlotOrProp(slots, "label", merged.label);

    return mergePartBind(
      customProps?.header,
      {},
      cn({
        flex: true,
        "w-full shrink-0": true,
        "justify-between": hasLabel,
        "justify-end": !hasLabel,
        "items-center": isNotched,
        "items-end": isStacked,
        [variantClasses?.labelRow ?? ""]: hasInsetLabelRow,
        [mergedClasses.header ?? ""]: true,
      }),
    );
  });

  return {
    slots,
    merged,
    control,
    endBind,
    rootBind,
    controlId,
    errorBind,
    errorIcon,
    inputBind,
    isNotched,
    isStacked,
    startBind,
    cornerBind,
    headerBind,
    isDisabled,
    isReadonly,
    variantKey,
    endIconBind,
    endSlotBind,
    invalidated,
    containerBind,
    startIconBind,
    startSlotBind,
    fieldLabelProps,
    ariaDescribedBy,
    descriptionBind,
    stackedBodyBind,
    hasInsetLabelRow,
    insetLabelRowBind,
    stackedInputRowBind,
    showErrorMessageContent,
    reservesErrorMessageSpace,
  };
}

export type UseFormFieldReturn = ReturnType<typeof useFormField>;
