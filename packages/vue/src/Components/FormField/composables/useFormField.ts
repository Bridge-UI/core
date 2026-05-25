// ** External Imports
import { get } from "es-toolkit/compat";
import {
  type ClassValue,
  computed,
  type MaybeRefOrGetter,
  toValue,
  useAttrs,
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

/** Props forwarded from field wrappers (e.g. TextField) into `useFormField`. */
export const formFieldOwnPropKeys = [
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
};

export function useFormField(
  props: MaybeRefOrGetter<Omit<FormFieldOwnProps, "field">>,
  libDefaults: FormFieldLibDefaults,
  options?: UseFormFieldOptions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  // Setup
  const autoId = useId();
  const attrs = useAttrs();
  const slots = useSlots();

  const split = computed(() =>
    splitComponentProps<
      Omit<FormFieldOwnProps, "field">,
      typeof formFieldOwnPropKeys
    >({
      bridgeKeys: formFieldOwnPropKeys,
      props: { ...attrs, ...toValue(props) },
    }),
  );

  const customProps = computed(() => split.value.customProps);

  const rootInheritedAttrs = computed(() => split.value.inheritedAttrs);

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
      bridgeFormField.value?.customProps?.size,
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
      class: options?.rootClassName?.(),
      ...rootInheritedAttrs,
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
