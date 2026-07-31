<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref, useTemplateRef, watch } from "vue";

// ** Local Imports
import { FormField } from "@/Components/FormField";
import { useTextarea } from "@/Components/Textarea/composables/useTextarea";
import type {
  TextareaOwnProps,
  TextareaSlots,
} from "@/Components/Textarea/textarea.types";

defineSlots<TextareaSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | string | undefined>();

const props = withDefaults(defineProps<TextareaOwnProps>(), {
  withErrorIcon: true,
});

const uncontrolledValue = ref<null | string | undefined>(props.defaultValue);

const value = computed({
  set: (next) => {
    model.value = next;
    uncontrolledValue.value = next;
  },
  get: () => {
    return isUndefined(model.value) ? uncontrolledValue.value : model.value;
  },
});

const textareaRef = useTemplateRef<HTMLTextAreaElement>("textarea");

const { formField, textareaBind, adjustHeight } = useTextarea(
  props,
  textareaRef,
);

watch(value, () => {
  adjustHeight(textareaRef.value);
});
</script>

<template>
  <FormField :field="formField">
    <textarea ref="textarea" v-model="value" v-bind="textareaBind" />
  </FormField>
</template>
