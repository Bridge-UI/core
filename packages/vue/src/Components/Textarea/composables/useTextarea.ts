// ** External Imports
import { omit } from "es-toolkit/compat";
import { computed, onMounted, useAttrs, watch, type Ref } from "vue";

// ** Core Imports
import {
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";

// ** Local Imports
import { useFormField } from "@/Components/FormField/composables/useFormField";
import type {
  TextareaOwnProps,
  TextareaProps,
} from "@/Components/Textarea/textarea.types";
import { useBridgeUIComponent } from "@/Utils";

const textareaBridgeKeys = [
  "size",
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
) {
  // Setup
  const attrs = useAttrs();

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

  return {
    formField,
    adjustHeight,
    inputBind: formField.inputBind,
  };
}
