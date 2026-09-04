// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  computed,
  toValue,
  useAttrs,
  useId,
  useSlots,
  type HTMLAttributes,
  type MaybeRefOrGetter,
} from "vue";

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
} from "@/Components/BaseField/baseField.types";
import type { LabelProps } from "@/Components/Label/label.types";
import {
  hasSlotOrProp,
  mergeNestedComponentProps,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export type BaseFieldOptions = {
  /**
   * Public registry key that owns BaseField chrome defaults/tokens.
   * Defaults to `BaseField`; Slider / OtpField pass their own key so chrome
   * cascades (`BaseField` → parent).
   */
  componentName?: "Slider" | "OtpField" | "BaseField";

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
] as const satisfies readonly (keyof Omit<BaseFieldOwnProps, "field">)[];

type BaseFieldLibDefaults = LibDefaultsShape<
  Omit<BaseFieldOwnProps, "field">,
  "size" | "error" | "hideErrorMessage"
>;

type BaseFieldMerged = MergeLibDefaults<
  Omit<BaseFieldOwnProps, "field">,
  BaseFieldLibDefaults
>;

/**
 * Composes shared vertical field chrome: label, corner, start/end slots,
 * description, and error message.
 */
export function useBaseField(
  props: MaybeRefOrGetter<Omit<BaseFieldOwnProps, "field">>,
  libDefaults: BaseFieldLibDefaults = {
    size: "md",
    error: false,
    hideErrorMessage: false,
  },
  options: BaseFieldOptions = {},
) {
  const attrs = useAttrs();
  const slots = useSlots();
  const autoId = useId();

  const split = computed(() => {
    return splitComponentProps<
      Omit<BaseFieldOwnProps, "field">,
      typeof baseFieldBridgeKeys
    >({
      bridgeKeys: baseFieldBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
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
    componentName: registryName,
    props: () => {
      return split.value.componentProps;
    },
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<BaseFieldClasses>({
    entry: bridgeBaseField,
    chromeEntry: bridgeBaseFieldChrome,
    props: () => {
      return split.value.componentProps;
    },
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const invalidated = computed(() => {
    return merged.value.error === true;
  });

  const isDisabled = computed(() => {
    return Boolean(merged.value.disabled);
  });

  const isReadonly = computed(() => {
    return Boolean(merged.value.readonly);
  });

  const controlId = computed(() => {
    return (
      merged.value.controlId ??
      (split.value.inheritedAttrs as HTMLAttributes).id ??
      autoId
    );
  });

  const sizeClasses = computed(() => {
    const isChromeConsumer = registryName !== "BaseField";

    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      get(bridgeBaseFieldChrome.value, ["tokens", "size"]),
      isChromeConsumer
        ? undefined
        : get(bridgeBaseField.value, ["tokens", "size"]),
    );

    return get(classes, merged.value.size ?? "md");
  });

  const reservesErrorMessageSpace = computed(() => {
    return (
      !merged.value.hideErrorMessage &&
      !hasSlotOrProp(slots, "description", merged.value.description)
    );
  });

  const showErrorMessageContent = computed(() => {
    return (
      invalidated.value &&
      !merged.value.hideErrorMessage &&
      hasSlotOrProp(slots, "errorMessage", merged.value.errorMessage)
    );
  });

  const showDescriptionContent = computed(() => {
    if (!hasSlotOrProp(slots, "description", merged.value.description)) {
      return false;
    }

    if (!showErrorMessageContent.value) {
      return true;
    }

    return merged.value.showDescriptionOnError === true;
  });

  const showErrorMessageRow = computed(() => {
    return showErrorMessageContent.value || reservesErrorMessageSpace.value;
  });

  const ariaDescribedBy = computed(() => {
    const ids: string[] = [];

    if (showDescriptionContent.value) {
      ids.push(`${controlId.value}-description`);
    }

    if (showErrorMessageContent.value) {
      ids.push(`${controlId.value}-error`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      {
        class: cn((split.value.inheritedAttrs as HTMLAttributes).class),
        ...omit(split.value.inheritedAttrs, ["class", "id"]),
      },
      cn({
        "group w-full relative": true,
        "aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60": true,
        "aria-readonly:pointer-events-none aria-readonly:select-none": true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const headerBind = computed(() => {
    return mergePartBind(
      customProps.value?.header,
      {},
      cn({
        "flex w-full gap-x-2 mb-1.5": true,
        "justify-between items-end": hasSlotOrProp(
          slots,
          "label",
          merged.value.label,
        ),
        "justify-end": !hasSlotOrProp(slots, "label", merged.value.label),
        [mergedClasses.value.header ?? ""]: true,
      }),
    );
  });

  const fieldCornerProps = computed((): LabelProps => {
    const resolveLabelFor =
      options.labelHtmlFor ??
      ((id: string) => {
        return id;
      });

    return mergeNestedComponentProps(customProps.value?.corner, {
      size: merged.value.size,
      for: resolveLabelFor(controlId.value),
      classes: {
        root: cn({
          [mergedClasses.value.corner ?? ""]: true,
        }),
      },
    });
  });

  const groupBind = computed(() => {
    return mergePartBind(
      customProps.value?.group,
      {
        role: "group",
        id: controlId.value,
        "aria-describedby": ariaDescribedBy.value,
        "aria-disabled": isDisabled.value || undefined,
        "aria-invalid": invalidated.value || undefined,
      },
      cn({
        "flex flex-wrap items-center": true,
        [sizeClasses.value?.group ?? ""]: true,
        [mergedClasses.value.group ?? ""]: true,
      }),
    );
  });

  const startSlotBind = computed(() => {
    return mergePartBind(
      customProps.value?.start,
      {},
      cn({
        "group/start wrapper-start-slot shrink-0 flex items-center [&>*]:min-h-0": true,
        [mergedClasses.value.start ?? ""]: true,
      }),
    );
  });

  const endSlotBind = computed(() => {
    return mergePartBind(
      customProps.value?.end,
      {},
      cn({
        "group/end wrapper-end-slot shrink-0 flex items-center [&>*]:min-h-0": true,
        [mergedClasses.value.end ?? ""]: true,
      }),
    );
  });

  const descriptionBind = computed(() => {
    return mergePartBind(
      customProps.value?.description,
      {},
      cn({
        "mt-1 px-1 text-dark-500 dark:text-dark-400": true,
        [sizeClasses.value?.text ?? ""]: true,
        [mergedClasses.value.description ?? ""]: true,
      }),
    );
  });

  const errorBind = computed(() => {
    return mergePartBind(
      customProps.value?.errorMessage,
      {},
      cn({
        "mt-1 px-1": true,
        "min-h-[1lh]": reservesErrorMessageSpace.value,
        "text-error-600 dark:text-error-400": true,
        [sizeClasses.value?.text ?? ""]: true,
        [mergedClasses.value.errorMessage ?? ""]: true,
      }),
    );
  });

  const fieldLabelProps = computed((): LabelProps => {
    const resolveLabelFor =
      options.labelHtmlFor ??
      ((id: string) => {
        return id;
      });

    return mergeNestedComponentProps(customProps.value?.label, {
      size: merged.value.size,
      error: invalidated.value,
      required: merged.value.required,
      for: resolveLabelFor(controlId.value),
      classes: {
        required: mergedClasses.value.required,
        root: cn({
          [mergedClasses.value.label ?? ""]: true,
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
    ariaDescribedBy,
    fieldLabelProps,
    descriptionBind,
    fieldCornerProps,
    showErrorMessageRow,
    showDescriptionContent,
    showErrorMessageContent,
  };
}

export type UseBaseFieldReturn = ReturnType<typeof useBaseField>;
