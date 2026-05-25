<script setup lang="ts">
// ** External Imports
import { useTemplateRef, watch } from "vue";

// ** Local Imports
import { FormField } from "@/Components/FormField";
import { useTextarea } from "@/Components/Textarea/composables/useTextarea";
import type {
  TextareaOwnProps,
  TextareaSlots,
} from "@/Components/Textarea/textarea.types";

defineSlots<TextareaSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<string | null | undefined>();

const props = withDefaults(defineProps<TextareaOwnProps>(), {});

const textareaRef = useTemplateRef<HTMLTextAreaElement>("textarea");

const { formField, textareaBind, containerBind, adjustHeight } = useTextarea(
  props,
  {
    size: "md",
    rounded: "md",
    color: "primary",
    variant: "outline",
  },
  textareaRef,
);

watch(model, () => {
  adjustHeight(textareaRef.value);
});
</script>

<template>
  <FormField :field="formField">
    <div v-bind="containerBind">
      <textarea ref="textareaRef" v-model="model" v-bind="textareaBind" />
    </div>
  </FormField>
</template>
