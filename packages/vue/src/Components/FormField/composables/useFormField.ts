// ** External Imports
import { get } from "es-toolkit/compat";
import { ClassValue, computed, useAttrs, useId, useSlots } from "vue";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import type { FormFieldSize } from "@bridge-ui/core/Components/FormField";
import { sizeProps } from "@bridge-ui/core/Components/FormField";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldOwnProps,
} from "@/Components/FormField/formField.types";
import {
  hasSlotOrProp,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const formFieldBridgeKeys = [
  "size",
  "error",
  "label",
  "corner",
  "classes",
  "disabled",
  "readonly",
  "required",
  "partsProps",
  "controlId",
  "description",
  "errorMessage",
] as const satisfies readonly (keyof FormFieldOwnProps)[];

type FormFieldLibDefaults = LibDefaultsShape<FormFieldOwnProps, "size">;

type FormFieldMerged = MergeLibDefaults<
  FormFieldOwnProps,
  FormFieldLibDefaults
>;

export type UseFormFieldOptions = {
  /**
   * Control id supplied by the parent field (e.g. TextField fallthrough `id`).
   */
  controlId?: () => string | undefined;

  /**
   * Extra root `class` from a parent field wrapper (e.g. TextField fallthrough).
   */
  rootClassName?: () => ClassValue | undefined;

  /**
   * When the form field is embedded in another component (e.g. TextField), use
   * that component's `customProps.size` layer so a single theme override applies.
   */
  getSizeLayer?: () => Partial<FormFieldSize> | undefined;
};

export function useFormField(
  props: FormFieldOwnProps,
  libDefaults: FormFieldLibDefaults,
  options?: UseFormFieldOptions,
) {
  // Setup
  const autoId = useId();
  const attrs = useAttrs();
  const slots = useSlots();

  const { customProps, inheritedAttrs } = splitComponentProps<
    FormFieldOwnProps,
    typeof formFieldBridgeKeys
  >({
    bridgeKeys: formFieldBridgeKeys,
    props: { ...attrs, ...props },
  });

  const { class: rootClassAttr, ...restInheritedAttrs } = inheritedAttrs as {
    class?: string;
  } & Record<string, unknown>;

  const { entry: bridgeFormField, merged } = useBridgeUIComponent<
    FormFieldMerged,
    "FormField"
  >({
    libDefaults,
    props: customProps,
    componentName: "FormField",
  });

  const partsProps = computed(() => {
    return merged.value.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<FormFieldClasses>({
    props: customProps,
    entry: bridgeFormField,
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
    return options?.controlId?.() ?? merged.value.controlId ?? autoId;
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
      options?.getSizeLayer?.() ?? bridgeFormField.value?.customProps?.size,
    );

    return get(classes, merged.value.size);
  });

  // Binds
  // prettier-ignore
  const headerBind = computed(() => {
    return mergePartBind(partsProps.value?.header, {}, cn({
      // Theme classes
      [headerJustify.value]: true,
      'flex mb-1': true,
      // Custom classes
      [mergedClasses.value.header ?? ""]: true,
    }));
  });

  // prettier-ignore
  const requiredBind = computed(() => {
    return mergePartBind({}, {}, cn({
      // Theme classes
      'text-error-500 dark:text-error-500 select-none': true,
      // Custom classes
      [mergedClasses.value.required ?? ""]: true,
    }));
  });

  // prettier-ignore
  const cornerBind = computed(() => {
    return mergePartBind(partsProps.value?.corner, {}, cn({
      // Theme classes
      'text-gray-500 dark:text-gray-400': true,
      [sizeClasses.value?.corner ?? ""]: true,
      // Custom classes
      [mergedClasses.value.corner ?? ""]: true,
    }));
  });

  // prettier-ignore
  const descriptionBind = computed(() => {
    return mergePartBind(partsProps.value?.description, {}, cn({
      // Theme classes
      'mt-2 text-gray-500 dark:text-gray-400': true,
      [sizeClasses.value?.description ?? ""]: true,
      // Custom classes
      [mergedClasses.value.description ?? ""]: true,
    }));
  });

  // prettier-ignore
  const errorBind = computed(() => {
    return mergePartBind(partsProps.value?.error, {}, cn({
      // Theme classes
      'mt-2 text-error-600 dark:text-error-400': true,
      [sizeClasses.value?.error ?? ""]: true,
      // Custom classes
      [mergedClasses.value.error ?? ""]: true,
    }));
  });

  // prettier-ignore
  const labelBind = computed(() => {
    return mergePartBind(partsProps.value?.label, {}, cn({
      // Theme classes
      'inline-flex items-center gap-x-0.5 font-medium leading-none': true,
      'text-error-600 dark:text-error-400': invalidated.value,
      'text-gray-700 dark:text-gray-300': !invalidated.value,
      [sizeClasses.value?.label ?? ""]: true,
      // Custom classes
      [mergedClasses.value.label ?? ""]: true,
    }));
  });

  // prettier-ignore
  const rootBind = computed(() => {
    return mergePartBind(partsProps.value?.root, {
      class: cn(rootClassAttr, options?.rootClassName?.()),
      ...restInheritedAttrs,
    }, cn({
      // Theme classes
      "aria-disabled:pointer-events-none aria-disabled:select-none aria-disabled:opacity-60": true,
      "aria-readonly:pointer-events-none aria-readonly:select-none": true,
      [mergedClasses.value.root ?? ""]: true,
      "group w-full relative": true,
    }));
  });

  return {
    slots,
    merged,
    rootBind,
    controlId,
    errorBind,
    labelBind,
    cornerBind,
    headerBind,
    isDisabled,
    isReadonly,
    invalidated,
    requiredBind,
    ariaDescribedBy,
    descriptionBind,
  };
}

export type FormFieldApi = ReturnType<typeof useFormField>;
