// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { CircleAlert } from "lucide-react";
import { useId, useMemo } from "react";

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
} from "@bridge-ui/core/Components/FormField";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldOwnProps,
  FormFieldProps,
} from "@/Components/FormField/formField.types";
import {
  derived,
  hasNamedSlot,
  hasSlotOrProp,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";
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
  "partsProps",
  "description",
  "errorMessage",
  "withErrorIcon",
] as const satisfies readonly (keyof FormFieldOwnProps)[];

type FormFieldLibDefaults = LibDefaultsShape<
  FormFieldOwnProps,
  "color" | "rounded" | "size" | "variant" | "errorIcon" | "withErrorIcon"
>;

type FormFieldMerged = MergeLibDefaults<
  FormFieldOwnProps,
  FormFieldLibDefaults
>;

export function useFormField(
  props: Omit<FormFieldProps, "field">,
  libDefaults: FormFieldLibDefaults,
) {
  // Setup
  const autoId = useId();

  const { customProps, inheritedAttrs } = splitComponentProps<
    Omit<FormFieldProps, "field">,
    typeof formFieldBridgeKeys
  >({
    props,
    bridgeKeys: formFieldBridgeKeys,
  });

  const { entry: bridgeFormField, merged } = useBridgeUIComponent<
    FormFieldMerged,
    "FormField"
  >({
    libDefaults,
    props: customProps,
    componentName: "FormField",
  });

  const slots = derived(() => {
    return props.slots;
  });

  const children = derived(() => {
    return props.children;
  });

  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const inputInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "children", "className"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<FormFieldClasses>({
    props: customProps,
    entry: bridgeFormField,
  });

  // Elements
  const invalidated = derived(() => {
    return merged.error === true;
  });

  const isDisabled = derived(() => {
    return Boolean(merged.disabled);
  });

  const isReadonly = derived(() => {
    return Boolean(merged.readonly);
  });

  const controlId = derived(() => {
    return merged.controlId ?? inputInheritedAttrs.id ?? autoId;
  });

  const variantKey = derived(() => {
    return merged.variant ?? "outline";
  });

  const errorIcon = derived(() => {
    return merged.errorIcon ?? CircleAlert;
  });

  const isUnderlined = derived(() => {
    return variantKey === "underlined";
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

    if (hasSlotOrProp(slots, "errorMessage", merged.errorMessage)) {
      ids.push(`${controlId}-error`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  // Classes
  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeFormField?.customProps?.size,
    );

    return get(classes, [merged.size, merged.variant ?? "outline"]);
  }, [merged.size, merged.variant, bridgeFormField?.customProps?.size]);

  const colorClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeFormField?.customProps?.color,
    );

    return get(classes, merged.color);
  }, [merged.color, bridgeFormField?.customProps?.color]);

  const roundedClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeFormField?.customProps?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeFormField?.customProps?.rounded]);

  const variantClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeFormField?.customProps?.variant,
    );

    return get(classes, merged.variant ?? "outline");
  }, [merged.variant, bridgeFormField?.customProps?.variant]);

  const focusColorPalette = useMemo(() => {
    if (invalidated) {
      const classes = mergeBridgeUILayeredClasses(
        colorProps,
        bridgeFormField?.customProps?.color,
      );

      return get(classes, "error");
    }

    return colorClasses;
  }, [invalidated, colorClasses, bridgeFormField?.customProps?.color]);

  const containerSpacing = derived(() => {
    const hasEndSlot = hasNamedSlot(slots, "end");
    const hasStartSlot = hasNamedSlot(slots, "start");

    if (!hasStartSlot && !hasEndSlot) {
      return sizeClasses?.padding;
    }

    return cn({
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
  const endBind = derived(() => {
    return {};
  });

  const rootBind = derived(() => {
    return {};
  });

  const errorBind = derived(() => {
    return {};
  });

  const inputBind = derived(() => {
    return {};
  });

  const labelBind = derived(() => {
    return {};
  });

  const startBind = derived(() => {
    return {};
  });

  const cornerBind = derived(() => {
    return {};
  });

  const headerBind = derived(() => {
    return {};
  });

  const endIconBind = derived(() => {
    return {};
  });

  const endSlotBind = derived(() => {
    return {};
  });

  const requiredBind = derived(() => {
    return {};
  });

  const containerBind = derived(() => {
    return {};
  });

  const startIconBind = derived(() => {
    return {};
  });

  const startSlotBind = derived(() => {
    return {};
  });

  const descriptionBind = derived(() => {
    return {};
  });

  return {
    slots,
    merged,
    endBind,
    rootBind,
    controlId,
    errorBind,
    errorIcon,
    inputBind,
    labelBind,
    startBind,
    cornerBind,
    headerBind,
    isDisabled,
    isReadonly,
    variantKey,
    endIconBind,
    endSlotBind,
    invalidated,
    requiredBind,
    containerBind,
    startIconBind,
    startSlotBind,
    ariaDescribedBy,
    descriptionBind,
  };
}

export type UseFormFieldReturn = ReturnType<typeof useFormField>;
