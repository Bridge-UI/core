<script setup lang="ts">
// ** Local Imports
import type { RadioProps, RadioSlots } from "@/Components/Radio";
import { useRadio } from "@/Components/Radio";

defineSlots<RadioSlots>();

const props = defineProps<RadioProps>();

const { slots, merged } = useRadio(props, {
  size: "sm",
  color: "primary",
});
</script>

<template>
  <div class="w-full">
    <slot v-if="slots.label" name="label" />

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

    <slot v-if="slots.description" name="description" />
  </div>
</template>
