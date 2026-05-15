<script setup lang="ts">
// ** Local Imports
import type { SelectProps, SelectSlots } from "@/Components/Select";
import { useSelect } from "@/Components/Select";

defineSlots<SelectSlots>();

const props = defineProps<SelectProps>();

const { slots, merged } = useSelect(props, {
  size: "md",
  rounded: "sm",
  color: "primary",
  variant: "outline",
});
</script>

<template>
  <div class="w-full">
    <slot v-if="slots.label" name="label" />

    <label v-else-if="merged.label">
      {{ merged.label }}
    </label>

    <button
      class="flex w-full cursor-pointer items-center truncate"
      type="button"
    >
      <span v-if="merged.placeholder">
        {{ merged.placeholder }}
      </span>
    </button>

    <div v-if="merged.options?.length" class="mt-1">
      <div
        class="truncate text-sm"
        :key="String(option.value)"
        v-for="option in merged.options"
      >
        {{ option.label }}
      </div>
    </div>

    <slot v-if="slots.description" name="description" />

    <slot v-if="slots.error" name="error" />
  </div>
</template>
