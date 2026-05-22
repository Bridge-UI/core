// ** External Imports
import { get } from "es-toolkit/compat";
import { CircleAlert } from "lucide-vue-next";
import { computed, useAttrs, useId, useSlots } from "vue";

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
} from "@/Components/TextField/textField.types";
import {
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
  props: TextFieldOwnProps,
  libDefaults: TextFieldLibDefaults,
) {
  const autoId = useId();
  const attrs = useAttrs();
  const slots = useSlots();

  const { customProps, inheritedAttrs } = splitComponentProps<
    TextFieldOwnProps,
    typeof textFieldBridgeKeys
  >({
    bridgeKeys: textFieldBridgeKeys,
    props: { ...attrs, ...props } as TextFieldOwnProps,
  });

  const { class: rootClassAttr, ...inputInheritedAttrs } = inheritedAttrs as {
    class?: string;
  } & Record<string, unknown>;

  const { entry: bridgeTextField, merged } = useBridgeUIComponent<
    TextFieldMerged,
    "TextField"
  >({
    libDefaults,
    props: customProps,
    componentName: "TextField",
  });

  const partsProps = computed(() => {
    return merged.value.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TextFieldClasses>({
    entry: bridgeTextField,
    props: customProps,
  });

  const variantKey = computed(() => {
    return merged.value.variant;
  });

  const colorKey = computed(() => {
    return merged.value.color as keyof TextFieldColor;
  });

  const roundedKey = computed(() => {
    return merged.value.rounded;
  });

  const sizeKey = computed(() => {
    return merged.value.size;
  });

  const variantPalette = computed(() => {
    const layer = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeTextField.value?.customProps?.variant,
    );

    return get(layer, variantKey.value);
  });

  const colorPalette = computed(() => {
    const layer = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeTextField.value?.customProps?.color,
    );

    return get(layer, colorKey.value);
  });

  const roundedPalette = computed(() => {
    const layer = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeTextField.value?.customProps?.rounded,
    );

    return get(layer, roundedKey.value);
  });

  const sizePalette = computed(() => {
    const layer = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeTextField.value?.customProps?.size,
    );

    return get(layer, sizeKey.value);
  });

  const isUnderlined = computed(() => {
    return variantKey.value === "underlined";
  });

  const inputId = computed(() => {
    return (inputInheritedAttrs.id as string | undefined) ?? autoId;
  });

  const isDisabled = computed(() => {
    return Boolean(merged.value.disabled);
  });

  const isReadonly = computed(() => {
    return Boolean(merged.value.readonly);
  });

  const invalidated = computed(() => {
    return merged.value.error === true;
  });

  const focusColorPalette = computed(() => {
    if (invalidated.value) {
      const layer = mergeBridgeUILayeredClasses(
        colorProps,
        bridgeTextField.value?.customProps?.color,
      );

      return get(layer, "error");
    }

    return colorPalette.value;
  });

  const headerJustify = computed(() => {
    if (hasSlotOrProp(slots, "label", merged.value.label)) {
      return "justify-between items-end";
    }

    return "justify-end";
  });

  const containerSpacing = computed(() => {
    const hasStartSlot = hasNamedSlot(slots, "start");
    const hasEndSlot = hasNamedSlot(slots, "end");

    if (!hasStartSlot && !hasEndSlot) {
      return sizePalette.value?.padding;
    }

    return cn(
      "gap-x-2",
      !hasStartSlot && sizePalette.value?.insetStart,
      !hasEndSlot && sizePalette.value?.insetEnd,
    );
  });

  const containerColorFocus = computed(() => {
    if (isUnderlined.value) {
      return focusColorPalette.value?.underlined;
    }

    return focusColorPalette.value?.input;
  });

  const ariaDescribedBy = computed(() => {
    const ids: string[] = [];

    if (
      !invalidated.value &&
      hasSlotOrProp(slots, "description", merged.value.description)
    ) {
      ids.push(`${inputId.value}-description`);
    }

    if (hasSlotOrProp(slots, "errorMessage", merged.value.errorMessage)) {
      ids.push(`${inputId.value}-error`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  const rootBind = computed(() => {
    return mergePartBind(
      partsProps.value?.root,
      rootClassAttr !== undefined ? { class: rootClassAttr } : {},
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
      partsProps.value?.header,
      {},
      cn("flex mb-1", headerJustify.value, mergedClasses.value.header),
    );
  });

  const labelBind = computed(() => {
    return mergePartBind(
      partsProps.value?.label,
      {},
      cn(mergedClasses.value.label),
    );
  });

  const cornerBind = computed(() => {
    return mergePartBind(
      partsProps.value?.corner,
      {},
      cn(
        "text-sm text-gray-500 dark:text-gray-400",
        mergedClasses.value.corner,
      ),
    );
  });

  const containerBind = computed(() => {
    const hasStartSlot = hasNamedSlot(slots, "start");
    const hasEndSlot = hasNamedSlot(slots, "end");

    return mergePartBind(
      partsProps.value?.container,
      {},
      cn(
        "group/field relative flex justify-start gap-x-2 items-center",
        "transition-all ease-in-out duration-150",
        "outline-none",
        variantPalette.value?.container,
        variantPalette.value?.input,
        !isUnderlined.value && roundedPalette.value?.input,
        isUnderlined.value && "rounded-none",
        containerColorFocus.value,
        containerSpacing.value,
        (hasStartSlot || hasEndSlot) && sizePalette.value?.container,
        {
          "bg-gray-100 dark:bg-gray-800":
            isDisabled.value && !invalidated.value,
          "bg-error-50 ring-error-500 focus-within:ring-error-600 dark:ring-error-700 dark:bg-error-700/10 dark:ring-error-600 dark:focus-within:ring-error-600":
            invalidated.value && !isUnderlined.value,
          "border-error-500 focus-within:border-error-600 dark:border-error-600 dark:focus-within:border-error-600":
            invalidated.value && isUnderlined.value,
        },
        mergedClasses.value.container,
      ),
    );
  });

  const startBind = computed(() => {
    return mergePartBind(
      partsProps.value?.start,
      {},
      cn(
        "text-gray-400 pointer-events-none select-none flex items-center whitespace-nowrap",
        "group-data-[invalid]:text-error-500",
        { "text-error-500": invalidated.value },
        !invalidated.value && colorPalette.value?.start,
        !isUnderlined.value && roundedPalette.value?.start,
        mergedClasses.value.start,
      ),
    );
  });

  const endBind = computed(() => {
    return mergePartBind(
      partsProps.value?.end,
      {},
      cn(
        "shrink-0 text-gray-500 pointer-events-none select-none flex items-center whitespace-nowrap",
        "group-data-[invalid]:text-error-500",
        { "text-error-500": invalidated.value },
        !invalidated.value && colorPalette.value?.end,
        !isUnderlined.value && roundedPalette.value?.end,
        mergedClasses.value.end,
      ),
    );
  });

  const startSlotBind = computed(() => {
    return mergePartBind(
      partsProps.value?.start,
      {},
      cn(
        "group/start wrapper-start-slot shrink-0 flex self-stretch items-stretch py-0.5 ps-0.5",
        mergedClasses.value.start,
      ),
    );
  });

  const endSlotBind = computed(() => {
    return mergePartBind(
      partsProps.value?.end,
      {},
      cn(
        "group/end wrapper-end-slot shrink-0 flex self-stretch items-stretch py-0.5 pe-0.5",
        mergedClasses.value.end,
      ),
    );
  });

  const inputBind = computed(() => {
    return mergePartBind(
      {
        ...partsProps.value?.input,
        id: inputId.value,
        disabled: isDisabled.value,
        readonly: isReadonly.value,
        "aria-invalid": invalidated.value || undefined,
        "aria-describedby": ariaDescribedBy.value,
      },
      inputInheritedAttrs,
      cn(
        "flex-1 min-w-0 bg-transparent border-0 shadow-none",
        "outline-none ring-0 focus:outline-none focus:ring-0",
        "text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
        "disabled:cursor-not-allowed",
        sizePalette.value?.input,
        mergedClasses.value.input,
      ),
    );
  });

  const startIconBind = computed(() => {
    return mergePartBind(partsProps.value?.startIcon, {}, "");
  });

  const endIconBind = computed(() => {
    return mergePartBind(partsProps.value?.endIcon, {}, "");
  });

  const descriptionBind = computed(() => {
    return mergePartBind(
      partsProps.value?.description,
      {},
      cn(
        "mt-2 text-sm text-gray-500 dark:text-gray-400",
        mergedClasses.value.description,
      ),
    );
  });

  const errorBind = computed(() => {
    return mergePartBind(
      partsProps.value?.error,
      {},
      cn(
        "mt-2 text-sm text-error-600 dark:text-error-400",
        mergedClasses.value.error,
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
  };
}
