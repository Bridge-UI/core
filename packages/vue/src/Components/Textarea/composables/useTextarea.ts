// ** External Imports
import { omit } from "es-toolkit/compat";
import { computed, onMounted, useAttrs, watch, type Ref } from "vue";

// ** Core Imports
import {
  cn,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";

// ** Local Imports
import { useFormField } from "@/Components/FormField/composables/useFormField";
import type {
  TextareaClasses,
  TextareaOwnProps,
  TextareaProps,
} from "@/Components/Textarea/textarea.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const resizeClassMap = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
} as const satisfies Record<NonNullable<TextareaProps["resize"]>, string>;

type TextareaRegistryProps = Pick<
  TextareaOwnProps,
  "resize" | "classes" | "autosize"
>;

type TextareaLibDefaults = LibDefaultsShape<
  TextareaRegistryProps,
  "resize" | "autosize"
>;

type TextareaMerged = MergeLibDefaults<
  TextareaRegistryProps,
  TextareaLibDefaults
>;

export function useTextarea(
  props: TextareaOwnProps,
  textareaRef: Ref<HTMLTextAreaElement | null>,
) {
  const attrs = useAttrs();

  const registryProps = computed((): TextareaRegistryProps => {
    return {
      resize: props.resize,
      classes: props.classes,
      autosize: props.autosize,
    };
  });

  const { entry: bridgeTextarea, merged: textareaMerged } =
    useBridgeUIComponent<TextareaMerged, "Textarea">({
      componentName: "Textarea",
      props: () => registryProps.value,
      libDefaults: {
        resize: "none",
        autosize: false,
      },
    });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TextareaClasses>({
    entry: bridgeTextarea,
    props: () => registryProps.value,
  });

  const autosize = computed(() => {
    return Boolean(textareaMerged.value.autosize);
  });

  const resize = computed((): TextareaProps["resize"] => {
    if (autosize.value) {
      return "none";
    }

    return textareaMerged.value.resize ?? "none";
  });

  const formField = useFormField(
    () => ({
      ...attrs,
      ...omit(props, ["autosize", "resize"]),
      classes: mergedClasses.value,
    }),
    {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
      withErrorIcon: true,
    },
    { control: () => "textarea" },
  );

  const inheritedOnInput = computed(() => {
    return (attrs as Record<string, unknown>).onInput as
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

  const textareaBind = computed(() => {
    return mergePartBind(
      formField.inputBind.value,
      autosize.value ? { onInput: handleAutosize } : {},
      cn({
        "min-w-0 flex-none": true,
        "overflow-hidden": autosize.value,
        [resizeClassMap[resize.value ?? "none"]]: true,
      }),
    );
  });

  watch(
    () => [autosize.value, textareaRef.value] as const,
    () => {
      adjustHeight(textareaRef.value);
    },
    { immediate: true },
  );

  onMounted(() => {
    adjustHeight(textareaRef.value);
  });

  return {
    formField,
    adjustHeight,
    textareaBind,
  };
}
