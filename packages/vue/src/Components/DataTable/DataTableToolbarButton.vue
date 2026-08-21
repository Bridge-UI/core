<script setup lang="ts">
// ** Local Imports
import { Button } from "@/Components/Button";
import type { ButtonOwnProps } from "@/Components/Button/button.types";
import { Tooltip } from "@/Components/Tooltip";

defineOptions({ inheritAttrs: false, name: "DataTableToolbarButton" });

defineProps<{
  buttonProps?: Partial<Omit<ButtonOwnProps, "icon">>;
  icon: "columns";
  label: string;
}>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <Tooltip :content="label">
    <template #trigger>
      <Button
        size="sm"
        color="dark"
        :icon="icon"
        type="button"
        density="mini"
        :aria-label="label"
        v-bind="buttonProps"
        v-on:click="emit('click', $event)"
      />
    </template>
  </Tooltip>
</template>
