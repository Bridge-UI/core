<script setup lang="ts">
// ** External Imports
import { ref, useTemplateRef, watch } from "vue";

// ** Local Imports
import {
  FORM_FIELD_CHROME_SLOT_NAMES,
  FormField,
} from "@/Components/FormField";
import { useTextarea } from "@/Components/Textarea/composables/useTextarea";
import type {
  TextareaOwnProps,
  TextareaSlots,
} from "@/Components/Textarea/textarea.types";
import { presentSlotNames, useOptionalModel } from "@/Utils";

defineSlots<TextareaSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | string | undefined>();

const props = withDefaults(defineProps<TextareaOwnProps>(), {
  showErrorIcon: true,
});

const textareaRef = useTemplateRef<HTMLTextAreaElement>("textarea");

const uncontrolledValue = ref<null | string | undefined>(props.defaultValue);

const value = useOptionalModel(model, uncontrolledValue);

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
    <template
      #[name]="slotData"
      v-for="name in presentSlotNames(FORM_FIELD_CHROME_SLOT_NAMES, $slots)"
    >
      <slot :name="name" v-bind="slotData || {}" />
    </template>

    <textarea ref="textarea" v-model="value" v-bind="textareaBind" />
  </FormField>
</template>
