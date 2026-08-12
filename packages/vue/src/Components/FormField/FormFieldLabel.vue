<script setup lang="ts">
// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import { type UseFormFieldReturn } from "@/Components/FormField/composables/useFormField";
import { Label } from "@/Components/Label";
import { hasNamedSlot, hasSlotOrProp } from "@/Utils";

defineProps<{
  api: UseFormFieldReturn;
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
