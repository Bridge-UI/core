<script setup lang="ts">
// ** External Imports
import { useSlots } from "vue";

// ** Local Imports
import type { UseFormControlReturn } from "@/Components/FormControl/composables/useFormControl";
import { Label } from "@/Components/Label";
import { hasNamedSlot, hasSlotOrProp } from "@/Utils";

defineProps<{
  api: UseFormControlReturn;
  name: "endLabel" | "startLabel";
}>();

const slots = useSlots();
</script>

<template>
  <Label
    v-bind="api.fieldLabelProps.value[name]"
    v-if="hasSlotOrProp(slots, name, api.merged.value[name])"
  >
    <slot :name="name" v-if="hasNamedSlot(slots, name)" />

    <template v-else>{{ api.merged.value[name] }}</template>
  </Label>
</template>
