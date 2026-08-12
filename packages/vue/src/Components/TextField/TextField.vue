<script setup lang="ts">
// ** External Imports
import { isUndefined } from "es-toolkit/compat";
import { computed, ref } from "vue";

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

defineSlots<TextFieldSlots>();

defineOptions({ inheritAttrs: false });

const model = defineModel<null | string | undefined>();

const props = withDefaults(defineProps<TextFieldOwnProps>(), {
  showErrorIcon: true,
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
    <template
      #[name]="slotData"
      v-for="name in FORM_FIELD_CHROME_SLOT_NAMES.filter((n) =>
        Boolean($slots[n]),
      )"
    >
      <slot :name="name" v-bind="slotData || {}" />
    </template>
    <input v-model="value" v-bind="inputBind" />
  </FormField>
</template>
