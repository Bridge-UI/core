<script setup lang="ts">
// ** External Imports
import { inject, onBeforeUnmount, onMounted } from "vue";

// ** Local Imports
import type { AutocompleteOptionProps } from "@/Components/Autocomplete/autocomplete.types";
import { AUTOCOMPLETE_OPTION_KEY } from "@/Components/Autocomplete/autocompleteInjectionKey";

defineOptions({ inheritAttrs: false, name: "AutocompleteOption" });

const props = defineProps<AutocompleteOptionProps>();

const registration = inject(AUTOCOMPLETE_OPTION_KEY, null);

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
