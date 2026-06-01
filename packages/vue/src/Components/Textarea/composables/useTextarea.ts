// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { computed, onMounted, useAttrs, watch, type Ref } from "vue";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { sizeProps as textareaSizeProps } from "@bridge-ui/core/Components/Textarea";

// ** Local Imports
import { useFormField } from "@/Components/FormField/composables/useFormField";
import type {
  TextareaClasses,
  TextareaOwnProps,
} from "@/Components/Textarea/textarea.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

type TextareaRegistryProps = Pick<TextareaOwnProps, "autosize" | "classes">;

type TextareaLibDefaults = LibDefaultsShape<TextareaRegistryProps, "autosize">;

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
      classes: props.classes,
      autosize: props.autosize,
    };
  });

  const { entry: bridgeTextarea, merged: textareaMerged } =
    useBridgeUIComponent<TextareaMerged, "Textarea">({
      componentName: "Textarea",
      props: () => registryProps.value,
      libDefaults: {
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

  const formField = useFormField(
    () => ({
      ...attrs,
      ...omit(props, "autosize"),
      classes: mergedClasses.value,
      partsProps: {
        ...props.partsProps,
        container: {
          ...props.partsProps?.container,
          class: cn("min-h-20 h-auto", props.partsProps?.container?.class),
        },
      },
    }),
    {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
      withErrorIcon: true,
    },
  );

  const textareaSizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(textareaSizeProps, undefined);

    return get(classes, formField.merged.value.size ?? "md")?.input;
  });

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
        "resize-none overflow-hidden": autosize.value,
        "resize-y": !autosize.value,
        [textareaSizeClass.value ?? ""]: true,
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
