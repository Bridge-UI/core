<script setup lang="ts">
// ** External Imports
import { computed, ref } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import DataTableToolbarButton from "@/Components/DataTable/DataTableToolbarButton.vue";
import { TextField } from "@/Components/TextField";
import type { TextFieldOwnProps } from "@/Components/TextField/textField.types";

defineOptions({ inheritAttrs: false, name: "DataTableSearch" });

const props = defineProps<{
  fieldProps?: Partial<Omit<TextFieldOwnProps, "modelValue">>;
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [query: string];
}>();

const resolveMessage = useResolveMessage();
const open = ref(props.modelValue.length > 0);
const label = computed(() => {
  return resolveMessage("Search");
});
const expanded = computed(() => {
  return open.value || props.modelValue.length > 0;
});
</script>

<template>
  <DataTableToolbarButton
    icon="search"
    :label="label"
    v-if="!expanded"
    v-on:click="open = true"
  />
  <TextField
    v-else
    size="sm"
    hide-error-message
    start-icon="search"
    :aria-label="label"
    :placeholder="label"
    v-bind="fieldProps"
    :model-value="modelValue"
    v-on:update:model-value="emit('update:modelValue', $event ?? '')"
    :classes="{
      ...fieldProps?.classes,
      root: cn('w-48', fieldProps?.classes?.root),
    }"
  />
</template>
