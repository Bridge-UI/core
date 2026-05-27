<script setup lang="ts">
// ** Local Imports
import { FormField } from "@/Components/FormField";
import { useTextField } from "@/Components/TextField/composables/useTextField";
import type {
  TextFieldOwnProps,
  TextFieldSlots,
} from "@/Components/TextField/textField.types";

defineSlots<TextFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<string | null | undefined>();

const props = withDefaults(defineProps<TextFieldOwnProps>(), {
  withErrorIcon: true,
});

const { formField, inputBind } = useTextField(props, {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
  withErrorIcon: true,
});
</script>

<template>
  <FormField :field="formField">
    <input v-model="model" v-bind="inputBind" />
  </FormField>
</template>
