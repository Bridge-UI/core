// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useId, useMemo } from "react";

// ** Core Imports
import { baseFieldSizeProps as sizeProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

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
  "showDescriptionOnError",
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
  /**
   * Public registry key that owns BaseField chrome defaults/tokens.
   * Defaults to `BaseField`; Slider / OtpField pass their own key so chrome
   * cascades (`BaseField` → parent).
   */
  componentName?: "Slider" | "OtpField" | "BaseField";

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
    options.labelHtmlFor ??
    ((controlId: string) => {
      return controlId;
    });

  const { componentProps, inheritedAttrs } = splitComponentProps<
    Omit<BaseFieldProps, "field" | "children">,
    typeof baseFieldBridgeKeys
  >({
    props,
    bridgeKeys: baseFieldBridgeKeys,
  });

  const registryName = options.componentName ?? "BaseField";

  const {
    merged,
    entry: bridgeBaseField,
    chromeEntry: bridgeBaseFieldChrome,
  } = useBridgeUIComponent<
    BaseFieldMerged,
    NonNullable<BaseFieldOptions["componentName"]>
  >({
    libDefaults,
    props: componentProps,
    componentName: registryName,
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
    chromeEntry: bridgeBaseFieldChrome,
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
    const isChromeConsumer = registryName !== "BaseField";

    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      get(bridgeBaseFieldChrome, ["tokens", "size"]),
      isChromeConsumer ? undefined : get(bridgeBaseField, ["tokens", "size"]),
    );

    return get(classes, merged.size ?? "md");
  }, [merged.size, registryName, bridgeBaseField, bridgeBaseFieldChrome]);

  const reservesErrorMessageSpace = derived(() => {
    return (
      !merged.hideErrorMessage &&
      !hasSlotOrProp(slots, "description", merged.description)
    );
  });

  const showErrorMessageContent = derived(() => {
    return (
      invalidated &&
      !merged.hideErrorMessage &&
      hasSlotOrProp(slots, "errorMessage", merged.errorMessage)
    );
  });

  const showDescriptionContent = derived(() => {
    if (!hasSlotOrProp(slots, "description", merged.description)) {
      return false;
    }

    if (!showErrorMessageContent) {
      return true;
    }

    return merged.showDescriptionOnError === true;
  });

  const showErrorMessageRow = derived(() => {
    return showErrorMessageContent || reservesErrorMessageSpace;
  });

  const ariaDescribedBy = derived(() => {
    const ids: string[] = [];

    if (showDescriptionContent) {
      ids.push(`${controlId}-description`);
    }

    if (showErrorMessageContent) {
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

  const fieldCornerProps = derived((): LabelProps => {
    return mergeNestedComponentProps(customProps?.corner, {
      size: merged.size,
      htmlFor: labelHtmlFor(controlId),
      classes: {
        root: cn({
          [mergedClasses.corner ?? ""]: true,
        }),
      },
    });
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
        "mt-1 px-1 text-dark-500 dark:text-dark-400": true,
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
        "mt-1 px-1": true,
        "min-h-[1lh]": reservesErrorMessageSpace,
        "text-error-600 dark:text-error-400": true,
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
    isDisabled,
    isReadonly,
    sizeClasses,
    endSlotBind,
    invalidated,
    startSlotBind,
    mergedClasses,
    fieldLabelProps,
    descriptionBind,
    ariaDescribedBy,
    fieldCornerProps,
    showErrorMessageRow,
    showDescriptionContent,
    showErrorMessageContent,
  };
}

export type UseBaseFieldReturn = ReturnType<typeof useBaseField>;
