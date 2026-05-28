<script setup lang="ts">
// ** External Imports
import { PropType, toRefs } from "vue";

// ** Local Imports
import { type UseFormFieldReturn } from "@/Components/FormField/composables/useFormField";

const props = defineProps({
  api: {
    required: true,
    type: Object as PropType<UseFormFieldReturn>,
  },
});

const { api } = toRefs(props);
</script>

<template>
  <div>
    {{ JSON.stringify(api) }}
  </div>
</template>
