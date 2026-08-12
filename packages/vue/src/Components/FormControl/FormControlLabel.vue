<script setup lang="ts">
// ** Local Imports
import type { UseFormControlReturn } from "@/Components/FormControl/composables/useFormControl";
import { Label } from "@/Components/Label";
import { hasNamedSlot, hasSlotOrProp, isPropPresent } from "@/Utils";

defineProps<{
  api: UseFormControlReturn;
  name: "endLabel" | "startLabel";
}>();
</script>

<template>
  <Label
    v-bind="api.fieldLabelProps.value[name]"
    v-if="hasSlotOrProp(api.slots, name, api.merged.value[name])"
  >
    <slot v-if="hasNamedSlot(api.slots, name)" />

    <template v-else-if="isPropPresent(api.merged.value[name])">
      {{ api.merged.value[name] }}
    </template>
  </Label>
</template>
