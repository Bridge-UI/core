// ** External Imports
import { get } from "es-toolkit/compat";
import { CircleAlert } from "lucide-vue-next";
import { computed, useAttrs, useSlots } from "vue";

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
  // Setup
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
      rootClassName: () => rootClassAttr,
      controlId: () => inputInheritedAttrs.id as string | undefined,
    },
  );

  const partsProps = computed((): TextFieldPartsProps | undefined => {
    return merged.value.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TextFieldClasses>({
    props: customProps,
    entry: bridgeTextField,
  });

  // Classes
  const variantClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeTextField.value?.customProps?.variant,
    );

    return get(classes, merged.value.variant);
  });

  const colorClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeTextField.value?.customProps?.color,
    );

    return get(classes, merged.value.color);
  });

  const roundedClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeTextField.value?.customProps?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const sizeClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeTextField.value?.customProps?.size,
    );

    return get(classes, merged.value.size);
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
      const classes = mergeBridgeUILayeredClasses(
        colorProps,
        bridgeTextField.value?.customProps?.color,
      );

      return get(classes, "error");
    }

    return colorClasses.value;
  });

  const containerSpacing = computed(() => {
    const hasEndSlot = hasNamedSlot(slots, "end");
    const hasStartSlot = hasNamedSlot(slots, "start");

    if (!hasStartSlot && !hasEndSlot) {
      return sizeClasses.value?.padding;
    }

    return cn({
      // Theme classes
      [sizeClasses.value?.insetStart ?? ""]: !hasStartSlot,
      [sizeClasses.value?.insetEnd ?? ""]: !hasEndSlot,
      "gap-x-2": true,
    });
  });

  const containerColorFocus = computed(() => {
    if (isUnderlined.value) {
      return focusColorPalette.value?.underlined;
    }

    return focusColorPalette.value?.input;
  });

  // Binds
  const endIconBind = computed(() => {
    return mergePartBind(partsProps.value?.endIcon, {}, "");
  });

  const startIconBind = computed(() => {
    return mergePartBind(partsProps.value?.startIcon, {}, "");
  });

  // prettier-ignore
  const endBind = computed(() => {
    return mergePartBind(partsProps.value?.end, {}, cn({
      // Theme classes
      'shrink-0 text-gray-500 pointer-events-none select-none flex items-center whitespace-nowrap': true,
      [roundedClasses.value?.end ?? ""]: !isUnderlined.value,
      [colorClasses.value?.end ?? ""]: !invalidated.value,
      'group-data-[invalid]:text-error-500': true,
      'text-error-500': invalidated.value,
      // Custom classes
      [mergedClasses.value.end ?? ""]: true,
    }));
  });

  // prettier-ignore
  const startBind = computed(() => {
    return mergePartBind(partsProps.value?.start, {}, cn({
      // Theme classes
      'text-gray-400 pointer-events-none select-none flex items-center whitespace-nowrap': true,
      [roundedClasses.value?.start ?? ""]: !isUnderlined.value,
      [colorClasses.value?.start ?? ""]: !invalidated.value,
      'group-data-[invalid]:text-error-500': true,
      'text-error-500': invalidated.value,
      // Custom classes
      [mergedClasses.value.start ?? ""]: true,
    }));
  });

  // prettier-ignore
  const endSlotBind = computed(() => {
    return mergePartBind(partsProps.value?.end, {}, cn({
      // Theme classes
      'group/end wrapper-end-slot shrink-0 flex self-stretch items-stretch py-0.5 pe-0.5': true,
      // Custom classes
      [mergedClasses.value.end ?? ""]: true,
    }));
  });

  // prettier-ignore
  const startSlotBind = computed(() => {
    return mergePartBind(partsProps.value?.start, {}, cn({
      // Theme classes
      'group/start wrapper-start-slot shrink-0 flex self-stretch items-stretch py-0.5 ps-0.5': true,
      // Custom classes
      [mergedClasses.value.start ?? ""]: true,
    }));
  });

  // prettier-ignore
  const inputBind = computed(() => {
    return mergePartBind({
      ...partsProps.value?.input,
      id: inputId.value,
      disabled: isDisabled.value,
      readonly: isReadonly.value,
      "aria-invalid": invalidated.value || undefined,
      "aria-describedby": formField.ariaDescribedBy.value,
    }, inputInheritedAttrs, cn({
      // Theme classes
      'text-gray-900 dark:text-gray-100 placeholder:text-gray-400': true,
      'outline-none ring-0 focus:outline-none focus:ring-0': true,
      'flex-1 min-w-0 bg-transparent border-0 shadow-none': true,
      'disabled:cursor-not-allowed': true,
      // Custom classes
      [mergedClasses.value.input ?? ""]: true,
      [sizeClasses.value?.input ?? ""]: true,
    }));
  });

  // prettier-ignore
  const containerBind = computed(() => {
    const hasEndSlot = hasNamedSlot(slots, "end");
    const hasStartSlot = hasNamedSlot(slots, "start");

    return mergePartBind(partsProps.value?.container, {}, cn({
      // Theme classes
      "bg-gray-100 dark:bg-gray-800": isDisabled.value && !invalidated.value,
      'group/field relative flex justify-start gap-x-2 items-center': true,
      [sizeClasses.value?.container ?? ""]: (hasStartSlot || hasEndSlot),
      [roundedClasses.value?.input ?? ""]: !isUnderlined.value,
      'transition-all ease-in-out duration-150': true,
      [variantClasses.value?.container ?? ""]: true,
      [variantClasses.value?.input ?? ""]: true,
      [containerColorFocus.value ?? ""]: true,
      [containerSpacing.value ?? ""]: true,
      'rounded-none': isUnderlined.value,
      'outline-none': true,
      // Error Classes
      "bg-error-50 ring-error-500 focus-within:ring-error-600 dark:ring-error-700 dark:bg-error-700/10 dark:ring-error-600 dark:focus-within:ring-error-600": invalidated.value && !isUnderlined.value,
      "border-error-500 focus-within:border-error-600 dark:border-error-600 dark:focus-within:border-error-600": invalidated.value && isUnderlined.value,
      // Custom classes
      [mergedClasses.value.container ?? ""]: true,
    }));
  });

  return {
    slots,
    merged,
    endBind,
    inputId,
    errorIcon,
    formField,
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
    rootBind: formField.rootBind,
  };
}
