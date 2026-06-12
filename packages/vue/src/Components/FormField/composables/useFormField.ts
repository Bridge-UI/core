// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { CircleAlert } from "lucide-vue-next";
import {
  computed,
  type HTMLAttributes,
  type MaybeRefOrGetter,
  toValue,
  useId,
  useSlots,
} from "vue";

// ** Core Imports
import {
  cn,
  type LibDefaultsShape,
  mergeBridgeUILayeredClasses,
  type MergeLibDefaults,
  splitComponentProps,
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
} from "@/Components/FormField/formField.types";
import {
  hasNamedSlot,
  hasSlotOrProp,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export type FormFieldOptions = {
  /**
   * Native control rendered by the field composable (`<input>` vs `<textarea>`).
   *
   * @default "input"
   */
  control?: () => string | undefined;

  /**
   * When the control is a `<textarea>`, use compact TextField-like sizing tokens.
   */
  likeInput?: () => boolean | undefined;
};

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
  "customProps",
  "description",
  "errorMessage",
  "withErrorIcon",
  "withoutErrorMessage",
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
  props: MaybeRefOrGetter<Omit<FormFieldOwnProps, "field">>,
  libDefaults: FormFieldLibDefaults,
  options: FormFieldOptions = {},
) {
  const autoId = useId();
  const slots = useSlots();

  const split = computed(() => {
    return splitComponentProps<
      Omit<FormFieldOwnProps, "field">,
      typeof formFieldBridgeKeys
    >({
      props: toValue(props),
      bridgeKeys: formFieldBridgeKeys,
    });
  });

  const { merged, entry: bridgeFormField } = useBridgeUIComponent<
    FormFieldMerged,
    "FormField"
  >({
    libDefaults,
    componentName: "FormField",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const control = computed(() => {
    return options.control?.() ?? "input";
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<FormFieldClasses>({
    entry: bridgeFormField,
    props: () => split.value.componentProps,
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

  const variantKey = computed(() => {
    return merged.value.variant ?? "outline";
  });

  const errorIcon = computed(() => {
    return merged.value.errorIcon ?? CircleAlert;
  });

  const isNotched = computed(() => {
    return variantKey.value === "notched";
  });

  const isStacked = computed(() => {
    return variantKey.value === "stacked";
  });

  const isUnderlined = computed(() => {
    return variantKey.value === "underlined";
  });

  const isTextareaControl = computed(() => {
    return control.value === "textarea";
  });

  const isTextareaLikeInput = computed(() => {
    return isTextareaControl.value && Boolean(options.likeInput?.());
  });

  const reservesErrorMessageSpace = computed(() => {
    return !merged.value.withoutErrorMessage;
  });

  const controlId = computed(() => {
    const inheritedId = (split.value.inheritedAttrs as HTMLAttributes).id;

    return merged.value.controlId ?? inheritedId ?? autoId;
  });

  const showErrorMessageContent = computed(() => {
    return (
      invalidated.value &&
      hasSlotOrProp(slots, "errorMessage", merged.value.errorMessage)
    );
  });

  const hasInsetLabelRow = computed(() => {
    return (
      (isNotched.value || isStacked.value) &&
      (hasSlotOrProp(slots, "label", merged.value.label) ||
        hasSlotOrProp(slots, "corner", merged.value.corner))
    );
  });

  const headerJustify = computed(() => {
    if (hasSlotOrProp(slots, "label", merged.value.label)) {
      return "justify-between items-end";
    }

    return "justify-end";
  });

  const ariaDescribedBy = computed(() => {
    const ids: string[] = [];

    if (
      !invalidated.value &&
      hasSlotOrProp(slots, "description", merged.value.description)
    ) {
      ids.push(`${controlId.value}-description`);
    }

    if (
      invalidated.value &&
      !merged.value.withoutErrorMessage &&
      hasSlotOrProp(slots, "errorMessage", merged.value.errorMessage)
    ) {
      ids.push(`${controlId.value}-error`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  const sizeClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeFormField.value?.customProps?.size,
    );

    return get(classes, [merged.value.size, variantKey.value]);
  });

  const colorClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeFormField.value?.customProps?.color,
    );

    return get(classes, merged.value.color);
  });

  const roundedClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeFormField.value?.customProps?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const variantClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeFormField.value?.customProps?.variant,
    );

    return get(classes, variantKey.value);
  });

  const focusColorPalette = computed(() => {
    if (invalidated.value) {
      const classes = mergeBridgeUILayeredClasses(
        colorProps,
        bridgeFormField.value?.customProps?.color,
      );

      return get(classes, "error");
    }

    return colorClasses.value;
  });

  const containerColorFocus = computed(() => {
    if (isUnderlined.value) {
      return focusColorPalette.value?.underlined;
    }

    return focusColorPalette.value?.input;
  });

  const stackedBodySpacing = computed(() => {
    if (!isStacked.value) {
      return undefined;
    }

    return cn({
      [sizeClasses.value?.insetTop ?? ""]: true,
      [sizeClasses.value?.insetStart ?? ""]: true,
      [sizeClasses.value?.insetEnd ?? ""]: true,
    });
  });

  const containerSpacing = computed(() => {
    const hasEndSlot = hasNamedSlot(slots, "end");
    const hasStartSlot = hasNamedSlot(slots, "start");

    if (isStacked.value) {
      return undefined;
    }

    if (!hasStartSlot && !hasEndSlot) {
      return sizeClasses.value?.padding;
    }

    return cn({
      [sizeClasses.value?.insetStart ?? ""]: !hasStartSlot,
      [sizeClasses.value?.insetEnd ?? ""]: !hasEndSlot,
    });
  });

  const endBind = computed(() => {
    return mergePartBind(
      customProps.value?.end,
      {},
      cn({
        "shrink-0 self-center flex items-center whitespace-nowrap select-none pointer-events-none": true,
        "text-gray-500": !invalidated.value,
        [roundedClasses.value?.end ?? ""]:
          !isUnderlined.value && !isStacked.value,
        [colorClasses.value?.end ?? ""]: !invalidated.value,
        "group-data-[invalid]:text-error-500": true,
        "text-error-500": invalidated.value,
        [mergedClasses.value.end ?? ""]: true,
      }),
    );
  });

  const rootBind = computed(() => {
    const inherited = split.value.inheritedAttrs as HTMLAttributes;

    return mergePartBind(
      customProps.value?.root,
      {
        class: cn(inherited.class),
        ...omit(inherited, ["class"]),
      },
      cn({
        "group w-full relative": true,
        "aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60": true,
        "aria-readonly:pointer-events-none aria-readonly:select-none": true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const errorBind = computed(() => {
    return mergePartBind(
      customProps.value?.errorMessage,
      {},
      cn({
        "mt-2 text-error-600 dark:text-error-400": true,
        "min-h-[1lh]": reservesErrorMessageSpace.value,
        [sizeClasses.value?.text ?? ""]: true,
        [mergedClasses.value.errorMessage ?? ""]: true,
      }),
    );
  });

  const inputBind = computed(() => {
    return mergePartBind(
      {
        ...customProps.value?.input,
        id: controlId.value,
        disabled: isDisabled.value,
        readonly: isReadonly.value,
        "aria-describedby": ariaDescribedBy.value,
        "aria-invalid": invalidated.value || undefined,
      },
      omit(split.value.inheritedAttrs, ["class"]),
      cn({
        "flex-1 min-w-0 min-h-0 bg-transparent border-0 shadow-none": true,
        "h-full": !isTextareaControl.value && !isStacked.value,
        "max-h-none": isTextareaControl.value,
        "text-gray-900 dark:text-gray-100 placeholder:text-gray-400": true,
        "outline-none ring-0 focus:outline-none focus:ring-0": true,
        "disabled:cursor-not-allowed": true,
        [sizeClasses.value?.input ?? ""]: !isTextareaControl.value,
        [sizeClasses.value?.textarea ?? ""]: isTextareaControl.value,
        [sizeClasses.value?.textareaLikeInput ?? ""]: isTextareaLikeInput.value,
        [mergedClasses.value.input ?? ""]: true,
      }),
    );
  });

  const labelBind = computed(() => {
    return mergePartBind(
      customProps.value?.label,
      {},
      cn({
        "inline-flex items-center gap-x-0.5 font-medium leading-none": true,
        "text-error-600 dark:text-error-400":
          invalidated.value && !isNotched.value,
        "text-gray-700 dark:text-gray-300":
          !invalidated.value && !isNotched.value,
        [sizeClasses.value?.text ?? ""]: true,
        [variantClasses.value?.label ?? ""]: isNotched.value,
        [mergedClasses.value.label ?? ""]: true,
      }),
    );
  });

  const startBind = computed(() => {
    return mergePartBind(
      customProps.value?.start,
      {},
      cn({
        "shrink-0 self-center flex items-center whitespace-nowrap select-none pointer-events-none": true,
        "text-gray-400": !invalidated.value,
        [roundedClasses.value?.start ?? ""]:
          !isUnderlined.value && !isStacked.value,
        [colorClasses.value?.start ?? ""]: !invalidated.value,
        "group-data-[invalid]:text-error-500": true,
        "text-error-500": invalidated.value,
        [mergedClasses.value.start ?? ""]: true,
      }),
    );
  });

  const cornerBind = computed(() => {
    return mergePartBind(
      customProps.value?.corner,
      {},
      cn({
        "text-gray-500 dark:text-gray-400": !isNotched.value,
        [sizeClasses.value?.text ?? ""]: true,
        [variantClasses.value?.corner ?? ""]: isNotched.value,
        [mergedClasses.value.corner ?? ""]: true,
      }),
    );
  });

  const insetLabelRowBind = computed(() => {
    const hasLabel = hasSlotOrProp(slots, "label", merged.value.label);

    return mergePartBind(
      customProps.value?.header,
      {},
      cn({
        flex: true,
        "w-full shrink-0": true,
        "justify-between": hasLabel,
        "justify-end": !hasLabel,
        "items-center": isNotched.value,
        "items-end": isStacked.value,
        [variantClasses.value?.labelRow ?? ""]: hasInsetLabelRow.value,
        [mergedClasses.value.header ?? ""]: true,
      }),
    );
  });

  const headerBind = computed(() => {
    return mergePartBind(
      customProps.value?.header,
      {},
      cn({
        flex: true,
        "mb-1": true,
        [headerJustify.value]: true,
        [mergedClasses.value.header ?? ""]: true,
      }),
    );
  });

  const endIconBind = computed(() => {
    return mergePartBind(
      customProps.value?.endIcon,
      {},
      cn({
        "inline-flex shrink-0 items-center justify-center self-center":
          isStacked.value,
      }),
    );
  });

  const endSlotBind = computed(() => {
    return mergePartBind(
      customProps.value?.end,
      {},
      cn({
        "group/end wrapper-end-slot shrink-0 flex w-auto items-stretch self-stretch [&>*]:min-h-0": true,
        "self-stretch min-h-0 overflow-hidden py-0.5 pe-0.5": isStacked.value,
        "h-full min-h-0 overflow-hidden py-0.5 pe-0.5": !isStacked.value,
        [mergedClasses.value.end ?? ""]: true,
      }),
    );
  });

  const requiredBind = computed(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "text-error-500 dark:text-error-500 select-none": true,
        [mergedClasses.value.required ?? ""]: true,
      }),
    );
  });

  const stackedBodyBind = computed(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "flex min-h-0 min-w-0 flex-1 flex-col": true,
        [stackedBodySpacing.value ?? ""]: true,
      }),
    );
  });

  const stackedInputRowBind = computed(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "flex w-full min-w-0 flex-1 items-stretch gap-x-2": true,
        [sizeClasses.value?.controlRow ?? ""]: true,
      }),
    );
  });

  const containerBind = computed(() => {
    return mergePartBind(
      customProps.value?.container,
      {
        "data-bridge-rounded": merged.value.rounded ?? "md",
      },
      cn({
        "group/field relative flex flex-row items-stretch overflow-hidden":
          isStacked.value,
        "group/field relative flex justify-start gap-x-2 items-stretch":
          !isStacked.value,
        "transition-all ease-in-out duration-150 outline-none": true,
        "bg-gray-100 dark:bg-gray-800": isDisabled.value && !invalidated.value,
        [sizeClasses.value?.container ?? ""]: !isTextareaControl.value,
        [sizeClasses.value?.containerTextareaLikeInput ?? ""]:
          isTextareaLikeInput.value,
        [sizeClasses.value?.containerTextarea ?? ""]:
          isTextareaControl.value && !isTextareaLikeInput.value,
        [variantClasses.value?.container ?? ""]: true,
        [roundedClasses.value?.input ?? ""]: !isUnderlined.value,
        [containerSpacing.value ?? ""]: true,
        [containerColorFocus.value ?? ""]: true,
        "rounded-none": isUnderlined.value,
        "bg-error-50 ring-error-500 focus-within:ring-error-600 dark:ring-error-700 dark:bg-error-700/10 dark:ring-error-600 dark:focus-within:ring-error-600":
          invalidated.value && !isUnderlined.value,
        "border-error-500 focus-within:border-error-600 dark:border-error-600 dark:focus-within:border-error-600":
          invalidated.value && isUnderlined.value,
        [mergedClasses.value.container ?? ""]: true,
      }),
    );
  });

  const startIconBind = computed(() => {
    return mergePartBind(
      customProps.value?.startIcon,
      {},
      cn({
        "inline-flex shrink-0 items-center justify-center self-center":
          isStacked.value,
      }),
    );
  });

  const startSlotBind = computed(() => {
    return mergePartBind(
      customProps.value?.start,
      {},
      cn({
        "group/start wrapper-start-slot shrink-0 flex w-auto items-stretch self-stretch [&>*]:min-h-0": true,
        "self-stretch min-h-0 overflow-hidden py-0.5 ps-0.5": isStacked.value,
        "h-full min-h-0 overflow-hidden py-0.5 ps-0.5": !isStacked.value,
        [mergedClasses.value.start ?? ""]: true,
      }),
    );
  });

  const descriptionBind = computed(() => {
    return mergePartBind(
      customProps.value?.description,
      {},
      cn({
        "mt-2 text-gray-500 dark:text-gray-400": true,
        [sizeClasses.value?.text ?? ""]: true,
        [mergedClasses.value.description ?? ""]: true,
      }),
    );
  });

  return {
    slots,
    merged,
    control,
    endBind,
    rootBind,
    controlId,
    errorBind,
    errorIcon,
    inputBind,
    isNotched,
    isStacked,
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
    stackedBodyBind,
    hasInsetLabelRow,
    insetLabelRowBind,
    stackedInputRowBind,
    showErrorMessageContent,
    reservesErrorMessageSpace,
  };
}

export type UseFormFieldReturn = ReturnType<typeof useFormField>;
