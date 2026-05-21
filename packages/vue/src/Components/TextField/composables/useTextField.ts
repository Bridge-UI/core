// ** External Imports
import { get } from "es-toolkit/compat";
import { CircleAlert } from "lucide-vue-next";
import { computed, useAttrs, useId, useSlots } from "vue";

// ** Core Imports
import { cn, mergeBridgeUILayeredClasses } from "@bridge-ui/core";
import {
  colorProps,
  roundedProps,
  sizeProps,
  variantProps,
  type TextFieldColor,
  type TextFieldRounded,
} from "@bridge-ui/core/Components/TextField";

// ** Local Imports
import type {
  TextFieldClasses,
  TextFieldOwnProps,
} from "@/Components/TextField/textField.types";
import {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  mergePartBind,
  splitComponentProps,
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
  "errorless",
  "startIcon",
  "partsProps",
  "description",
  "withErrorIcon",
] as const satisfies readonly (keyof TextFieldOwnProps)[];

const errorIcon = CircleAlert;

export function useTextField(
  props: TextFieldOwnProps,
  libDefaults: Partial<TextFieldOwnProps> = {
    size: "md",
    rounded: "md",
    color: "primary",
    variant: "outline",
    withErrorIcon: true,
  },
) {
  // Setup
  const slots = useSlots();
  const attrs = useAttrs();
  const autoId = useId();

  const { userClass, propsForMerge } = splitComponentProps(props, attrs, {
    bridgeKeys: textFieldBridgeKeys,
    classKey: "class",
  });

  const { entry: bridgeTextField, merged } = useBridgeUIComponent({
    libDefaults,
    props: propsForMerge,
    componentName: "TextField",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TextFieldClasses>({
    entry: bridgeTextField,
    props: propsForMerge,
  });

  // Registry maps
  const mergedColorProps = computed(() => {
    return mergeBridgeUILayeredClasses(
      colorProps,
      bridgeTextField.value?.customProps?.color,
    );
  });

  const mergedVariantProps = computed(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeTextField.value?.customProps?.variant,
    );
  });

  const mergedRoundedMap = computed(() => {
    return mergeBridgeUILayeredClasses<TextFieldRounded>(
      roundedProps,
      bridgeTextField.value?.customProps?.rounded,
    );
  });

  const mergedSizeMap = computed(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeTextField.value?.customProps?.size,
    );
  });

  // Theme
  const variantKey = computed(() => {
    return merged.value.variant ?? "outline";
  });

  const colorKey = computed(() => {
    return (merged.value.color ?? "primary") as keyof TextFieldColor;
  });

  const roundedKey = computed(() => {
    return merged.value.rounded ?? "md";
  });

  const sizeKey = computed(() => {
    return merged.value.size ?? "md";
  });

  const variantPalette = computed(() => {
    return get(mergedVariantProps.value, variantKey.value);
  });

  const colorPalette = computed(() => {
    return get(mergedColorProps.value, colorKey.value);
  });

  const roundedPalette = computed(() => {
    return get(mergedRoundedMap.value, roundedKey.value);
  });

  const sizePalette = computed(() => {
    return get(mergedSizeMap.value, sizeKey.value);
  });

  const isUnderlined = computed(() => {
    return variantKey.value === "underlined";
  });

  // State
  const inputId = computed(() => {
    return (attrs.id as string | undefined) ?? autoId;
  });

  const isDisabled = computed(() => {
    return Boolean(merged.value.disabled);
  });

  const isReadonly = computed(() => {
    return Boolean(merged.value.readonly);
  });

  const invalidated = computed(() => {
    return Boolean(merged.value.error);
  });

  const focusColorPalette = computed(() => {
    if (invalidated.value) {
      return get(mergedColorProps.value, "error");
    }

    return colorPalette.value;
  });

  const hasStartSlot = computed(() => {
    return hasNamedSlot(slots, "start");
  });

  const hasEndSlot = computed(() => {
    return hasNamedSlot(slots, "end");
  });

  const headerJustify = computed(() => {
    if (hasSlotOrProp(slots, "label", merged.value.label)) {
      return "justify-between items-end";
    }

    return "justify-end";
  });

  // Visibility
  const showHeader = computed(() => {
    return (
      hasSlotOrProp(slots, "label", merged.value.label) ||
      hasSlotOrProp(slots, "corner", merged.value.corner)
    );
  });

  const showStartText = computed(() => {
    return isPropPresent(merged.value.start) && !hasStartSlot.value;
  });

  const showStartIcon = computed(() => {
    return (
      !hasStartSlot.value &&
      !showStartText.value &&
      merged.value.startIcon != null
    );
  });

  const showEndText = computed(() => {
    return isPropPresent(merged.value.end) && !hasEndSlot.value;
  });

  const showErrorIcon = computed(() => {
    return (
      !hasEndSlot.value &&
      invalidated.value &&
      !showEndText.value &&
      !merged.value.errorless &&
      merged.value.withErrorIcon !== false
    );
  });

  const showEndIcon = computed(() => {
    return (
      !hasEndSlot.value &&
      !showEndText.value &&
      !showErrorIcon.value &&
      merged.value.endIcon != null
    );
  });

  const containerSpacing = computed(() => {
    if (!hasStartSlot.value && !hasEndSlot.value) {
      return sizePalette.value?.padding;
    }

    return cn(
      "gap-x-2",
      !hasStartSlot.value && sizePalette.value?.insetStart,
      !hasEndSlot.value && sizePalette.value?.insetEnd,
    );
  });

  const containerColorFocus = computed(() => {
    if (isUnderlined.value) {
      return focusColorPalette.value?.underlined;
    }

    return focusColorPalette.value?.input;
  });

  const showDescription = computed(() => {
    return (
      !invalidated.value &&
      hasSlotOrProp(slots, "description", merged.value.description)
    );
  });

  const showError = computed(() => {
    return (
      !merged.value.errorless &&
      invalidated.value &&
      hasSlotOrProp(slots, "error", merged.value.error)
    );
  });

  // Root
  const rootClass = computed(() => {
    return cn(
      "group w-full relative",
      "aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60",
      "aria-readonly:pointer-events-none aria-readonly:select-none",
      mergedClasses.value.root,
      userClass,
    );
  });

  // Header
  const headerClass = computed(() => {
    return cn("flex mb-1", headerJustify.value, mergedClasses.value.header);
  });

  const cornerClass = computed(() => {
    return cn(
      "text-sm text-gray-500 dark:text-gray-400",
      mergedClasses.value.corner,
    );
  });

  // Container
  // prettier-ignore
  const containerClass = computed(() => {
    return cn(
      "group/field relative flex justify-between gap-x-2 items-center",
      "transition-all ease-in-out duration-150",
      "outline-none",
      variantPalette.value?.container,
      variantPalette.value?.input,
      !isUnderlined.value && roundedPalette.value?.input,
      isUnderlined.value && "rounded-none",
      containerColorFocus.value,
      containerSpacing.value,
      (hasStartSlot.value || hasEndSlot.value) && sizePalette.value?.container,
      {
        "bg-gray-100 dark:bg-gray-800": isDisabled.value && !invalidated.value,
        "bg-error-50 ring-error-500 focus-within:ring-error-600 dark:ring-error-700 dark:bg-error-700/10 dark:ring-error-600 dark:focus-within:ring-error-600": invalidated.value && !isUnderlined.value,
        "border-error-500 focus-within:border-error-600 dark:border-error-600 dark:focus-within:border-error-600": invalidated.value && isUnderlined.value,
      },
      mergedClasses.value.container,
    );
  });

  const startIconClass = computed(() => {
    return cn(
      "text-gray-400 pointer-events-none select-none flex items-center whitespace-nowrap",
      "group-data-[invalid]:text-error-500",
      { "text-error-500": invalidated.value },
      !invalidated.value && colorPalette.value?.start,
      !isUnderlined.value && roundedPalette.value?.start,
      mergedClasses.value.start,
    );
  });

  const endIconClass = computed(() => {
    return cn(
      "text-gray-500 pointer-events-none select-none flex items-center whitespace-nowrap",
      "group-data-[invalid]:text-error-500",
      { "text-error-500": invalidated.value },
      !invalidated.value && colorPalette.value?.end,
      !isUnderlined.value && roundedPalette.value?.end,
      mergedClasses.value.end,
    );
  });

  const startSlotClass = computed(() => {
    return cn(
      "group/start wrapper-start-slot shrink-0 flex items-center self-stretch py-0.5 ps-0.5",
      mergedClasses.value.start,
    );
  });

  const endSlotClass = computed(() => {
    return cn(
      "group/end wrapper-end-slot shrink-0 flex items-center self-stretch py-0.5 pe-0.5",
      mergedClasses.value.end,
    );
  });

  // Input
  const inputClass = computed(() => {
    return cn(
      "flex-1 min-w-0 bg-transparent border-0 shadow-none",
      "outline-none ring-0 focus:outline-none focus:ring-0",
      "text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
      "disabled:cursor-not-allowed",
      sizePalette.value?.input,
      mergedClasses.value.input,
    );
  });

  // Footer
  const descriptionClass = computed(() => {
    return cn(
      "mt-2 text-sm text-gray-500 dark:text-gray-400",
      mergedClasses.value.description,
    );
  });

  const errorClass = computed(() => {
    return cn(
      "mt-2 text-sm text-error-600 dark:text-error-400",
      mergedClasses.value.error,
    );
  });

  const ariaDescribedBy = computed(() => {
    const ids: string[] = [];

    if (showDescription.value) {
      ids.push(`${inputId.value}-description`);
    }

    if (showError.value) {
      ids.push(`${inputId.value}-error`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  // Parts
  const partsProps = computed(() => {
    return merged.value.partsProps;
  });

  const rootBind = computed(() => {
    return mergePartBind(partsProps.value?.root, rootClass.value);
  });

  const headerBind = computed(() => {
    return mergePartBind(partsProps.value?.header, headerClass.value);
  });

  const labelBind = computed(() => {
    return mergePartBind(
      partsProps.value?.label,
      cn(mergedClasses.value.label),
    );
  });

  const cornerBind = computed(() => {
    return mergePartBind(partsProps.value?.corner, cornerClass.value);
  });

  const containerBind = computed(() => {
    return mergePartBind(partsProps.value?.container, containerClass.value);
  });

  const startBind = computed(() => {
    return mergePartBind(partsProps.value?.start, startIconClass.value);
  });

  const endBind = computed(() => {
    return mergePartBind(partsProps.value?.end, endIconClass.value);
  });

  const startSlotBind = computed(() => {
    return mergePartBind(partsProps.value?.start, startSlotClass.value);
  });

  const endSlotBind = computed(() => {
    return mergePartBind(partsProps.value?.end, endSlotClass.value);
  });

  const inputBind = computed(() => {
    return mergePartBind(
      {
        ...attrs,
        ...partsProps.value?.input,
        id: inputId.value,
        disabled: isDisabled.value,
        readonly: isReadonly.value,
        "aria-invalid": invalidated.value || undefined,
        "aria-describedby": ariaDescribedBy.value,
      },
      inputClass.value,
    );
  });

  const startIconBind = computed(() => {
    return mergePartBind(partsProps.value?.startIcon, "");
  });

  const endIconBind = computed(() => {
    return mergePartBind(partsProps.value?.endIcon, "");
  });

  const descriptionBind = computed(() => {
    return mergePartBind(partsProps.value?.description, descriptionClass.value);
  });

  const errorBind = computed(() => {
    return mergePartBind(partsProps.value?.error, errorClass.value);
  });

  return {
    slots,
    merged,
    endBind,
    inputId,
    rootBind,
    errorBind,
    errorIcon,
    inputBind,
    labelBind,
    showError,
    startBind,
    cornerBind,
    hasEndSlot,
    headerBind,
    isDisabled,
    isReadonly,
    showHeader,
    endIconBind,
    endSlotBind,
    invalidated,
    showEndIcon,
    showEndText,
    hasStartSlot,
    containerBind,
    showErrorIcon,
    showStartIcon,
    showStartText,
    startIconBind,
    startSlotBind,
    descriptionBind,
    showDescription,
  };
}
