// ** External Imports
import { get } from "es-toolkit/compat";
import { CircleAlert } from "lucide-react";
import { useId, useMemo } from "react";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  colorProps,
  roundedProps,
  sizeProps,
  variantProps,
  type TextFieldColor,
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

type TextFieldLibDefaults = LibDefaultsShape<
  TextFieldOwnProps,
  "color" | "rounded" | "size" | "variant" | "withErrorIcon"
>;

type TextFieldMerged = MergeLibDefaults<
  TextFieldOwnProps,
  TextFieldLibDefaults
>;

export function useTextField(
  props: TextFieldProps,
  libDefaults: TextFieldLibDefaults,
) {
  const autoId = useId();

  const { customProps, inheritedAttrs } = splitComponentProps<
    TextFieldProps,
    typeof textFieldBridgeKeys
  >({
    props,
    bridgeKeys: textFieldBridgeKeys,
  });

  const {
    className: rootClassAttr,
    slots,
    ...inputInheritedAttrs
  } = inheritedAttrs as {
    className?: string;
    slots?: TextFieldProps["slots"];
  } & Record<string, unknown>;

  const { entry: bridgeTextField, merged } = useBridgeUIComponent<
    TextFieldMerged,
    "TextField"
  >({
    libDefaults,
    props: customProps,
    componentName: "TextField",
  });

  const resolvedSlots = derived(() => {
    return props.slots ?? slots;
  });

  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TextFieldClasses>({
    entry: bridgeTextField,
    props: customProps,
  });

  const variantPalette = useMemo(() => {
    const layer = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeTextField?.customProps?.variant,
    );

    return get(layer, merged.variant);
  }, [bridgeTextField?.customProps?.variant, merged.variant]);

  const colorPalette = useMemo(() => {
    const layer = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeTextField?.customProps?.color,
    );

    return get(layer, merged.color as keyof TextFieldColor);
  }, [bridgeTextField?.customProps?.color, merged.color]);

  const roundedPalette = useMemo(() => {
    const layer = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeTextField?.customProps?.rounded,
    );

    return get(layer, merged.rounded);
  }, [bridgeTextField?.customProps?.rounded, merged.rounded]);

  const sizePalette = useMemo(() => {
    const layer = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeTextField?.customProps?.size,
    );

    return get(layer, merged.size);
  }, [bridgeTextField?.customProps?.size, merged.size]);

  const isUnderlined = derived(() => {
    return merged.variant === "underlined";
  });

  const inputId = derived(() => {
    return (inputInheritedAttrs.id as string | undefined) ?? autoId;
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

  const focusColorPalette = useMemo(() => {
    if (merged.error === true) {
      const layer = mergeBridgeUILayeredClasses(
        colorProps,
        bridgeTextField?.customProps?.color,
      );

      return get(layer, "error");
    }

    return colorPalette;
  }, [bridgeTextField?.customProps?.color, colorPalette, merged.error]);

  const headerJustify = derived(() => {
    if (hasSlotOrProp(resolvedSlots, "label", merged.label)) {
      return "justify-between items-end";
    }

    return "justify-end";
  });

  const containerSpacing = derived(() => {
    const hasStartSlot = hasNamedSlot(resolvedSlots, "start");
    const hasEndSlot = hasNamedSlot(resolvedSlots, "end");

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

  const ariaDescribedBy = derived(() => {
    const ids: string[] = [];

    if (
      !invalidated &&
      hasSlotOrProp(resolvedSlots, "description", merged.description)
    ) {
      ids.push(`${inputId}-description`);
    }

    if (hasSlotOrProp(resolvedSlots, "errorMessage", merged.errorMessage)) {
      ids.push(`${inputId}-error`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  const rootBind = derived(() => {
    return mergePartBind(
      partsProps?.root,
      rootClassAttr !== undefined ? { className: rootClassAttr } : {},
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
      partsProps?.header,
      {},
      cn("flex mb-1", headerJustify, mergedClasses.header),
    );
  });

  const labelBind = derived(() => {
    return mergePartBind(partsProps?.label, {}, cn(mergedClasses.label));
  });

  const cornerBind = derived(() => {
    return mergePartBind(
      partsProps?.corner,
      {},
      cn("text-sm text-gray-500 dark:text-gray-400", mergedClasses.corner),
    );
  });

  const containerBind = derived(() => {
    const hasStartSlot = hasNamedSlot(resolvedSlots, "start");
    const hasEndSlot = hasNamedSlot(resolvedSlots, "end");

    return mergePartBind(
      partsProps?.container,
      {},
      cn(
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
          "bg-error-50 ring-error-500 focus-within:ring-error-600 dark:ring-error-700 dark:bg-error-700/10 dark:ring-error-600 dark:focus-within:ring-error-600":
            invalidated && !isUnderlined,
          "border-error-500 focus-within:border-error-600 dark:border-error-600 dark:focus-within:border-error-600":
            invalidated && isUnderlined,
        },
        mergedClasses.container,
      ),
    );
  });

  const startBind = derived(() => {
    return mergePartBind(
      partsProps?.start,
      {},
      cn(
        "text-gray-400 pointer-events-none select-none flex items-center whitespace-nowrap",
        "group-data-[invalid]:text-error-500",
        { "text-error-500": invalidated },
        !invalidated && colorPalette?.start,
        !isUnderlined && roundedPalette?.start,
        mergedClasses.start,
      ),
    );
  });

  const endBind = derived(() => {
    return mergePartBind(
      partsProps?.end,
      {},
      cn(
        "shrink-0 text-gray-500 pointer-events-none select-none flex items-center whitespace-nowrap",
        "group-data-[invalid]:text-error-500",
        { "text-error-500": invalidated },
        !invalidated && colorPalette?.end,
        !isUnderlined && roundedPalette?.end,
        mergedClasses.end,
      ),
    );
  });

  const startSlotBind = derived(() => {
    return mergePartBind(
      partsProps?.start,
      {},
      cn(
        "group/start wrapper-start-slot shrink-0 flex self-stretch items-stretch py-0.5 ps-0.5",
        mergedClasses.start,
      ),
    );
  });

  const endSlotBind = derived(() => {
    return mergePartBind(
      partsProps?.end,
      {},
      cn(
        "group/end wrapper-end-slot shrink-0 flex self-stretch items-stretch py-0.5 pe-0.5",
        mergedClasses.end,
      ),
    );
  });

  const inputBind = derived(() => {
    return mergePartBind(
      {
        ...partsProps?.input,
        id: inputId,
        disabled: isDisabled,
        readOnly: isReadonly,
        "aria-invalid": invalidated || undefined,
        "aria-describedby": ariaDescribedBy,
      },
      inputInheritedAttrs,
      cn(
        "flex-1 min-w-0 bg-transparent border-0 shadow-none",
        "outline-none ring-0 focus:outline-none focus:ring-0",
        "text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
        "disabled:cursor-not-allowed",
        sizePalette?.input,
        mergedClasses.input,
      ),
    );
  });

  const startIconBind = derived(() => {
    return mergePartBind(partsProps?.startIcon, {}, "");
  });

  const endIconBind = derived(() => {
    return mergePartBind(partsProps?.endIcon, {}, "");
  });

  const descriptionBind = derived(() => {
    return mergePartBind(
      partsProps?.description,
      {},
      cn(
        "mt-2 text-sm text-gray-500 dark:text-gray-400",
        mergedClasses.description,
      ),
    );
  });

  const errorBind = derived(() => {
    return mergePartBind(
      partsProps?.error,
      {},
      cn(
        "mt-2 text-sm text-error-600 dark:text-error-400",
        mergedClasses.error,
      ),
    );
  });

  return {
    merged,
    inputId,
    rootBind,
    errorBind,
    errorIcon,
    inputBind,
    labelBind,
    endBind,
    startBind,
    cornerBind,
    headerBind,
    isDisabled,
    isReadonly,
    endIconBind,
    endSlotBind,
    invalidated,
    containerBind,
    startIconBind,
    startSlotBind,
    descriptionBind,
    slots: resolvedSlots,
  };
}
