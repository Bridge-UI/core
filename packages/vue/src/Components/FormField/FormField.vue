<script setup lang="ts">
// ** External Imports
import { get } from "es-toolkit/compat";
import { type Component, computed, useSlots } from "vue";

// ** Local Imports
import FilledFormField from "@/Components/FormField/FilledFormField.vue";
import NotchedFormField from "@/Components/FormField/NotchedFormField.vue";
import OutlinedFormField from "@/Components/FormField/OutlinedFormField.vue";
import StackedFormField from "@/Components/FormField/StackedFormField.vue";
import UnderlinedFormField from "@/Components/FormField/UnderlinedFormField.vue";
import { type UseFormFieldReturn } from "@/Components/FormField/composables/useFormField";
import type { FormFieldSlots } from "@/Components/FormField/formField.types";

defineSlots<FormFieldSlots>();

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  field: UseFormFieldReturn;
}>();

const localSlots = useSlots();

const api = computed((): UseFormFieldReturn => {
  return {
    ...props.field,
    slots: {
      ...props.field.slots,
      ...localSlots,
    },
  };
});

const shells: Record<string, Component> = {
  filled: FilledFormField,
  notched: NotchedFormField,
  stacked: StackedFormField,
  outline: OutlinedFormField,
  underlined: UnderlinedFormField,
};

const shell = computed(() => {
  const variant = api.value.variantKey.value;

  return get(shells, variant, OutlinedFormField);
});
</script>

<template>
  <component :is="shell" :api="api">
    <slot />
  </component>
</template>
