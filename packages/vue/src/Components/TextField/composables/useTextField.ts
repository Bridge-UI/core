// ** External Imports
import { get } from "es-toolkit/compat";
import { CircleAlert } from "lucide-vue-next";
import { computed, provide, useAttrs, useSlots } from "vue";

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
} from "@bridge-ui/core/Components/TextField";

// ** Local Imports
import { useFormField } from "@/Components/FormField/composables/useFormField";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import { formFieldContextKey } from "@/Components/FormField/formFieldContext";
import type {
  TextFieldClasses,
  TextFieldOwnProps,
  TextFieldPartsProps,
} from "@/Components/TextField/textField.types";
import {
  hasNamedSlot,
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

  const formField = useFormField(
    customProps as FormFieldOwnProps,
    {
      size: libDefaults.size,
    },
    {
      controlId: () => inputInheritedAttrs.id as string | undefined,
    },
  );

  provide(formFieldContextKey, formField);

  const partsProps = computed((): TextFieldPartsProps | undefined => {
    return merged.value.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TextFieldClasses>({
    props: customProps,
    entry: bridgeTextField,
  });

  // Classes
  const variantClasses = computed(() => {
    const layer = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeTextField.value?.customProps?.variant,
    );

    return get(layer, merged.value.variant);
  });

  const colorClasses = computed(() => {
    const layer = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeTextField.value?.customProps?.color,
    );

    return get(layer, merged.value.color);
  });

  const roundedClasses = computed(() => {
    const layer = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeTextField.value?.customProps?.rounded,
    );

    return get(layer, merged.value.rounded);
  });

  const sizeClasses = computed(() => {
    const layer = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeTextField.value?.customProps?.size,
    );

    return get(layer, merged.value.size);
  });

  const isUnderlined = computed(() => {
    return merged.value.variant === "underlined";
  });

  const inputId = formField.controlId;
  const isDisabled = formField.isDisabled;
  const isReadonly = formField.isReadonly;
  const invalidated = formField.invalidated;

  const focusColorPalette = computed(() => {
    if (invalidated.value) {
      const layer = mergeBridgeUILayeredClasses(
        colorProps,
        bridgeTextField.value?.customProps?.color,
      );

      return get(layer, "error");
    }

    return colorClasses.value;
  });

  const containerSpacing = computed(() => {
    const hasEndSlot = hasNamedSlot(slots, "end");
    const hasStartSlot = hasNamedSlot(slots, "start");

    if (!hasStartSlot && !hasEndSlot) {
      return sizeClasses.value?.padding;
    }

    return cn(
      "gap-x-2",
      !hasStartSlot && sizeClasses.value?.insetStart,
      !hasEndSlot && sizeClasses.value?.insetEnd,
    );
  });

  const containerColorFocus = computed(() => {
    if (isUnderlined.value) {
      return focusColorPalette.value?.underlined;
    }

    return focusColorPalette.value?.input;
  });

  const rootBind = computed(() => {
    return mergePartBind(
      {},
      rootClassAttr !== undefined ? { class: rootClassAttr } : {},
      cn(formField.rootBind.value.class),
    );
  });

  const containerBind = computed(() => {
    const hasEndSlot = hasNamedSlot(slots, "end");
    const hasStartSlot = hasNamedSlot(slots, "start");

    return mergePartBind(
      partsProps.value?.container,
      {},
      cn(
        "group/field relative flex justify-start gap-x-2 items-center",
        "transition-all ease-in-out duration-150",
        "outline-none",
        variantClasses.value?.container,
        variantClasses.value?.input,
        !isUnderlined.value && roundedClasses.value?.input,
        isUnderlined.value && "rounded-none",
        containerColorFocus.value,
        containerSpacing.value,
        (hasStartSlot || hasEndSlot) && sizeClasses.value?.container,
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
        !invalidated.value && colorClasses.value?.start,
        !isUnderlined.value && roundedClasses.value?.start,
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
        !invalidated.value && colorClasses.value?.end,
        !isUnderlined.value && roundedClasses.value?.end,
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
        "aria-describedby": formField.ariaDescribedBy.value,
      },
      inputInheritedAttrs,
      cn(
        "flex-1 min-w-0 bg-transparent border-0 shadow-none",
        "outline-none ring-0 focus:outline-none focus:ring-0",
        "text-gray-900 dark:text-gray-100 placeholder:text-gray-400",
        "disabled:cursor-not-allowed",
        sizeClasses.value?.input,
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

  return {
    slots,
    merged,
    endBind,
    inputId,
    rootBind,
    errorIcon,
    inputBind,
    startBind,
    isDisabled,
    isReadonly,
    endIconBind,
    endSlotBind,
    invalidated,
    containerBind,
    startIconBind,
    startSlotBind,
  };
}
