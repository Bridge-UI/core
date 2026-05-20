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
  const variantKey = computed(() => merged.value.variant ?? "outline");

  const colorKey = computed(
    () => (merged.value.color ?? "primary") as keyof TextFieldColor,
  );

  const roundedKey = computed(() => merged.value.rounded ?? "md");

  const sizeKey = computed(() => merged.value.size ?? "md");

  const variantPalette = computed(() => {
    return get(mergedVariantProps.value, variantKey.value);
  });

  const colorPalette = computed(() => {
    return get(mergedColorProps.value, colorKey.value);
  });

  const roundedPalette = computed(() => {
    return get(mergedRoundedMap.value, roundedKey.value);
  });

  const sizeClass = computed(() => get(mergedSizeMap.value, sizeKey.value));

  // State
  const inputId = computed(() => (attrs.id as string | undefined) ?? autoId);

  const isDisabled = computed(() => Boolean(merged.value.disabled));

  const isReadonly = computed(() => Boolean(merged.value.readonly));

  const invalidated = computed(() => Boolean(merged.value.error));

  const hasStartSlot = computed(() => hasNamedSlot(slots, "start"));

  const hasEndSlot = computed(() => hasNamedSlot(slots, "end"));

  const headerJustify = computed(() =>
    hasSlotOrProp(slots, "label", merged.value.label)
      ? "justify-between items-end"
      : "justify-end",
  );

  // Visibility
  const showHeader = computed(
    () =>
      hasSlotOrProp(slots, "label", merged.value.label) ||
      hasSlotOrProp(slots, "corner", merged.value.corner),
  );

  const showStartIcon = computed(
    () => merged.value.startIcon != null && !hasStartSlot.value,
  );

  const showEndIcon = computed(
    () => merged.value.endIcon != null && !hasEndSlot.value,
  );

  const showErrorIcon = computed(
    () =>
      !merged.value.errorless &&
      invalidated.value &&
      merged.value.withErrorIcon !== false &&
      !showEndIcon.value &&
      !hasEndSlot.value,
  );

  const showDescription = computed(
    () =>
      !invalidated.value &&
      hasSlotOrProp(slots, "description", merged.value.description),
  );

  const showError = computed(
    () =>
      !merged.value.errorless &&
      invalidated.value &&
      hasSlotOrProp(slots, "error", merged.value.error),
  );

  // Root
  const rootClass = computed(() =>
    cn(
      "w-full relative",
      "aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60",
      "aria-readonly:pointer-events-none aria-readonly:select-none",
      mergedClasses.value.root,
      userClass,
    ),
  );

  // Header
  const headerClass = computed(() =>
    cn("flex mb-1", headerJustify.value, mergedClasses.value.header),
  );

  const labelClass = computed(() =>
    cn(
      "text-sm font-medium text-gray-700 dark:text-gray-300",
      mergedClasses.value.label,
    ),
  );

  const cornerClass = computed(() =>
    cn("text-sm text-gray-500 dark:text-gray-400", mergedClasses.value.corner),
  );

  // Container
  const containerClass = computed(() =>
    cn(
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
    ),
  );

  const startClass = computed(() =>
    cn(
      "text-gray-400 pointer-events-none select-none flex items-center whitespace-nowrap",
      "input-focus:text-error-500",
      { "text-error-500": invalidated.value },
      variantPalette.value?.start,
      roundedPalette.value?.start,
      colorPalette.value?.start,
      mergedClasses.value.start,
    ),
  );

  const endClass = computed(() =>
    cn(
      "text-gray-500 pointer-events-none select-none flex items-center whitespace-nowrap",
      "input-focus:text-error-500",
      { "text-error-500": invalidated.value },
      variantPalette.value?.end,
      roundedPalette.value?.end,
      colorPalette.value?.end,
      mergedClasses.value.end,
    ),
  );

  const startSlotClass =
    "group/start wrapper-start-slot flex h-full py-0.5 ps-0.5";

  const endSlotClass =
    "group/end wrapper-end-slot shrink-0 flex h-full py-0.5 pe-0.5";

  // Input
  const inputClass = computed(() =>
    cn(
      "flex-1 min-w-0 bg-transparent border-0 outline-none shadow-none",
      "text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
      "disabled:cursor-not-allowed",
      mergedClasses.value.input,
    ),
  );

  // Footer
  const descriptionClass = computed(() =>
    cn(
      "mt-2 text-sm text-gray-500 dark:text-gray-400",
      mergedClasses.value.description,
    ),
  );

  const errorClass = computed(() =>
    cn(
      "mt-2 text-sm text-error-600 dark:text-error-400",
      mergedClasses.value.error,
    ),
  );

  // Parts
  const partsProps = computed(() => merged.value.partsProps);

  const rootBind = computed(() =>
    mergePartBind(partsProps.value?.root, rootClass.value),
  );

  const headerBind = computed(() =>
    mergePartBind(partsProps.value?.header, headerClass.value),
  );

  const labelBind = computed(() =>
    mergePartBind(partsProps.value?.label, labelClass.value),
  );

  const cornerBind = computed(() =>
    mergePartBind(partsProps.value?.corner, cornerClass.value),
  );

  const containerBind = computed(() =>
    mergePartBind(partsProps.value?.container, containerClass.value),
  );

  const startBind = computed(() =>
    mergePartBind(partsProps.value?.start, startClass.value),
  );

  const endBind = computed(() =>
    mergePartBind(partsProps.value?.end, endClass.value),
  );

  const inputBind = computed(() =>
    mergePartBind(
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
    ),
  );

  const startIconBind = computed(() =>
    mergePartBind(partsProps.value?.startIcon, ""),
  );

  const endIconBind = computed(() =>
    mergePartBind(partsProps.value?.endIcon, ""),
  );

  const descriptionBind = computed(() =>
    mergePartBind(partsProps.value?.description, descriptionClass.value),
  );

  const errorBind = computed(() =>
    mergePartBind(partsProps.value?.error, errorClass.value),
  );

  return {
    slots,
    merged,
    errorIcon,
    inputId,
    isDisabled,
    isReadonly,
    invalidated,
    hasStartSlot,
    hasEndSlot,
    showHeader,
    showStartIcon,
    showEndIcon,
    showErrorIcon,
    showDescription,
    showError,
    startSlotClass,
    endSlotClass,
    rootBind,
    headerBind,
    labelBind,
    cornerBind,
    containerBind,
    startBind,
    endBind,
    inputBind,
    startIconBind,
    endIconBind,
    descriptionBind,
    errorBind,
  };
}
