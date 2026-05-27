// ** External Imports
import { omit } from "es-toolkit/compat";
import { computed, onMounted, useAttrs, watch, type Ref } from "vue";

// ** Core Imports
import { splitComponentProps } from "@bridge-ui/core";

// ** Local Imports
import {
  formFieldOwnPropKeys,
  useFormField,
} from "@/Components/FormField/composables/useFormField";
import type {
  TextareaOwnProps,
  TextareaProps,
} from "@/Components/Textarea/textarea.types";

export function useTextarea(
  props: TextareaOwnProps,
  textareaRef: Ref<HTMLTextAreaElement | null>,
) {
  // Setup
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<TextareaProps, typeof formFieldOwnPropKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: formFieldOwnPropKeys,
    });
  });

  const inputInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["class"]);
  });

  // prettier-ignore
  const formField = useFormField(() => {
      return split.value.customProps;
    }, {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
    }, {
      controlId: () => inputInheritedAttrs.value.id,
      inputAttributes: () => inputInheritedAttrs.value,
      rootClassName: () => split.value.inheritedAttrs.class,
    });

  const autosize = computed(() => {
    return props.autosize ?? false;
  });

  const inheritedOnInput = computed(() => {
    return split.value.inheritedAttrs.onInput as
      | ((event: Event) => void)
      | undefined;
  });

  const adjustHeight = (element: HTMLTextAreaElement | null) => {
    if (!element || !autosize.value) {
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
    autosize.value,
    textareaRef.value,
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
