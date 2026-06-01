<script setup lang="ts">
// ** Local Imports
import type { RadioProps, RadioSlots } from "@/Components/Radio";
import { useRadio } from "@/Components/Radio";
import { hasNamedSlot, resolveNamedSlot } from "@/Utils";

defineSlots<RadioSlots>();

const props = defineProps<RadioProps>();

const { slots, merged } = useRadio(props, {
  size: "sm",
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
        type="radio"
        class="form-radio"
        :name="merged.name"
        :value="merged.value"
        :disabled="merged.disabled"
        :required="merged.required"
        :checked="merged.modelValue === merged.value"
      />

      <span>{{ merged.label }}</span>
    </label>

    <input
      v-else
      type="radio"
      class="form-radio"
      :name="merged.name"
      :value="merged.value"
      :disabled="merged.disabled"
      :required="merged.required"
      :checked="merged.modelValue === merged.value"
    />

    <component :is="resolveNamedSlot(slots, 'description')" />
  </div>
</template>
