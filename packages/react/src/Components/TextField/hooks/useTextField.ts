// ** External Imports
import { get, isString } from "es-toolkit/compat";
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
  derived,
  hasNamedSlot,
  hasSlotOrProp,
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
  "startIcon",
  "partsProps",
  "description",
  "errorMessage",
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
  const sizeKey = derived(() => {
    return merged.size ?? "md";
  });

  const roundedKey = derived(() => {
    return merged.rounded ?? "md";
  });

  const variantKey = derived(() => {
    return merged.variant ?? "outline";
  });

  const colorKey = derived(() => {
    return (merged.color ?? "primary") as keyof TextFieldColor;
  });

  const sizePalette = derived(() => {
    return get(mergedSizeMap, sizeKey);
  });

  const colorPalette = derived(() => {
    return get(mergedColorProps, colorKey);
  });

  const roundedPalette = derived(() => {
    return get(mergedRoundedMap, roundedKey);
  });

  const variantPalette = derived(() => {
    return get(mergedVariantProps, variantKey);
  });

  const isUnderlined = derived(() => {
    return variantKey === "underlined";
  });

  // State
  const inputId = derived(() => {
    return rootHtmlProps.id ?? autoId;
  });

  const isDisabled = derived(() => {
    return Boolean(merged.disabled);
  });

  const isReadonly = derived(() => {
    return Boolean(merged.readonly);
  });

  const invalidated = derived(() => {
    return merged.error === true;
  });

  const focusColorPalette = derived(() => {
    if (invalidated) {
      return get(mergedColorProps, "error");
    }

    return colorPalette;
  });

  const hasStartSlot = derived(() => {
    return hasNamedSlot(slots, "start");
  });

  const hasEndSlot = derived(() => {
    return hasNamedSlot(slots, "end");
  });

  const headerJustify = derived(() => {
    if (hasSlotOrProp(slots, "label", merged.label)) {
      return "justify-between items-end";
    }

    return "justify-end";
  });

  // Visibility
  const showStartText = derived(() => {
    return !hasStartSlot && isString(merged.start) && merged.start.length > 0;
  });

  const showStartIcon = derived(() => {
    return merged.startIcon != null && !hasStartSlot && !showStartText;
  });

  const showEndText = derived(() => {
    return !hasEndSlot && isString(merged.end) && merged.end.length > 0;
  });

  const showErrorIcon = derived(() => {
    return (
      !hasEndSlot &&
      invalidated &&
      !showEndText &&
      merged.withErrorIcon !== false
    );
  });

  const showEndIcon = derived(() => {
    return (
      merged.endIcon != null && !hasEndSlot && !showEndText && !showErrorIcon
    );
  });

  const showHeader = derived(() => {
    return (
      hasSlotOrProp(slots, "label", merged.label) ||
      hasSlotOrProp(slots, "corner", merged.corner)
    );
  });

  const containerSpacing = derived(() => {
    if (!hasStartSlot && !hasEndSlot) {
      return sizePalette?.padding;
    }

    return cn(
      "gap-x-2",
      !hasStartSlot && sizePalette?.insetStart,
      !hasEndSlot && sizePalette?.insetEnd,
    );
  });

  const containerColorFocus = derived(() => {
    if (isUnderlined) {
      return focusColorPalette?.underlined;
    }

    return focusColorPalette?.input;
  });

  const showDescription = derived(() => {
    return (
      !invalidated && hasSlotOrProp(slots, "description", merged.description)
    );
  });

  const showError = derived(() => {
    return hasSlotOrProp(slots, "errorMessage", merged.errorMessage);
  });

  // Root
  const rootClass = derived(() => {
    return cn(
      "group aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60",
      "aria-readonly:pointer-events-none aria-readonly:select-none",
      "w-full relative",
      mergedClasses.root,
      className,
    );
  });

  // Header
  const headerClass = derived(() => {
    return cn("flex mb-1", headerJustify, mergedClasses.header);
  });

  const cornerClass = derived(() => {
    return cn("text-sm text-gray-500 dark:text-gray-400", mergedClasses.corner);
  });

  // Container
  // prettier-ignore
  const containerClass = derived(() => {
    return cn(
      "group/field relative flex justify-start gap-x-2 items-center",
      "transition-all ease-in-out duration-150",
      "outline-none",
      variantPalette?.container,
      variantPalette?.input,
      !isUnderlined && roundedPalette?.input,
      isUnderlined && "rounded-none",
      containerColorFocus,
      containerSpacing,
      (hasStartSlot || hasEndSlot) && sizePalette?.container,
      {
        "bg-gray-100 dark:bg-gray-800": isDisabled && !invalidated,
        "bg-error-50 ring-error-500 focus-within:ring-error-600 dark:ring-error-700 dark:bg-error-700/10 dark:ring-error-600 dark:focus-within:ring-error-600": invalidated && !isUnderlined,
        "border-error-500 focus-within:border-error-600 dark:border-error-600 dark:focus-within:border-error-600": invalidated && isUnderlined,
      },
      mergedClasses.container,
    );
  });

  const startIconClass = derived(() => {
    return cn(
      "text-gray-400 pointer-events-none select-none flex items-center whitespace-nowrap",
      "group-data-[invalid]:text-error-500",
      { "text-error-500": invalidated },
      !invalidated && colorPalette?.start,
      !isUnderlined && roundedPalette?.start,
      mergedClasses.start,
    );
  });

  const endIconClass = derived(() => {
    return cn(
      "shrink-0 text-gray-500 pointer-events-none select-none flex items-center whitespace-nowrap",
      "group-data-[invalid]:text-error-500",
      { "text-error-500": invalidated },
      !invalidated && colorPalette?.end,
      !isUnderlined && roundedPalette?.end,
      mergedClasses.end,
    );
  });

  const startSlotClass = derived(() => {
    return cn(
      "group/start wrapper-start-slot shrink-0 flex self-stretch items-stretch py-0.5 ps-0.5",
      mergedClasses.start,
    );
  });

  const endSlotClass = derived(() => {
    return cn(
      "group/end wrapper-end-slot shrink-0 flex self-stretch items-stretch py-0.5 pe-0.5",
      mergedClasses.end,
    );
  });

  // Input
  const inputClass = derived(() => {
    return cn(
      "flex-1 min-w-0 bg-transparent border-0 shadow-none",
      "outline-none ring-0 focus:outline-none focus:ring-0",
      "text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
      "disabled:cursor-not-allowed",
      sizePalette?.input,
      mergedClasses.input,
    );
  });

  // Footer
  const descriptionClass = derived(() => {
    return cn(
      "mt-2 text-sm text-gray-500 dark:text-gray-400",
      mergedClasses.description,
    );
  });

  const errorClass = derived(() => {
    return cn(
      "mt-2 text-sm text-error-600 dark:text-error-400",
      mergedClasses.error,
    );
  });

  const ariaDescribedBy = derived(() => {
    const ids: string[] = [];

    if (showDescription) {
      ids.push(`${inputId}-description`);
    }

    if (showError) {
      ids.push(`${inputId}-error`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  // Parts
  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const endBind = derived(() => {
    return mergePartBind(partsProps?.end, endIconClass);
  });

  const startSlotBind = derived(() => {
    return mergePartBind(partsProps?.start, startSlotClass);
  });

  const endSlotBind = derived(() => {
    return mergePartBind(partsProps?.end, endSlotClass);
  });

  const rootBind = derived(() => {
    return mergePartBind(partsProps?.root, rootClass);
  });

  const labelBind = derived(() => {
    return mergePartBind(partsProps?.label, cn(mergedClasses.label));
  });

  const startBind = derived(() => {
    return mergePartBind(partsProps?.start, startIconClass);
  });

  const cornerBind = derived(() => {
    return mergePartBind(partsProps?.corner, cornerClass);
  });

  const headerBind = derived(() => {
    return mergePartBind(partsProps?.header, headerClass);
  });

  const containerBind = derived(() => {
    return mergePartBind(partsProps?.container, containerClass);
  });

  const inputBind = derived(() => {
    return mergePartBind(
      {
        ...rootHtmlProps,
        ...partsProps?.input,
        id: inputId,
        disabled: isDisabled,
        readOnly: isReadonly,
        "aria-invalid": invalidated || undefined,
        "aria-describedby": ariaDescribedBy,
      },
      inputClass,
    );
  });

  const endIconBind = derived(() => {
    return mergePartBind(partsProps?.endIcon, "");
  });

  const startIconBind = derived(() => {
    return mergePartBind(partsProps?.startIcon, "");
  });

  const errorBind = derived(() => {
    return mergePartBind(partsProps?.error, errorClass);
  });

  const descriptionBind = derived(() => {
    return mergePartBind(partsProps?.description, descriptionClass);
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
