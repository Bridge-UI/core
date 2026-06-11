<script setup lang="ts">
// ** External Imports
import { inject, onBeforeUnmount, onMounted } from "vue";

// ** Local Imports
import type { SelectOptionProps } from "@/Components/Select/select.types";
import { SELECT_OPTION_KEY } from "@/Components/Select/selectInjectionKey";

const props = defineProps<SelectOptionProps>();

const registration = inject(SELECT_OPTION_KEY, null);

onMounted(() => {
  registration?.register({
    label: props.label,
    value: props.value,
    disabled: props.disabled,
    description: props.description,
  });
});

onBeforeUnmount(() => {
  registration?.unregister(props.value);
});
</script>

<template>
  <span hidden aria-hidden="true" />
</template>
