<script setup lang="ts">
// ** Local Imports
import type { CheckboxProps, CheckboxSlots } from "@/Components/Checkbox";
import { useCheckbox } from "@/Components/Checkbox";
import { hasNamedSlot, resolveNamedSlot } from "@/Utils";

defineSlots<CheckboxSlots>();

const props = defineProps<CheckboxProps>();

const { slots, merged } = useCheckbox(props, {
  size: "sm",
  rounded: "sm",
  color: "primary",
});
</script>

<template>
  <div class="w-full">
    <component
      v-if="hasNamedSlot(slots, 'label')"
      :is="resolveNamedSlot(slots, 'label')"
    />

    <label v-else-if="merged.label" class="flex items-center gap-2">
      <input
        type="checkbox"
        class="form-checkbox"
        :disabled="merged.disabled"
        :required="merged.required"
        :checked="merged.modelValue"
      />

      <span>{{ merged.label }}</span>
    </label>

    <input
      v-else
      type="checkbox"
      class="form-checkbox"
      :disabled="merged.disabled"
      :required="merged.required"
      :checked="merged.modelValue"
    />

    <component :is="resolveNamedSlot(slots, 'description')" />

    <component :is="resolveNamedSlot(slots, 'error')" />
  </div>
</template>
