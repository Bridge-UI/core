<script setup lang="ts">
// ** Core Imports
import type { DataTableFilterOption } from "@bridge-ui/core/Domain";

// ** Local Imports
import { Checkbox } from "@/Components/Checkbox";
import { Radio } from "@/Components/Radio";

defineOptions({ inheritAttrs: false, name: "DataTableFilterOptions" });

const props = defineProps<{
  draft: string[];
  multiple: boolean;
  name: string;
  options: DataTableFilterOption[];
}>();

const emit = defineEmits<{
  toggle: [value: string, selected: boolean];
}>();

function isSelected(value: string) {
  if (props.multiple) {
    return props.draft.includes(value);
  }

  return props.draft[0] === value;
}
</script>

<template>
  <template :key="option.value" v-for="option in options">
    <div class="min-w-0" v-if="option.children && option.children.length > 0">
      <div
        class="px-2 py-1 text-xs font-medium text-dark-500 dark:text-dark-400"
      >
        {{ option.label }}
      </div>
      <div class="ps-2">
        <DataTableFilterOptions
          :name="name"
          :draft="draft"
          :multiple="multiple"
          :options="option.children"
          v-on:toggle="(value, selected) => emit('toggle', value, selected)"
        />
      </div>
    </div>
    <div
      v-else
      :aria-checked="isSelected(option.value)"
      :role="multiple ? 'menuitemcheckbox' : 'menuitemradio'"
      v-on:click="emit('toggle', option.value, !isSelected(option.value))"
      class="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-start hover:bg-dark-500/5 dark:hover:bg-dark-500/10"
    >
      <Checkbox
        size="sm"
        v-if="multiple"
        hide-error-message
        :end-label="option.label"
        :model-value="isSelected(option.value)"
        :classes="{ root: 'pointer-events-none' }"
      />
      <Radio
        v-else
        size="sm"
        :name="name"
        hide-error-message
        :value="option.value"
        :model-value="draft[0]"
        :end-label="option.label"
        :classes="{ root: 'pointer-events-none' }"
      />
    </div>
  </template>
</template>
