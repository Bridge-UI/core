// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { CircleAlert } from "lucide-react";
import { useMemo } from "react";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  colorProps,
  roundedProps,
  sizeProps,
  variantProps,
} from "@bridge-ui/core/Components/TextField";

// ** Local Imports
import { useFormField } from "@/Components/FormField/hooks/useFormField";
import type {
  TextFieldClasses,
  TextFieldOwnProps,
  TextFieldPartsProps,
  TextFieldProps,
} from "@/Components/TextField/textField.types";
import {
  derived,
  hasNamedSlot,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const textFieldBridgeKeys = [
  "end",
  "size",
  "color",
  "error",
  "label",
  "slots",
  "start",
  "corner",
  "classes",
  "endIcon",
  "rounded",
  "variant",
  "disabled",
  "readonly",
  "required",
  "startIcon",
  "partsProps",
  "description",
  "errorMessage",
  "withErrorIcon",
] as const satisfies readonly (keyof TextFieldOwnProps)[];

const errorIcon = CircleAlert;

type TextFieldLibDefaults = LibDefaultsShape<
  TextFieldOwnProps,
  "color" | "rounded" | "size" | "variant" | "withErrorIcon"
>;

type TextFieldMerged = MergeLibDefaults<
  TextFieldOwnProps,
  TextFieldLibDefaults
>;

export function useTextField(
  props: TextFieldProps,
  libDefaults: TextFieldLibDefaults,
) {
  // Setup
  const { customProps, inheritedAttrs } = splitComponentProps<
    TextFieldProps,
    typeof textFieldBridgeKeys
  >({
    props,
    bridgeKeys: textFieldBridgeKeys,
  });

  const { entry: bridgeTextField, merged } = useBridgeUIComponent<
    TextFieldMerged,
    "TextField"
  >({
    libDefaults,
    props: customProps,
    componentName: "TextField",
  });

  const slots = derived(() => {
    return props.slots;
  });

  const rootClassAttr = derived(() => {
    return inheritedAttrs.className;
  });

  const inputInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "className"]);
  });

  const formField = useFormField(
    customProps,
    {
      size: libDefaults.size,
    },
    {
      rootClassName: () => rootClassAttr,
      controlId: () => inputInheritedAttrs.id,
    },
  );

  const partsProps = derived((): TextFieldPartsProps | undefined => {
    return merged.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TextFieldClasses>({
    props: customProps,
    entry: bridgeTextField,
  });

  // Classes
  const variantClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeTextField?.customProps?.variant,
    );

    return get(classes, merged.variant);
  }, [merged.variant, bridgeTextField?.customProps?.variant]);

  const colorClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeTextField?.customProps?.color,
    );

    return get(classes, merged.color);
  }, [merged.color, bridgeTextField?.customProps?.color]);

  const roundedClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeTextField?.customProps?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeTextField?.customProps?.rounded]);

  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeTextField?.customProps?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeTextField?.customProps?.size]);

  const isUnderlined = derived(() => {
    return merged.variant === "underlined";
  });

  const inputId = formField.controlId;
  const isDisabled = formField.isDisabled;
  const isReadonly = formField.isReadonly;
  const invalidated = formField.invalidated;

  const focusColorPalette = useMemo(() => {
    if (merged.error === true) {
      const classes = mergeBridgeUILayeredClasses(
        colorProps,
        bridgeTextField?.customProps?.color,
      );

      return get(classes, "error");
    }

    return colorClasses;
  }, [colorClasses, merged.error, bridgeTextField?.customProps?.color]);

  const containerSpacing = derived(() => {
    const hasEndSlot = hasNamedSlot(slots, "end");
    const hasStartSlot = hasNamedSlot(slots, "start");
    const hasAdornmentSlot = hasStartSlot || hasEndSlot;

    if (!hasAdornmentSlot) {
      return sizeClasses?.padding;
    }

    return cn({
      // Theme classes
      [sizeClasses?.insetStart ?? ""]: !hasStartSlot,
      [sizeClasses?.insetEnd ?? ""]: !hasEndSlot,
    });
  });

  const containerColorFocus = derived(() => {
    if (isUnderlined) {
      return focusColorPalette?.underlined;
    }

    return focusColorPalette?.input;
  });

  // Binds
  const endIconBind = derived(() => {
    return mergePartBind(partsProps?.endIcon, {}, "");
  });

  const startIconBind = derived(() => {
    return mergePartBind(partsProps?.startIcon, {}, "");
  });

  // prettier-ignore
  const endSlotBind = derived(() => {
    return mergePartBind( partsProps?.end, {}, cn({
      // Theme classes
      "group/end wrapper-end-slot shrink-0 flex h-full min-h-0 w-auto items-stretch self-stretch py-0.5 pe-0.5 [&>*]:h-full [&>*]:min-h-0": true,
      // Custom classes
      [mergedClasses.end ?? ""]: true,
    }));
  });

  // prettier-ignore
  const startSlotBind = derived(() => {
    return mergePartBind( partsProps?.start, {}, cn({
      // Theme classes
      "group/start wrapper-start-slot shrink-0 flex h-full min-h-0 w-auto items-stretch self-stretch py-0.5 ps-0.5 [&>*]:h-full [&>*]:min-h-0": true,
      // Custom classes
      [mergedClasses.start ?? ""]: true,
    }));
  });

  // prettier-ignore
  const endBind = derived(() => {
    return mergePartBind( partsProps?.end, {}, cn({
      // Theme classes
      "shrink-0 self-center text-gray-500 pointer-events-none select-none flex items-center whitespace-nowrap": true,
      "group-data-[invalid]:text-error-500": true,
      [roundedClasses?.end ?? ""]: !isUnderlined,
      [colorClasses?.end ?? ""]: !invalidated,
      "text-error-500": invalidated,
      // Custom classes
      [mergedClasses.end ?? ""]: true,
    }));
  });

  // prettier-ignore
  const startBind = derived(() => {
    return mergePartBind( partsProps?.start, {}, cn({
      // Theme classes
      "shrink-0 self-center text-gray-400 pointer-events-none select-none flex items-center whitespace-nowrap": true,
      [roundedClasses?.start ?? ""]: !isUnderlined,
      "group-data-[invalid]:text-error-500": true,
      [colorClasses?.start ?? ""]: !invalidated,
      "text-error-500": invalidated,
      // Custom classes
      [mergedClasses.start ?? ""]: true,
    }));
  });

  // prettier-ignore
  const inputBind = derived(() => {
    return mergePartBind( {
      ...partsProps?.input,
      id: inputId,
      disabled: isDisabled,
      readOnly: isReadonly,
      "aria-invalid": invalidated || undefined,
      "aria-describedby": formField.ariaDescribedBy,
    }, inputInheritedAttrs, cn({
      // Theme classes
      "flex-1 min-h-0 min-w-0 h-full bg-transparent border-0 shadow-none": true,
      "text-gray-900 dark:text-gray-100 placeholder:text-gray-400": true,
      "outline-none ring-0 focus:outline-none focus:ring-0": true,
      "disabled:cursor-not-allowed": true,
      [sizeClasses?.input ?? ""]: true,
      // Custom classes
      [mergedClasses.input ?? ""]: true,
    }));
  });

  // prettier-ignore
  const containerBind = derived(() => {
    return mergePartBind(partsProps?.container, {}, cn({
      // Theme classes
      "group/field relative flex justify-start gap-x-2 items-stretch": true,
      "bg-gray-100 dark:bg-gray-800": isDisabled && !invalidated,
      "transition-all ease-in-out duration-150": true,
      [roundedClasses?.input ?? ""]: !isUnderlined,
      [variantClasses?.container ?? ""]: true,
      [sizeClasses?.container ?? ""]: true,
      [variantClasses?.input ?? ""]: true,
      [containerColorFocus ?? ""]: true,
      [containerSpacing ?? ""]: true,
      "rounded-none": isUnderlined,
      "outline-none": true,
      // Error classes
      "bg-error-50 ring-error-500 focus-within:ring-error-600 dark:ring-error-700 dark:bg-error-700/10 dark:ring-error-600 dark:focus-within:ring-error-600": invalidated && !isUnderlined,
      "border-error-500 focus-within:border-error-600 dark:border-error-600 dark:focus-within:border-error-600": invalidated && isUnderlined,
      // Custom classes
      [mergedClasses.container ?? ""]: true,
      }),
    );
  });

  return {
    slots,
    merged,
    endBind,
    inputId,
    errorIcon,
    formField,
    inputBind,
    startBind,
    isDisabled,
    isReadonly,
    endIconBind,
    endSlotBind,
    invalidated,
    containerBind,
    startIconBind,
    startSlotBind,
    rootBind: formField.rootBind,
  };
}
