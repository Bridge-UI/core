<script setup lang="ts">
// ** Local Imports
import { Label } from "@/Components/Label";
import type { UseOtpFieldReturn } from "@/Components/OtpField/composables/useOtpField";
import {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  resolveNamedSlot,
} from "@/Utils";

defineProps<{
  api: UseOtpFieldReturn;
}>();
</script>

<template>
  <Label
    v-bind="api.fieldLabelProps.value"
    v-if="hasSlotOrProp(api.slots, 'label', api.merged.value.label)"
  >
    <component
      v-if="hasNamedSlot(api.slots, 'label')"
      :is="resolveNamedSlot(api.slots, 'label')"
    />

    <template v-else-if="isPropPresent(api.merged.value.label)">
      {{ api.merged.value.label }}
    </template>
  </Label>
</template>
