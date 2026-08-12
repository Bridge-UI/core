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
    v-bind="api.fieldLabelProps.value"
    v-if="hasSlotOrProp(slots, 'label', api.merged.value.label)"
  >
    <slot name="label" v-if="hasNamedSlot(slots, 'label')" />

    <template v-else>{{ api.merged.value.label }}</template>
  </Label>
</template>
