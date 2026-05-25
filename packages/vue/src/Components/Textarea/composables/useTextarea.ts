// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { computed, onMounted, useAttrs, useSlots, watch, type Ref } from "vue";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  roundedProps,
  sizeProps,
  variantProps,
} from "@bridge-ui/core/Components/Textarea";

// ** Local Imports
import { useFormField } from "@/Components/FormField/composables/useFormField";
import type {
  TextareaClasses,
  TextareaOwnProps,
  TextareaPartsProps,
  TextareaProps,
} from "@/Components/Textarea/textarea.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const textareaBridgeKeys = [
  "color",
  "error",
  "label",
  "corner",
  "classes",
  "rounded",
  "variant",
  "autosize",
  "disabled",
  "readonly",
  "required",
  "partsProps",
  "description",
  "errorMessage",
] as const satisfies readonly (keyof TextareaOwnProps)[];

type TextareaLibDefaults = LibDefaultsShape<
  TextareaOwnProps,
  "color" | "rounded" | "size" | "variant"
>;

type TextareaMerged = MergeLibDefaults<TextareaOwnProps, TextareaLibDefaults>;

export function useTextarea(
  props: TextareaOwnProps,
  libDefaults: TextareaLibDefaults,
  textareaRef: Ref<HTMLTextAreaElement | null>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  // Setup
  const attrs = useAttrs();
  const slots = useSlots();

  const split = computed(() => {
    return splitComponentProps<TextareaProps, typeof textareaBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: textareaBridgeKeys,
    });
  });

  const { entry: bridgeTextarea, merged } = useBridgeUIComponent<
    TextareaMerged,
    "Textarea"
  >({
    libDefaults,
    componentName: "Textarea",
    props: () => split.value.customProps,
  });

  const textareaInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["onInput", "class"]);
  });

  // prettier-ignore
  const formField = useFormField(() => {
    return split.value.customProps;
  }, { size: libDefaults.size }, {
    rootClassName: () => split.value.inheritedAttrs.class,
    controlId: () => textareaInheritedAttrs.value.id as string | undefined,
  });

  const partsProps = computed((): TextareaPartsProps | undefined => {
    return merged.value.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TextareaClasses>({
    entry: bridgeTextarea,
    props: () => split.value.customProps,
  });

  // Classes
  const variantClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeTextarea.value?.customProps?.variant,
    );

    return get(classes, merged.value.variant);
  });

  const roundedClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeTextarea.value?.customProps?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const sizeClasses = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeTextarea.value?.customProps?.size,
    );

    return get(classes, merged.value.size);
  });

  // Elements
  const isUnderlined = computed(() => {
    return merged.value.variant === "underlined";
  });

  const isDisabled = formField.isDisabled;
  const isReadonly = formField.isReadonly;
  const invalidated = formField.invalidated;

  const colorClasses = computed(() => {
    const colorKey =
      invalidated.value || merged.value.error === true
        ? "error"
        : merged.value.color;

    return get(variantClasses.value, colorKey);
  });

  const inheritedOnInput = computed(() => {
    return split.value.inheritedAttrs.onInput as
      | ((event: Event) => void)
      | undefined;
  });

  const adjustHeight = (element: HTMLTextAreaElement | null) => {
    if (!element || !merged.value.autosize) {
      return;
    }

    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleAutosize = (event: Event) => {
    adjustHeight(event.target as HTMLTextAreaElement);

    inheritedOnInput.value?.(event);
  };

  // prettier-ignore
  watch(() => [
    textareaRef.value,
    merged.value.autosize,
  ] as const, () => {
    adjustHeight(textareaRef.value);
  }, { immediate: true });

  onMounted(() => {
    adjustHeight(textareaRef.value);
  });

  // prettier-ignore
  const textareaBind = computed(() => {
    return mergePartBind({
      ...partsProps.value?.input,
      disabled: isDisabled.value,
      readonly: isReadonly.value,
      id: formField.controlId.value,
      "aria-invalid": invalidated.value || undefined,
      "aria-describedby": formField.ariaDescribedBy.value,
      onInput: merged.value.autosize ? handleAutosize : inheritedOnInput.value,
    }, textareaInheritedAttrs.value, cn({
      // Theme classes
      "w-full min-w-0 bg-transparent border-0 shadow-none resize-none overflow-hidden": merged.value.autosize,
      "w-full min-w-0 bg-transparent border-0 shadow-none resize-y": !merged.value.autosize,
      "text-gray-900 dark:text-gray-100 placeholder:text-gray-400": true,
      "outline-none ring-0 focus:outline-none focus:ring-0": true,
      [roundedClasses.value ?? ""]: !isUnderlined.value,
      [colorClasses.value?.focus ?? ""]: true,
      [colorClasses.value?.base ?? ""]: true,
      "disabled:cursor-not-allowed": true,
      "rounded-none": isUnderlined.value,
      [sizeClasses.value ?? ""]: true,
      // Error classes
      "border-error-500 focus:border-error-600 dark:border-error-600": invalidated.value,
      // Custom classes
      [mergedClasses.value.input ?? ""]: true,
    }));
  });

  // prettier-ignore
  const containerBind = computed(() => {
    return mergePartBind(partsProps.value?.container, {}, cn({
      // Theme classes
      "bg-gray-100 dark:bg-gray-800": isDisabled.value && !invalidated.value,
      [roundedClasses.value ?? ""]: !isUnderlined.value,
      "transition-all ease-in-out duration-150": true,
      "group/field relative w-full": true,
      "rounded-none": isUnderlined.value,
      // Custom classes
      [mergedClasses.value.container ?? ""]: true,
    }));
  });

  return {
    slots,
    merged,
    formField,
    isDisabled,
    isReadonly,
    invalidated,
    adjustHeight,
    textareaBind,
    containerBind,
    rootBind: formField.rootBind,
  };
}
