// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs, useId, useSlots } from "vue";

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
    entry: bridgeFormField,
    props: customProps,
  });

  const sizePalette = computed(() => {
    const layer = mergeBridgeUILayeredClasses(
      sizeProps,
      options?.getSizeLayer?.() ?? bridgeFormField.value?.customProps?.size,
    );

    return get(layer, merged.value.size);
  });

  const controlId = computed(() => {
    return options?.controlId?.() ?? merged.value.controlId ?? autoId;
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

  const rootBind = computed(() => {
    return mergePartBind(
      partsProps.value?.root,
      {
        ...(rootClassAttr !== undefined ? { class: rootClassAttr } : {}),
        ...restInheritedAttrs,
      },
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
      cn(
        "inline-flex items-center gap-x-0.5 font-medium leading-none",
        invalidated.value
          ? "text-error-600 dark:text-error-400"
          : "text-gray-700 dark:text-gray-300",
        sizePalette.value?.label,
        mergedClasses.value.label,
      ),
    );
  });

  const requiredBind = computed(() => {
    return mergePartBind(
      {},
      {},
      cn(
        "text-error-500 dark:text-error-500 select-none",
        mergedClasses.value.required,
      ),
    );
  });

  const cornerBind = computed(() => {
    return mergePartBind(
      partsProps.value?.corner,
      {},
      cn(
        "text-gray-500 dark:text-gray-400",
        sizePalette.value?.corner,
        mergedClasses.value.corner,
      ),
    );
  });

  const descriptionBind = computed(() => {
    return mergePartBind(
      partsProps.value?.description,
      {},
      cn(
        "mt-2 text-gray-500 dark:text-gray-400",
        sizePalette.value?.description,
        mergedClasses.value.description,
      ),
    );
  });

  const errorBind = computed(() => {
    return mergePartBind(
      partsProps.value?.error,
      {},
      cn(
        "mt-2 text-error-600 dark:text-error-400",
        sizePalette.value?.error,
        mergedClasses.value.error,
      ),
    );
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
