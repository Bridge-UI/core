// ** External Imports
import {
  computed,
  type MaybeRefOrGetter,
  toValue,
  useAttrs,
  useId,
  useSlots,
} from "vue";

// ** Core Imports
import {
  type LibDefaultsShape,
  type MergeLibDefaults,
  splitComponentProps,
} from "@bridge-ui/core";

// ** Local Imports
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import { hasSlotOrProp, useBridgeUIComponent } from "@/Utils";

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
  "startIcon",
  "partsProps",
  "description",
  "errorMessage",
  "withErrorIcon",
] as const satisfies readonly (keyof FormFieldOwnProps)[];

type FormFieldLibDefaults = LibDefaultsShape<
  FormFieldOwnProps,
  "color" | "rounded" | "size" | "variant" | "withErrorIcon"
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
  const attrs = useAttrs();
  const slots = useSlots();

  const split = computed(() => {
    return splitComponentProps<
      Omit<FormFieldOwnProps, "field">,
      typeof formFieldBridgeKeys
    >({
      bridgeKeys: formFieldBridgeKeys,
      props: { ...attrs, ...toValue(props) },
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

  // const partsProps = computed(() => {
  //   return merged.value.partsProps;
  // });

  // const mergedClasses = useBridgeUIMergedRegistryClasses<FormFieldClasses>({
  //   entry: bridgeFormField,
  //   props: () => split.value.customProps,
  // });

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
    return merged.value.controlId ?? autoId;
  });

  const variantKey = computed(() => {
    return merged.value.variant ?? "outline";
  });

  // const headerJustify = computed(() => {
  //   if (hasSlotOrProp(slots, "label", merged.value.label)) {
  //     return "justify-between items-end";
  //   }

  //   return "justify-end";
  // });

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
  // const sizeClasses = computed(() => {
  //   const classes = mergeBridgeUILayeredClasses(
  //     sizeProps,
  //     bridgeFormField.value?.customProps?.size,
  //   );

  //   return get(classes, merged.value.size);
  // });

  // Binds
  const headerBind = computed(() => {
    return {};
  });

  const requiredBind = computed(() => {
    return {};
  });

  const cornerBind = computed(() => {
    return {};
  });

  const descriptionBind = computed(() => {
    return {};
  });

  const errorBind = computed(() => {
    return {};
  });

  const labelBind = computed(() => {
    return {};
  });

  const rootBind = computed(() => {
    return {};
  });

  const inputBind = computed(() => {
    return {};
  });

  return {
    slots,
    merged,
    rootBind,
    controlId,
    errorBind,
    labelBind,
    inputBind,
    cornerBind,
    headerBind,
    isDisabled,
    isReadonly,
    variantKey,
    invalidated,
    requiredBind,
    ariaDescribedBy,
    descriptionBind,
  };
}

export type UseFormFieldReturn = ReturnType<typeof useFormField>;
