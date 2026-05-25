// ** External Imports
import { get } from "es-toolkit/compat";
import { useId, useMemo } from "react";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type FormFieldSize,
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
import type { SlotMap } from "@/Utils/slotOrProp";

const formFieldBridgeKeys = [
  "size",
  "error",
  "label",
  "corner",
  "classes",
  "disabled",
  "readonly",
  "required",
  "partsProps",
  "controlId",
  "description",
  "errorMessage",
  "slots",
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

  /**
   * When embedded in another field, use that component's `customProps.size` layer.
   */
  getSizeLayer?: () => Partial<FormFieldSize> | undefined;

  /**
   * Slot map from the parent field (e.g. TextField `slots` prop).
   */
  slots?: () => SlotMap | undefined;
};

export function useFormField(
  props: FormFieldProps,
  libDefaults: FormFieldLibDefaults,
  options?: UseFormFieldOptions,
) {
  const autoId = useId();

  const { customProps, inheritedAttrs } = splitComponentProps<
    FormFieldProps,
    typeof formFieldBridgeKeys
  >({
    bridgeKeys: formFieldBridgeKeys,
    props,
  });

  const {
    children: _children,
    slots: slotsFromProps,
    className: rootClassAttr,
    ...restInheritedAttrs
  } = inheritedAttrs as {
    className?: string;
    slots?: FormFieldOwnProps["slots"];
    children?: FormFieldProps["children"];
  } & Record<string, unknown>;

  const { entry: bridgeFormField, merged } = useBridgeUIComponent<
    FormFieldMerged,
    "FormField"
  >({
    libDefaults,
    props: customProps,
    componentName: "FormField",
  });

  const slots = derived(() => {
    return options?.slots?.() ?? slotsFromProps ?? merged.slots;
  });

  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<FormFieldClasses>({
    props: customProps,
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

  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      options?.getSizeLayer?.() ?? bridgeFormField?.customProps?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeFormField?.customProps?.size, options?.getSizeLayer]);

  const headerBind = derived(() => {
    return mergePartBind(
      partsProps?.header,
      {},
      cn({
        flex: true,
        "mb-1": true,
        [headerJustify]: true,
        [mergedClasses.header ?? ""]: true,
      }),
    );
  });

  const requiredBind = derived(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "text-error-500 dark:text-error-500 select-none": true,
        [mergedClasses.required ?? ""]: true,
      }),
    );
  });

  const cornerBind = derived(() => {
    return mergePartBind(
      partsProps?.corner,
      {},
      cn({
        "text-gray-500 dark:text-gray-400": true,
        [sizeClasses?.corner ?? ""]: true,
        [mergedClasses.corner ?? ""]: true,
      }),
    );
  });

  const descriptionBind = derived(() => {
    return mergePartBind(
      partsProps?.description,
      {},
      cn({
        "mt-2 text-gray-500 dark:text-gray-400": true,
        [sizeClasses?.description ?? ""]: true,
        [mergedClasses.description ?? ""]: true,
      }),
    );
  });

  const errorBind = derived(() => {
    return mergePartBind(
      partsProps?.error,
      {},
      cn({
        "mt-2 text-error-600 dark:text-error-400": true,
        [sizeClasses?.error ?? ""]: true,
        [mergedClasses.error ?? ""]: true,
      }),
    );
  });

  const labelBind = derived(() => {
    return mergePartBind(
      partsProps?.label,
      {},
      cn({
        "inline-flex items-center gap-x-0.5 font-medium leading-none": true,
        "text-error-600 dark:text-error-400": invalidated,
        "text-gray-700 dark:text-gray-300": !invalidated,
        [sizeClasses?.label ?? ""]: true,
        [mergedClasses.label ?? ""]: true,
      }),
    );
  });

  const rootBind = derived(() => {
    return mergePartBind(
      partsProps?.root,
      {
        className: cn(rootClassAttr, options?.rootClassName?.()),
        ...restInheritedAttrs,
      },
      cn({
        "group w-full relative": true,
        "aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60": true,
        "aria-readonly:pointer-events-none aria-readonly:select-none": true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
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

export type FormFieldApi = ReturnType<typeof useFormField>;
