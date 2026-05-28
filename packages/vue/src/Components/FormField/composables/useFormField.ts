// ** External Imports
import { get } from "es-toolkit/compat";
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
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

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
  "partsProps",
  "description",
  "errorMessage",
  "withErrorIcon",
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
) {
  // Setup
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

  const { entry: bridgeFormField, merged } = useBridgeUIComponent<
    FormFieldMerged,
    "FormField"
  >({
    libDefaults,
    componentName: "FormField",
    props: () => split.value.customProps,
  });

  const partsProps = computed(() => {
    return merged.value.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<FormFieldClasses>({
    entry: bridgeFormField,
    props: () => split.value.customProps,
  });

  // Elements
  const invalidated = computed(() => {
    return merged.value.error === true;
  });

  const isDisabled = computed(() => {
    return Boolean(merged.value.disabled);
  });

  const isReadonly = computed(() => {
    return Boolean(merged.value.readonly);
  });

  const controlId = computed(() => {
    const inheritedId = (split.value.inheritedAttrs as HTMLAttributes).id;

    return merged.value.controlId ?? inheritedId ?? autoId;
  });

  const variantKey = computed(() => {
    return merged.value.variant ?? "outline";
  });

  const errorIcon = computed(() => {
    return merged.value.errorIcon ?? CircleAlert;
  });

  const isUnderlined = computed(() => {
    return variantKey.value === "underlined";
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

    if (hasSlotOrProp(slots, "errorMessage", merged.value.errorMessage)) {
      ids.push(`${controlId.value}-error`);
    }

    return ids.length > 0 ? ids.join(" ") : undefined;
  });

  // Classes
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

  const containerSpacing = computed(() => {
    const hasEndSlot = hasNamedSlot(slots, "end");
    const hasStartSlot = hasNamedSlot(slots, "start");

    if (!hasStartSlot && !hasEndSlot) {
      return sizeClasses.value?.padding;
    }

    return cn({
      [sizeClasses.value?.insetStart ?? ""]: !hasStartSlot,
      [sizeClasses.value?.insetEnd ?? ""]: !hasEndSlot,
    });
  });

  const containerColorFocus = computed(() => {
    if (isUnderlined.value) {
      return focusColorPalette.value?.underlined;
    }

    return focusColorPalette.value?.input;
  });

  // Binds
  const endBind = computed(() => {
    return {};
  });

  const rootBind = computed(() => {
    return {};
  });

  const errorBind = computed(() => {
    return {};
  });

  const inputBind = computed(() => {
    return {};
  });

  const labelBind = computed(() => {
    return {};
  });

  const startBind = computed(() => {
    return {};
  });

  const cornerBind = computed(() => {
    return {};
  });

  const headerBind = computed(() => {
    return {};
  });

  const endIconBind = computed(() => {
    return {};
  });

  const endSlotBind = computed(() => {
    return {};
  });

  const requiredBind = computed(() => {
    return {};
  });

  const containerBind = computed(() => {
    return {};
  });

  const startIconBind = computed(() => {
    return {};
  });

  const startSlotBind = computed(() => {
    return {};
  });

  const descriptionBind = computed(() => {
    return {};
  });

  return {
    slots,
    merged,
    endBind,
    rootBind,
    controlId,
    errorBind,
    errorIcon,
    inputBind,
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
  };
}

export type UseFormFieldReturn = ReturnType<typeof useFormField>;
