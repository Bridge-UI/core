<script setup lang="ts">
// ** Core Imports
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { TextField } from "@/Components/TextField";
import type { TextFieldOwnProps } from "@/Components/TextField/textField.types";

defineOptions({ inheritAttrs: false, name: "DataTableSearch" });

defineProps<{
  fieldProps?: Partial<Omit<TextFieldOwnProps, "modelValue">>;
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [query: string];
}>();

const resolveMessage = useResolveMessage();
</script>

<template>
  <TextField
    size="sm"
    hide-error-message
    start-icon="search"
    v-bind="fieldProps"
    :model-value="modelValue"
    :aria-label="resolveMessage('Search')"
    :placeholder="resolveMessage('Search')"
    v-on:update:model-value="emit('update:modelValue', $event ?? '')"
    :classes="{
      ...fieldProps?.classes,
      root: cn('w-52', fieldProps?.classes?.root),
    }"
  />
</template>
