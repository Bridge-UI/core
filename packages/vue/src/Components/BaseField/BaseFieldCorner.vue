<script setup lang="ts">
// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { UseBaseFieldReturn } from "@/Components/BaseField/composables/useBaseField";
import { Label } from "@/Components/Label";
import { hasNamedSlot, hasSlotOrProp } from "@/Utils";

defineProps<{
  api: UseBaseFieldReturn;
}>();

const slots = useSlots();
</script>

<template>
  <Label
    v-bind="api.fieldCornerProps.value"
    v-if="hasSlotOrProp(slots, 'corner', api.merged.value.corner)"
  >
    <slot name="corner" v-if="hasNamedSlot(slots, 'corner')" />

    <template v-else>{{ api.merged.value.corner }}</template>
  </Label>
</template>
