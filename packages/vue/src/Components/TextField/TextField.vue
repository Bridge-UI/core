<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

// ** Local Imports
import { FormField } from "@/Components/FormField";
import { useTextField } from "@/Components/TextField/composables/useTextField";
import type {
  TextFieldOwnProps,
  TextFieldSlots,
} from "@/Components/TextField/textField.types";

defineSlots<TextFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | string | undefined>();

const props = withDefaults(defineProps<TextFieldOwnProps>(), {
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

const { formField, inputBind } = useTextField(props);
</script>

<template>
  <FormField :field="formField">
    <input v-model="value" v-bind="inputBind" />
  </FormField>
</template>
