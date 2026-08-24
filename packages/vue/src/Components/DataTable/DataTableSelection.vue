<script setup lang="ts">
// ** External Imports
import { computed } from "vue";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { Checkbox } from "@/Components/Checkbox";
import type { CheckboxProps } from "@/Components/Checkbox/checkbox.types";
import type { DataTableCustomProps } from "@/Components/DataTable/dataTable.types";
import { Radio } from "@/Components/Radio";

defineOptions({ inheritAttrs: false, name: "DataTableSelection" });

const props = defineProps<{
  checkboxProps?: DataTableCustomProps["checkbox"];
  checked: boolean;
  indeterminate?: boolean;
  kind: "row" | "page";
  multiple?: boolean;
  name?: string;
  radioProps?: DataTableCustomProps["radio"];
  size: CheckboxProps["size"];
  value?: string;
}>();

const emit = defineEmits<{
  change: [checked: boolean];
}>();

const resolveMessage = useResolveMessage();

const ariaLabel = computed(() => {
  if (props.kind === "page") {
    return resolveMessage("Select all rows");
  }

  return resolveMessage("Select row");
});
</script>

<template>
  <Checkbox
    :size="size"
    hide-error-message
    :model-value="checked"
    :aria-label="ariaLabel"
    :indeterminate="indeterminate"
    v-bind="checkboxProps"
    v-if="kind === 'page' || multiple"
    v-on:update:model-value="(checked) => emit('change', Boolean(checked))"
  />

  <Radio
    v-else
    :size="size"
    :name="name"
    :value="value"
    hide-error-message
    :aria-label="ariaLabel"
    v-bind="radioProps"
    :model-value="checked ? value : ''"
    v-on:update:model-value="() => emit('change', true)"
  />
</template>
