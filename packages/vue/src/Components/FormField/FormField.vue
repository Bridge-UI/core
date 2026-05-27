<script setup lang="ts">
// ** External Imports
import { type Component, computed } from "vue";

// ** Local Imports
import FilledFormField from "@/Components/FormField/FilledFormField.vue";
import NotchedFormField from "@/Components/FormField/NotchedFormField.vue";
import OutlinedFormField from "@/Components/FormField/OutlinedFormField.vue";
import StackedFormField from "@/Components/FormField/StackedFormField.vue";
import UnderlinedFormField from "@/Components/FormField/UnderlinedFormField.vue";
import {
  useFormField,
  type UseFormFieldReturn,
} from "@/Components/FormField/composables/useFormField";
import type {
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";

defineSlots<FormFieldSlots>();

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormFieldOwnProps>(), {
  withErrorIcon: true,
});

const formFieldProps = computed(() => {
  const { field: _field, ...rest } = props;

  return rest;
});

const local = useFormField(formFieldProps, {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
  withErrorIcon: true,
});

const api = computed((): UseFormFieldReturn => {
  return (props.field ?? local) as UseFormFieldReturn;
});

const shells: Record<string, Component> = {
  filled: FilledFormField,
  notched: NotchedFormField,
  stacked: StackedFormField,
  outline: OutlinedFormField,
  underlined: UnderlinedFormField,
};

const shell = computed(() => {
  const variant = api.value.merged.value.variant ?? "outline";

  return shells[variant] ?? OutlinedFormField;
});
</script>

<template>
  <component :is="shell" :api="api">
    <slot />
  </component>
</template>
