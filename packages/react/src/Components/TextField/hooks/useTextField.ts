// ** External Imports
import { get } from "es-toolkit/compat";
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
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
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
  "slots",
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
  const { customProps, inheritedAttrs } = splitComponentProps<
    TextFieldProps,
    typeof textFieldBridgeKeys
  >({
    props,
    bridgeKeys: textFieldBridgeKeys,
  });

  const {
    slots,
    className: rootClassAttr,
    ...inputInheritedAttrs
  } = inheritedAttrs as {
    className?: string;
    slots?: TextFieldProps["slots"];
  } & Record<string, unknown>;

  const { entry: bridgeTextField, merged: textFieldMerged } =
    useBridgeUIComponent<TextFieldMerged, "TextField">({
      libDefaults,
      props: customProps,
      componentName: "TextField",
    });

  const resolvedSlots = derived(() => {
    return props.slots ?? slots;
  });

  const formField = useFormField(
    customProps as FormFieldOwnProps,
    {
      size: libDefaults.size,
    },
    {
      slots: () => resolvedSlots,
      rootClassName: () => rootClassAttr,
      controlId: () => inputInheritedAttrs.id as string | undefined,
    },
  );

  const partsProps = derived((): TextFieldPartsProps | undefined => {
    return textFieldMerged.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TextFieldClasses>({
    entry: bridgeTextField,
    props: customProps,
  });

  const variantClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeTextField?.customProps?.variant,
    );

    return get(classes, textFieldMerged.variant);
  }, [textFieldMerged.variant, bridgeTextField?.customProps?.variant]);

  const colorClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeTextField?.customProps?.color,
    );

    return get(classes, textFieldMerged.color);
  }, [textFieldMerged.color, bridgeTextField?.customProps?.color]);

  const roundedClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeTextField?.customProps?.rounded,
    );

    return get(classes, textFieldMerged.rounded);
  }, [textFieldMerged.rounded, bridgeTextField?.customProps?.rounded]);

  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeTextField?.customProps?.size,
    );

    return get(classes, textFieldMerged.size);
  }, [textFieldMerged.size, bridgeTextField?.customProps?.size]);

  const isUnderlined = derived(() => {
    return textFieldMerged.variant === "underlined";
  });

  const inputId = formField.controlId;
  const isDisabled = formField.isDisabled;
  const isReadonly = formField.isReadonly;
  const invalidated = formField.invalidated;

  const focusColorPalette = useMemo(() => {
    if (textFieldMerged.error === true) {
      const classes = mergeBridgeUILayeredClasses(
        colorProps,
        bridgeTextField?.customProps?.color,
      );

      return get(classes, "error");
    }

    return colorClasses;
  }, [
    bridgeTextField?.customProps?.color,
    colorClasses,
    textFieldMerged.error,
  ]);

  const containerSpacing = derived(() => {
    const hasEndSlot = hasNamedSlot(resolvedSlots, "end");
    const hasStartSlot = hasNamedSlot(resolvedSlots, "start");

    if (!hasStartSlot && !hasEndSlot) {
      return sizeClasses?.padding;
    }

    return cn({
      "gap-x-2": true,
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

  const endIconBind = derived(() => {
    return mergePartBind(partsProps?.endIcon, {}, "");
  });

  const startIconBind = derived(() => {
    return mergePartBind(partsProps?.startIcon, {}, "");
  });

  const rootBind = derived(() => {
    return mergePartBind(
      {},
      rootClassAttr !== undefined ? { className: rootClassAttr } : {},
      cn(formField.rootBind.className),
    );
  });

  const endBind = derived(() => {
    return mergePartBind(
      partsProps?.end,
      {},
      cn({
        "shrink-0 text-gray-500 pointer-events-none select-none flex items-center whitespace-nowrap": true,
        "group-data-[invalid]:text-error-500": true,
        "text-error-500": invalidated,
        [colorClasses?.end ?? ""]: !invalidated,
        [roundedClasses?.end ?? ""]: !isUnderlined,
        [mergedClasses.end ?? ""]: true,
      }),
    );
  });

  const startBind = derived(() => {
    return mergePartBind(
      partsProps?.start,
      {},
      cn({
        "text-gray-400 pointer-events-none select-none flex items-center whitespace-nowrap": true,
        "group-data-[invalid]:text-error-500": true,
        "text-error-500": invalidated,
        [colorClasses?.start ?? ""]: !invalidated,
        [roundedClasses?.start ?? ""]: !isUnderlined,
        [mergedClasses.start ?? ""]: true,
      }),
    );
  });

  const endSlotBind = derived(() => {
    return mergePartBind(
      partsProps?.end,
      {},
      cn({
        "group/end wrapper-end-slot shrink-0 flex self-stretch items-stretch py-0.5 pe-0.5": true,
        [mergedClasses.end ?? ""]: true,
      }),
    );
  });

  const startSlotBind = derived(() => {
    return mergePartBind(
      partsProps?.start,
      {},
      cn({
        "group/start wrapper-start-slot shrink-0 flex self-stretch items-stretch py-0.5 ps-0.5": true,
        [mergedClasses.start ?? ""]: true,
      }),
    );
  });

  const inputBind = derived(() => {
    return mergePartBind(
      {
        ...partsProps?.input,
        id: inputId,
        disabled: isDisabled,
        readOnly: isReadonly,
        "aria-invalid": invalidated || undefined,
        "aria-describedby": formField.ariaDescribedBy,
      },
      inputInheritedAttrs,
      cn({
        "flex-1 min-w-0 bg-transparent border-0 shadow-none": true,
        "outline-none ring-0 focus:outline-none focus:ring-0": true,
        "text-gray-900 dark:text-gray-100 placeholder:text-gray-400": true,
        "disabled:cursor-not-allowed": true,
        [sizeClasses?.input ?? ""]: true,
        [mergedClasses.input ?? ""]: true,
      }),
    );
  });

  const containerBind = derived(() => {
    const hasStartSlot = hasNamedSlot(resolvedSlots, "start");
    const hasEndSlot = hasNamedSlot(resolvedSlots, "end");

    return mergePartBind(
      partsProps?.container,
      {},
      cn({
        "bg-gray-100 dark:bg-gray-800": isDisabled && !invalidated,
        "group/field relative flex justify-start gap-x-2 items-center": true,
        "transition-all ease-in-out duration-150": true,
        "outline-none": true,
        [variantClasses?.container ?? ""]: true,
        [variantClasses?.input ?? ""]: true,
        [roundedClasses?.input ?? ""]: !isUnderlined,
        [containerColorFocus ?? ""]: true,
        [containerSpacing ?? ""]: true,
        [sizeClasses?.container ?? ""]: hasStartSlot || hasEndSlot,
        "rounded-none": isUnderlined,
        "bg-error-50 ring-error-500 focus-within:ring-error-600 dark:ring-error-700 dark:bg-error-700/10 dark:ring-error-600 dark:focus-within:ring-error-600":
          invalidated && !isUnderlined,
        "border-error-500 focus-within:border-error-600 dark:border-error-600 dark:focus-within:border-error-600":
          invalidated && isUnderlined,
        [mergedClasses.container ?? ""]: true,
      }),
    );
  });

  return {
    field: formField,
    slots: resolvedSlots,
    merged: textFieldMerged,
    endBind,
    inputId,
    rootBind: formField.rootBind,
    errorIcon,
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
  };
}
