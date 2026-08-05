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
import { invalidatedProps, sizeProps } from "@bridge-ui/core/Tokens/BaseField";

// ** Local Imports
import type {
  BaseFieldClasses,
  BaseFieldOwnProps,
  BaseFieldProps,
  BaseFieldSlots,
} from "@/Components/BaseField/baseField.types";
import type { LabelProps } from "@/Components/Label/label.types";
import {
  derived,
  hasSlotOrProp,
  mergeNestedComponentProps,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export const baseFieldBridgeKeys = [
  "size",
  "error",
  "label",
  "corner",
  "classes",
  "disabled",
  "readonly",
  "required",
  "controlId",
  "customProps",
  "description",
  "errorMessage",
  "hideErrorMessage",
] as const satisfies readonly (keyof BaseFieldOwnProps)[];

type BaseFieldLibDefaults = LibDefaultsShape<
  BaseFieldOwnProps,
  "size" | "error" | "hideErrorMessage"
>;

type BaseFieldMerged = MergeLibDefaults<
  BaseFieldOwnProps,
  BaseFieldLibDefaults
>;

/**
 * Options for {@link useBaseField}.
 */
export type BaseFieldOptions = {
  /** Resolve Label htmlFor from controlId. Default: identity. */
  labelHtmlFor?: (controlId: string) => string;
};

/**
 * Composes shared field chrome binds for label, group, slots, and helper text.
 */
export function useBaseField(
  props: Omit<BaseFieldProps, "field" | "children">,
  libDefaults: BaseFieldLibDefaults = {
    size: "md",
    error: false,
    hideErrorMessage: false,
  },
  options: BaseFieldOptions = {},
) {
  const autoId = useId();
  const labelHtmlFor =
    options.labelHtmlFor ?? ((controlId: string) => controlId);

  const { componentProps, inheritedAttrs } = splitComponentProps<
    Omit<BaseFieldProps, "field" | "children">,
    typeof baseFieldBridgeKeys
  >({
    props,
    bridgeKeys: baseFieldBridgeKeys,
  });

  const { merged, entry: bridgeBaseField } = useBridgeUIComponent<
    BaseFieldMerged,
    "BaseField"
  >({
    libDefaults,
    props: componentProps,
    componentName: "BaseField",
  });

  const slots = derived(() => {
    return props.slots as undefined | BaseFieldSlots;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<BaseFieldClasses>({
    props: componentProps,
    entry: bridgeBaseField,
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
    return (
      merged.controlId ?? (inheritedAttrs.id as string | undefined) ?? autoId
    );
  });

  const sizeClasses = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeBaseField?.tokens?.size,
    );

    return get(classes, merged.size ?? "md");
  }, [merged.size, bridgeBaseField?.tokens?.size]);

  const invalidatedPalette = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      invalidatedProps,
      bridgeBaseField?.tokens?.invalidated,
      merged.customProps?.invalidated,
    );
  }, [merged.customProps?.invalidated, bridgeBaseField?.tokens?.invalidated]);

  const invalidatedColors = useMemo(() => {
    return invalidated ? invalidatedPalette : undefined;
  }, [invalidated, invalidatedPalette]);

  const reservesErrorMessageSpace = derived(() => {
    return !merged.hideErrorMessage;
  });

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
      !merged.hideErrorMessage &&
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

  const startSlotBind = derived(() => {
    return mergePartBind(
      customProps?.start,
      {},
      cn({
        "group/start wrapper-start-slot shrink-0 flex items-center [&>*]:min-h-0": true,
        [mergedClasses.start ?? ""]: true,
      }),
    );
  });

  const endSlotBind = derived(() => {
    return mergePartBind(
      customProps?.end,
      {},
      cn({
        "group/end wrapper-end-slot shrink-0 flex items-center [&>*]:min-h-0": true,
        [mergedClasses.end ?? ""]: true,
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
      required: merged.required,
      htmlFor: labelHtmlFor(controlId),
      classes: {
        required: mergedClasses.required,
        root: cn({
          [mergedClasses.label ?? ""]: true,
        }),
      },
    });
  });

  return {
    slots,
    merged,
    rootBind,
    errorBind,
    groupBind,
    controlId,
    headerBind,
    cornerBind,
    isDisabled,
    isReadonly,
    endSlotBind,
    invalidated,
    startSlotBind,
    mergedClasses,
    fieldLabelProps,
    descriptionBind,
    ariaDescribedBy,
    showErrorMessageContent,
  };
}

export type UseBaseFieldReturn = ReturnType<typeof useBaseField>;
