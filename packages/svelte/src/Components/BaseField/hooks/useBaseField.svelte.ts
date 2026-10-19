// ** External Imports
import { get, omit } from "es-toolkit/compat";

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
  BaseFieldSnippets,
} from "@/Components/BaseField/baseField.types";
import type { LabelProps } from "@/Components/Label/label.types";
import {
  isPropPresent,
  mergeNestedComponentProps,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export type BaseFieldOptions = {
  /**
   * Fallback control id, from `$props.id()` in the owning component.
   */
  autoId: string;

  /**
   * Public registry key that owns BaseField chrome defaults/tokens.
   * Defaults to `BaseField`; Rating / Slider / OtpField / FileUpload pass their own key
   * so chrome cascades (`BaseField` → parent).
   */
  componentName?: "Rating" | "Slider" | "OtpField" | "BaseField" | "FileUpload";

  /**
   * Resolve `Label` `for` from `controlId`. Defaults to the control id itself.
   */
  labelHtmlFor?: (controlId: string) => string;
};

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

const baseFieldSnippetKeys = [
  "end",
  "start",
  "children",
] as const satisfies readonly (keyof BaseFieldSnippets)[];

type BaseFieldLibDefaults = LibDefaultsShape<
  BaseFieldOwnProps,
  "size" | "error" | "hideErrorMessage"
>;

type BaseFieldMerged = MergeLibDefaults<
  BaseFieldOwnProps,
  BaseFieldLibDefaults
>;

/**
 * Composes shared vertical field chrome: label, corner, start/end slots,
 * description, and error message.
 */
export function useBaseField(
  props: () => BaseFieldProps,
  libDefaults: BaseFieldLibDefaults = {
    size: "md",
    error: false,
    hideErrorMessage: false,
  },
  options: BaseFieldOptions,
) {
  const split = $derived.by(() => {
    const { componentProps, inheritedAttrs } = splitComponentProps<
      BaseFieldOwnProps,
      typeof baseFieldBridgeKeys
    >({
      bridgeKeys: baseFieldBridgeKeys,
      props: { ...props() },
    });

    return {
      componentProps,
      // Snippets render inside the field; they are not element attributes.
      inheritedAttrs: omit(inheritedAttrs, baseFieldSnippetKeys),
    };
  });

  const registryName = options.componentName ?? "BaseField";

  const chrome =
    registryName === "BaseField" || registryName === "FileUpload"
      ? undefined
      : "BaseField";

  const bridgeBaseField = useBridgeUIComponent<
    BaseFieldMerged,
    NonNullable<BaseFieldOptions["componentName"]>
  >({
    chrome,
    libDefaults,
    componentName: registryName,
    props: () => split.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<BaseFieldClasses>(
    () => {
      return {
        entry: bridgeBaseField.entry,
        chromeEntry: bridgeBaseField.chromeEntry,
        props: split.componentProps,
      };
    },
  );

  const customProps = $derived.by(() => {
    return bridgeBaseField.merged.customProps;
  });

  const invalidated = $derived.by(() => {
    return bridgeBaseField.merged.error === true;
  });

  const isDisabled = $derived.by(() => {
    return Boolean(bridgeBaseField.merged.disabled);
  });

  const isReadonly = $derived.by(() => {
    return Boolean(bridgeBaseField.merged.readonly);
  });

  const controlId = $derived.by(() => {
    return (
      bridgeBaseField.merged.controlId ??
      (split.inheritedAttrs as { class?: string; id?: string }).id ??
      options.autoId
    );
  });

  const sizeClasses = $derived.by(() => {
    const isChromeConsumer = registryName !== "BaseField";

    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      get(bridgeBaseField.chromeEntry, ["tokens", "size"]),
      isChromeConsumer
        ? undefined
        : get(bridgeBaseField.entry, ["tokens", "size"]),
    );

    return get(classes, bridgeBaseField.merged.size ?? "md");
  });

  const reservesErrorMessageSpace = $derived.by(() => {
    return (
      !bridgeBaseField.merged.hideErrorMessage &&
      !isPropPresent(bridgeBaseField.merged.description)
    );
  });

  const showErrorMessageContent = $derived.by(() => {
    return (
      invalidated &&
      !bridgeBaseField.merged.hideErrorMessage &&
      isPropPresent(bridgeBaseField.merged.errorMessage)
    );
  });

  const showDescriptionContent = $derived.by(() => {
    if (!isPropPresent(bridgeBaseField.merged.description)) {
      return false;
    }

    if (!showErrorMessageContent) {
      return true;
    }

    return bridgeBaseField.merged.showDescriptionOnError === true;
  });

  const showErrorMessageRow = $derived.by(() => {
    return showErrorMessageContent || reservesErrorMessageSpace;
  });

  const ariaDescribedBy = $derived.by(() => {
    const ids: string[] = [];

    if (showDescriptionContent) {
      ids.push(`${controlId}-description`);
    }

    if (showErrorMessageContent) {
      ids.push(`${controlId}-error`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  const rootBind = $derived.by(() => {
    return mergePartBind(
      customProps?.root,
      {
        class: cn(
          (split.inheritedAttrs as { class?: string; id?: string }).class,
        ),
        ...omit(split.inheritedAttrs, ["class", "id"]),
      },
      cn({
        "group w-full relative": true,
        "aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60": true,
        "aria-readonly:pointer-events-none aria-readonly:select-none": true,
        [mergedClasses().root ?? ""]: true,
      }),
    );
  });

  const headerBind = $derived.by(() => {
    return mergePartBind(
      customProps?.header,
      {},
      cn({
        "flex w-full gap-x-2 mb-1.5": true,
        "justify-between items-end": isPropPresent(
          bridgeBaseField.merged.label,
        ),
        "justify-end": !isPropPresent(bridgeBaseField.merged.label),
        [mergedClasses().header ?? ""]: true,
      }),
    );
  });

  const fieldCornerProps = $derived.by((): LabelProps => {
    const resolveLabelFor =
      options.labelHtmlFor ??
      ((id: string) => {
        return id;
      });

    return mergeNestedComponentProps(customProps?.corner, {
      size: bridgeBaseField.merged.size,
      for: resolveLabelFor(controlId),
      classes: {
        root: cn({
          [mergedClasses().corner ?? ""]: true,
        }),
      },
    });
  });

  const groupBind = $derived.by(() => {
    return mergePartBind(
      customProps?.group,
      {
        role: "group",
        id: controlId,
        "aria-describedby": ariaDescribedBy,
        "aria-disabled": isDisabled || undefined,
        "aria-invalid": invalidated || undefined,
      },
      cn({
        "flex flex-wrap items-center": true,
        [sizeClasses?.group ?? ""]: true,
        [mergedClasses().group ?? ""]: true,
      }),
    );
  });

  const startSlotBind = $derived.by(() => {
    return mergePartBind(
      customProps?.start,
      {},
      cn({
        "group/start wrapper-start-slot shrink-0 flex items-center [&>*]:min-h-0": true,
        [mergedClasses().start ?? ""]: true,
      }),
    );
  });

  const endSlotBind = $derived.by(() => {
    return mergePartBind(
      customProps?.end,
      {},
      cn({
        "group/end wrapper-end-slot shrink-0 flex items-center [&>*]:min-h-0": true,
        [mergedClasses().end ?? ""]: true,
      }),
    );
  });

  const descriptionBind = $derived.by(() => {
    return mergePartBind(
      customProps?.description,
      {},
      cn({
        "mt-1 px-1 text-dark-500 dark:text-dark-400": true,
        [sizeClasses?.text ?? ""]: true,
        [mergedClasses().description ?? ""]: true,
      }),
    );
  });

  const errorBind = $derived.by(() => {
    return mergePartBind(
      customProps?.errorMessage,
      {},
      cn({
        "mt-1 px-1": true,
        "min-h-[1lh]": reservesErrorMessageSpace,
        "text-error-600 dark:text-error-400": true,
        [sizeClasses?.text ?? ""]: true,
        [mergedClasses().errorMessage ?? ""]: true,
      }),
    );
  });

  const fieldLabelProps = $derived.by((): LabelProps => {
    const resolveLabelFor =
      options.labelHtmlFor ??
      ((id: string) => {
        return id;
      });

    return mergeNestedComponentProps(customProps?.label, {
      size: bridgeBaseField.merged.size,
      error: invalidated,
      required: bridgeBaseField.merged.required,
      for: resolveLabelFor(controlId),
      classes: {
        required: mergedClasses().required,
        root: cn({
          [mergedClasses().label ?? ""]: true,
        }),
      },
    });
  });

  return {
    get merged() {
      return bridgeBaseField.merged;
    },
    get rootBind() {
      return rootBind;
    },
    get errorBind() {
      return errorBind;
    },
    get groupBind() {
      return groupBind;
    },
    get controlId() {
      return controlId;
    },
    get headerBind() {
      return headerBind;
    },
    get isDisabled() {
      return isDisabled;
    },
    get isReadonly() {
      return isReadonly;
    },
    get sizeClasses() {
      return sizeClasses;
    },
    get endSlotBind() {
      return endSlotBind;
    },
    get invalidated() {
      return invalidated;
    },
    get startSlotBind() {
      return startSlotBind;
    },
    get mergedClasses() {
      return mergedClasses;
    },
    get ariaDescribedBy() {
      return ariaDescribedBy;
    },
    get fieldLabelProps() {
      return fieldLabelProps;
    },
    get descriptionBind() {
      return descriptionBind;
    },
    get fieldCornerProps() {
      return fieldCornerProps;
    },
    get showErrorMessageRow() {
      return showErrorMessageRow;
    },
    get showDescriptionContent() {
      return showDescriptionContent;
    },
    get showErrorMessageContent() {
      return showErrorMessageContent;
    },
  };
}

export type UseBaseFieldReturn = ReturnType<typeof useBaseField>;
