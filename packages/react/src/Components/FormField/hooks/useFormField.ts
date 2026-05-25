// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useId, useMemo } from "react";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { sizeProps } from "@bridge-ui/core/Components/FormField";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldOwnProps,
  FormFieldProps,
} from "@/Components/FormField/formField.types";
import {
  derived,
  hasSlotOrProp,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

/** Props forwarded from field wrappers (e.g. TextField) into `useFormField`. */
export const formFieldOwnPropKeys = [
  "size",
  "error",
  "label",
  "slots",
  "corner",
  "classes",
  "disabled",
  "readonly",
  "required",
  "controlId",
  "partsProps",
  "description",
  "errorMessage",
] as const satisfies readonly (keyof FormFieldOwnProps)[];

type FormFieldLibDefaults = LibDefaultsShape<FormFieldOwnProps, "size">;

type FormFieldMerged = MergeLibDefaults<
  FormFieldOwnProps,
  FormFieldLibDefaults
>;

export type UseFormFieldOptions = {
  /**
   * Control id supplied by the parent field (e.g. TextField `id`).
   */
  controlId?: () => string | undefined;

  /**
   * Extra root `className` from a parent field wrapper (e.g. TextField).
   */
  rootClassName?: () => string | undefined;
};

export function useFormField(
  props: Omit<FormFieldProps, "field">,
  libDefaults: FormFieldLibDefaults,
  options?: UseFormFieldOptions,
) {
  // Setup
  const autoId = useId();

  const { customProps, inheritedAttrs } = splitComponentProps<
    Omit<FormFieldProps, "field">,
    typeof formFieldOwnPropKeys
  >({
    props,
    bridgeKeys: formFieldOwnPropKeys,
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

  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots"]);
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
    return options?.controlId?.() ?? merged.controlId ?? autoId;
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

    return get(classes, merged.size);
  }, [merged.size, bridgeFormField?.customProps?.size]);

  // Binds
  // prettier-ignore
  const headerBind = derived(() => {
    return mergePartBind(partsProps?.header, {}, cn({
      // Theme classes
      [headerJustify ?? ""]: true,
      "flex mb-1": true,
      // Custom classes
      [mergedClasses.header ?? ""]: true,
    }));
  });

  // prettier-ignore
  const requiredBind = derived(() => {
    return mergePartBind({}, {}, cn({
      // Theme classes
      "text-error-500 dark:text-error-500 select-none": true,
      // Custom classes
      [mergedClasses.required ?? ""]: true,
    }));
  });

  // prettier-ignore
  const cornerBind = derived(() => {
    return mergePartBind(partsProps?.corner, {}, cn({
      // Theme classes
      "text-gray-500 dark:text-gray-400": true,
      [sizeClasses?.corner ?? ""]: true,
      // Custom classes
      [mergedClasses.corner ?? ""]: true,
    }));
  });

  // prettier-ignore
  const descriptionBind = derived(() => {
    return mergePartBind(partsProps?.description, {}, cn({
      // Theme classes
      "mt-2 text-gray-500 dark:text-gray-400": true,
      [sizeClasses?.description ?? ""]: true,
      // Custom classes
      [mergedClasses.description ?? ""]: true,
    }));
  });

  // prettier-ignore
  const errorBind = derived(() => {
    return mergePartBind(partsProps?.error, {}, cn({
      // Theme classes
      "mt-2 text-error-600 dark:text-error-400": true,
      [sizeClasses?.error ?? ""]: true,
      // Custom classes
      [mergedClasses.error ?? ""]: true,
    }));
  });

  // prettier-ignore
  const labelBind = derived(() => {
    return mergePartBind(partsProps?.label, {}, cn({
      // Theme classes
      "inline-flex items-center gap-x-0.5 font-medium leading-none": true,
      "text-error-600 dark:text-error-400": invalidated,
      "text-gray-700 dark:text-gray-300": !invalidated,
      [sizeClasses?.label ?? ""]: true,
      // Custom classes
      [mergedClasses.label ?? ""]: true,
    }));
  });

  // prettier-ignore
  const rootBind = derived(() => {
    return mergePartBind(partsProps?.root, {
      className: options?.rootClassName?.(),
      ...rootInheritedAttrs,
    }, cn({
      // Theme classes
      "aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60": true,
      "aria-readonly:pointer-events-none aria-readonly:select-none": true,
      "group w-full relative": true,
      // Custom classes
      [mergedClasses.root ?? ""]: true,
    }));
  });

  return {
    slots,
    merged,
    rootBind,
    controlId,
    errorBind,
    labelBind,
    cornerBind,
    headerBind,
    isDisabled,
    isReadonly,
    invalidated,
    requiredBind,
    ariaDescribedBy,
    descriptionBind,
  };
}
