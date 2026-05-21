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
  mergePartBind,
  splitComponentProps,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const textFieldBridgeKeys = [
  "classes",
  "color",
  "corner",
  "description",
  "disabled",
  "endIcon",
  "error",
  "errorless",
  "label",
  "modelValue",
  "partsProps",
  "readonly",
  "rounded",
  "size",
  "startIcon",
  "variant",
  "withErrorIcon",
] as const satisfies readonly (keyof TextFieldOwnProps)[];

const errorIcon = CircleAlert;

export function useTextField(
  props: TextFieldOwnProps,
  libDefaults: Partial<TextFieldOwnProps>,
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

  const sizeClass = computed(() => {
    return get(mergedSizeMap.value, sizeKey.value);
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

  const hasStartSlot = computed(() => {
    return hasNamedSlot(slots, "start");
  });

  const hasEndSlot = computed(() => {
    return hasNamedSlot(slots, "end");
  });

  const headerJustify = computed(() => {
    return hasSlotOrProp(slots, "label", merged.value.label)
      ? "justify-between items-end"
      : "justify-end";
  });

  // Visibility
  const showHeader = computed(() => {
    return (
      hasSlotOrProp(slots, "label", merged.value.label) ||
      hasSlotOrProp(slots, "corner", merged.value.corner)
    );
  });

  const showStartIcon = computed(() => {
    return merged.value.startIcon != null && !hasStartSlot.value;
  });

  const showEndIcon = computed(() => {
    return merged.value.endIcon != null && !hasEndSlot.value;
  });

  const showErrorIcon = computed(() => {
    return (
      !hasEndSlot.value &&
      invalidated.value &&
      !showEndIcon.value &&
      !merged.value.errorless &&
      merged.value.withErrorIcon !== false
    );
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
      "w-full relative",
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

  const labelClass = computed(() => {
    return cn(
      "text-sm font-medium text-gray-700 dark:text-gray-300",
      mergedClasses.value.label,
    );
  });

  const cornerClass = computed(() => {
    return cn(
      "text-sm text-gray-500 dark:text-gray-400",
      mergedClasses.value.corner,
    );
  });

  // Container
  const containerClass = computed(() => {
    return cn(
      "relative flex justify-between gap-x-2 items-center",
      "transition-all ease-in-out duration-150",
      "outline-0",
      variantPalette.value?.container,
      variantPalette.value?.input,
      roundedPalette.value?.input,
      colorPalette.value?.input,
      sizeClass.value,
      {
        "ps-3": !hasStartSlot.value && !showStartIcon.value,
        "pe-3": !hasEndSlot.value && !showEndIcon.value && !showErrorIcon.value,
        "py-2": !hasStartSlot.value && !hasEndSlot.value,
        "h-10": hasStartSlot.value || hasEndSlot.value,
        "bg-gray-100 dark:bg-gray-800": isDisabled.value && !invalidated.value,
        "bg-error-50 ring-error-500 dark:ring-error-700 dark:bg-error-700/10 dark:ring-error-600":
          invalidated.value,
      },
      mergedClasses.value.container,
    );
  });

  const startClass = computed(() => {
    return cn(
      "text-gray-400 pointer-events-none select-none flex items-center whitespace-nowrap",
      "input-focus:text-error-500",
      { "text-error-500": invalidated.value },
      variantPalette.value?.start,
      roundedPalette.value?.start,
      colorPalette.value?.start,
      mergedClasses.value.start,
    );
  });

  const endClass = computed(() => {
    return cn(
      "text-gray-500 pointer-events-none select-none flex items-center whitespace-nowrap",
      "input-focus:text-error-500",
      { "text-error-500": invalidated.value },
      variantPalette.value?.end,
      roundedPalette.value?.end,
      colorPalette.value?.end,
      mergedClasses.value.end,
    );
  });

  const startSlotClass =
    "group/start wrapper-start-slot flex h-full py-0.5 ps-0.5";

  const endSlotClass =
    "group/end wrapper-end-slot shrink-0 flex h-full py-0.5 pe-0.5";

  // Input
  const inputClass = computed(() => {
    return cn(
      "flex-1 min-w-0 bg-transparent border-0 outline-none shadow-none",
      "text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
      "disabled:cursor-not-allowed",
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
    return mergePartBind(partsProps.value?.label, labelClass.value);
  });

  const cornerBind = computed(() => {
    return mergePartBind(partsProps.value?.corner, cornerClass.value);
  });

  const containerBind = computed(() => {
    return mergePartBind(partsProps.value?.container, containerClass.value);
  });

  const startBind = computed(() => {
    return mergePartBind(partsProps.value?.start, startClass.value);
  });

  const endBind = computed(() => {
    return mergePartBind(partsProps.value?.end, endClass.value);
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
        value: merged.value.modelValue,
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
    invalidated,
    showEndIcon,
    endSlotClass,
    hasStartSlot,
    containerBind,
    showErrorIcon,
    showStartIcon,
    startIconBind,
    startSlotClass,
    descriptionBind,
    showDescription,
  };
}
