// ** External Imports
import { get } from "es-toolkit/compat";
import { CircleAlert } from "lucide-react";
import { useId, useMemo } from "react";

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
  TextFieldProps,
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
  props: TextFieldProps,
  libDefaults: Partial<TextFieldOwnProps>,
) {
  // Setup
  const autoId = useId();

  const { className, slots, propsForMerge, rootHtmlProps } =
    splitComponentProps(props, {
      peel: ["className", "slots"],
      bridgeKeys: textFieldBridgeKeys,
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
  const mergedColorProps = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      colorProps,
      bridgeTextField?.customProps?.color,
    );
  }, [bridgeTextField?.customProps?.color]);

  const mergedVariantProps = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeTextField?.customProps?.variant,
    );
  }, [bridgeTextField?.customProps?.variant]);

  const mergedRoundedMap = useMemo(() => {
    return mergeBridgeUILayeredClasses<TextFieldRounded>(
      roundedProps,
      bridgeTextField?.customProps?.rounded,
    );
  }, [bridgeTextField?.customProps?.rounded]);

  const mergedSizeMap = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeTextField?.customProps?.size,
    );
  }, [bridgeTextField?.customProps?.size]);

  // Theme
  const variantKey = merged.variant ?? "outline";

  const colorKey = (merged.color ?? "primary") as keyof TextFieldColor;

  const roundedKey = merged.rounded ?? "md";

  const sizeKey = merged.size ?? "md";

  const variantPalette = get(mergedVariantProps, variantKey);

  const colorPalette = get(mergedColorProps, colorKey);

  const roundedPalette = get(mergedRoundedMap, roundedKey);

  const sizeClass = get(mergedSizeMap, sizeKey);

  // State
  const inputId = rootHtmlProps.id ?? autoId;

  const isDisabled = Boolean(merged.disabled);

  const isReadonly = Boolean(merged.readonly);

  const invalidated = Boolean(merged.error);

  const hasStartSlot = hasNamedSlot(slots, "start");

  const hasEndSlot = hasNamedSlot(slots, "end");

  const headerJustify = hasSlotOrProp(slots, "label", merged.label)
    ? "justify-between items-end"
    : "justify-end";

  // Visibility
  const showHeader =
    hasSlotOrProp(slots, "label", merged.label) ||
    hasSlotOrProp(slots, "corner", merged.corner);

  const showStartIcon = merged.startIcon != null && !hasStartSlot;

  const showEndIcon = merged.endIcon != null && !hasEndSlot;

  const showErrorIcon =
    !merged.errorless &&
    invalidated &&
    merged.withErrorIcon !== false &&
    !showEndIcon &&
    !hasEndSlot;

  const showDescription =
    !invalidated && hasSlotOrProp(slots, "description", merged.description);

  const showError =
    !merged.errorless &&
    invalidated &&
    hasSlotOrProp(slots, "error", merged.error);

  // Root
  const rootClass = cn(
    "w-full relative",
    "aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60",
    "aria-readonly:pointer-events-none aria-readonly:select-none",
    mergedClasses.root,
    className,
  );

  // Header
  const headerClass = cn("flex mb-1", headerJustify, mergedClasses.header);

  const labelClass = cn(
    "text-sm font-medium text-gray-700 dark:text-gray-300",
    mergedClasses.label,
  );

  const cornerClass = cn(
    "text-sm text-gray-500 dark:text-gray-400",
    mergedClasses.corner,
  );

  // Container
  const containerClass = cn(
    "relative flex justify-between gap-x-2 items-center",
    "transition-all ease-in-out duration-150",
    "outline-0",
    variantPalette?.container,
    variantPalette?.input,
    roundedPalette?.input,
    colorPalette?.input,
    sizeClass,
    {
      "ps-3": !hasStartSlot && !showStartIcon,
      "pe-3": !hasEndSlot && !showEndIcon && !showErrorIcon,
      "py-2": !hasStartSlot && !hasEndSlot,
      "h-10": hasStartSlot || hasEndSlot,
      "bg-gray-100 dark:bg-gray-800": isDisabled && !invalidated,
      "bg-error-50 ring-error-500 dark:ring-error-700 dark:bg-error-700/10 dark:ring-error-600":
        invalidated,
    },
    mergedClasses.container,
  );

  const startClass = cn(
    "text-gray-400 pointer-events-none select-none flex items-center whitespace-nowrap",
    "input-focus:text-error-500",
    { "text-error-500": invalidated },
    variantPalette?.start,
    roundedPalette?.start,
    colorPalette?.start,
    mergedClasses.start,
  );

  const endClass = cn(
    "text-gray-500 pointer-events-none select-none flex items-center whitespace-nowrap",
    "input-focus:text-error-500",
    { "text-error-500": invalidated },
    variantPalette?.end,
    roundedPalette?.end,
    colorPalette?.end,
    mergedClasses.end,
  );

  const startSlotClass =
    "group/start wrapper-start-slot flex h-full py-0.5 ps-0.5";

  const endSlotClass =
    "group/end wrapper-end-slot shrink-0 flex h-full py-0.5 pe-0.5";

  // Input
  const inputClass = cn(
    "flex-1 min-w-0 bg-transparent border-0 outline-none shadow-none",
    "text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
    "disabled:cursor-not-allowed",
    mergedClasses.input,
  );

  // Footer
  const descriptionClass = cn(
    "mt-2 text-sm text-gray-500 dark:text-gray-400",
    mergedClasses.description,
  );

  const errorClass = cn(
    "mt-2 text-sm text-error-600 dark:text-error-400",
    mergedClasses.error,
  );

  // Parts
  const partsProps = merged.partsProps;

  const rootBind = mergePartBind(partsProps?.root, rootClass);

  const headerBind = mergePartBind(partsProps?.header, headerClass);

  const labelBind = mergePartBind(partsProps?.label, labelClass);

  const cornerBind = mergePartBind(partsProps?.corner, cornerClass);

  const containerBind = mergePartBind(partsProps?.container, containerClass);

  const startBind = mergePartBind(partsProps?.start, startClass);

  const endBind = mergePartBind(partsProps?.end, endClass);

  const inputBind = mergePartBind(
    {
      ...rootHtmlProps,
      ...partsProps?.input,
      id: inputId,
      disabled: isDisabled,
      readOnly: isReadonly,
      "aria-invalid": invalidated || undefined,
    },
    inputClass,
  );

  const startIconBind = mergePartBind(partsProps?.startIcon, "");

  const endIconBind = mergePartBind(partsProps?.endIcon, "");

  const descriptionBind = mergePartBind(
    partsProps?.description,
    descriptionClass,
  );

  const errorBind = mergePartBind(partsProps?.error, errorClass);

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
