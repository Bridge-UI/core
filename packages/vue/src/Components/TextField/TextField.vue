<script setup lang="ts">
// ** External Imports
import { ref } from "vue";

// ** Local Imports
import {
  FORM_FIELD_CHROME_SLOT_NAMES,
  FormField,
} from "@/Components/FormField";
import { useTextField } from "@/Components/TextField/composables/useTextField";
import type {
  TextFieldOwnProps,
  TextFieldSlots,
} from "@/Components/TextField/textField.types";
import { presentSlotNames, useOptionalModel } from "@/Utils";

defineSlots<TextFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | string | undefined>();

const props = withDefaults(defineProps<TextFieldOwnProps>(), {
  showErrorIcon: true,
});

const uncontrolledValue = ref<null | string | undefined>(props.defaultValue);

const value = useOptionalModel(model, uncontrolledValue);

const { formField, inputBind } = useTextField(props);
</script>

<template>
  <FormField :field="formField">
    <template
      #[name]="slotData"
      v-for="name in presentSlotNames(FORM_FIELD_CHROME_SLOT_NAMES, $slots)"
    >
      <slot :name="name" v-bind="slotData || {}" />
    </template>

    <input v-model="value" v-bind="inputBind" />
  </FormField>
</template>
