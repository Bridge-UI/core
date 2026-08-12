<script setup lang="ts">
// ** Local Imports
import { type UseFormFieldReturn } from "@/Components/FormField/composables/useFormField";
import { Label } from "@/Components/Label";
import {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  SlotOrProp,
} from "@/Utils";

defineProps<{
  api: UseFormFieldReturn;
}>();
</script>

<template>
  <Label
    v-bind="api.fieldLabelProps.value"
    v-if="hasSlotOrProp(api.slots, 'label', api.merged.value.label)"
  >
    <SlotOrProp
      name="label"
      :slots="api.slots"
      v-if="hasNamedSlot(api.slots, 'label')"
    />

    <template v-else-if="isPropPresent(api.merged.value.label)">
      {{ api.merged.value.label }}
    </template>
  </Label>
</template>
