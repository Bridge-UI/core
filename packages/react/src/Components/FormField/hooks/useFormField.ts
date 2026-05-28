// ** External Imports
import { useId } from "react";

// ** Core Imports
import {
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  FormFieldOwnProps,
  FormFieldProps,
} from "@/Components/FormField/formField.types";
import { derived, hasSlotOrProp, useBridgeUIComponent } from "@/Utils";

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
  "startIcon",
  "partsProps",
  "description",
  "errorMessage",
  "withErrorIcon",
] as const satisfies readonly (keyof FormFieldOwnProps)[];

type FormFieldLibDefaults = LibDefaultsShape<
  FormFieldOwnProps,
  "color" | "rounded" | "size" | "variant" | "withErrorIcon"
>;

type FormFieldMerged = MergeLibDefaults<
  FormFieldOwnProps,
  FormFieldLibDefaults
>;

export function useFormField(
  props: FormFieldProps,
  libDefaults: FormFieldLibDefaults,
) {
  // Setup
  const autoId = useId();

  const { customProps } = splitComponentProps<
    FormFieldProps,
    typeof formFieldBridgeKeys
  >({
    props,
    bridgeKeys: formFieldBridgeKeys,
  });

  const { merged } = useBridgeUIComponent<FormFieldMerged, "FormField">({
    libDefaults,
    props: customProps,
    componentName: "FormField",
  });

  // Elements
  const slots = derived(() => {
    return props.slots;
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

  const controlId = derived(() => {
    return merged.controlId ?? autoId;
  });

  const variantKey = derived(() => {
    return merged.variant ?? "outline";
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

  // Binds
  const headerBind = derived(() => {
    return {};
  });

  const requiredBind = derived(() => {
    return {};
  });

  const cornerBind = derived(() => {
    return {};
  });

  const descriptionBind = derived(() => {
    return {};
  });

  const errorBind = derived(() => {
    return {};
  });

  const labelBind = derived(() => {
    return {};
  });

  const rootBind = derived(() => {
    return {};
  });

  const inputBind = derived(() => {
    return {};
  });

  return {
    slots,
    merged,
    rootBind,
    controlId,
    errorBind,
    labelBind,
    inputBind,
    cornerBind,
    headerBind,
    isDisabled,
    isReadonly,
    variantKey,
    invalidated,
    requiredBind,
    ariaDescribedBy,
    descriptionBind,
  };
}

export type UseFormFieldReturn = ReturnType<typeof useFormField>;
