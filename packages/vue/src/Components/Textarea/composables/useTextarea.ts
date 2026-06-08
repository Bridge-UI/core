// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { computed, onMounted, useAttrs, watch, type Ref } from "vue";

// ** Core Imports
import {
  adjustAutosizeTextareaHeight,
  cn,
  mergeBridgeUILayeredClasses,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { resizeProps } from "@bridge-ui/core/Components/Textarea";

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

  const likeInput = computed(() => {
    return Boolean(props.likeInput);
  });

  const autosize = computed(() => {
    if (likeInput.value) {
      return props.autosize ?? true;
    }

    return Boolean(textareaMerged.value.autosize);
  });

  const rows = computed(() => {
    const rowsAttr = (attrs as { rows?: number | string }).rows;

    if (likeInput.value) {
      return rowsAttr ?? 1;
    }

    return rowsAttr;
  });

  const formField = useFormField(
    () => ({
      ...omit(attrs, ["rows"]),
      ...omit(props, ["autosize", "resize", "likeInput"]),
      classes: mergedClasses.value,
    }),
    {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
      withErrorIcon: true,
    },
    {
      control: () => "textarea",
      likeInput: () => likeInput.value,
    },
  );

  const resize = computed((): TextareaProps["resize"] => {
    if (autosize.value) {
      return "none";
    }

    return textareaMerged.value.resize ?? "none";
  });

  const resizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      resizeProps,
      bridgeTextarea.value?.customProps?.resize,
    );

    return get(classes, resize.value ?? "none");
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

    adjustAutosizeTextareaHeight(element);
  };

  const handleAutosize = (event: Event) => {
    adjustHeight(event.target as HTMLTextAreaElement);
    inheritedOnInput.value?.(event);
  };

  const textareaBind = computed(() => {
    return mergePartBind(
      formField.inputBind.value,
      {
        ...(autosize.value ? { onInput: handleAutosize } : {}),
        ...(!isNil(rows.value) ? { rows: rows.value } : {}),
      },
      cn({
        "flex-1 min-w-0": likeInput.value,
        "overflow-hidden": autosize.value,
        "min-w-0 flex-none": !likeInput.value,
        [resizeClass.value ?? ""]: true,
      }),
    );
  });

  watch(
    () =>
      [
        autosize.value,
        likeInput.value,
        textareaRef.value,
        formField.isStacked.value,
      ] as const,
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
