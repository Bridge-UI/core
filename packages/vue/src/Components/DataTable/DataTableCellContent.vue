<script setup lang="ts">
// ** External Imports
import { ref } from "vue";

// ** Local Imports
import { Tooltip } from "@/Components/Tooltip";

defineOptions({ inheritAttrs: false, name: "DataTableCellContent" });

defineProps<{
  ellipsis: boolean;
  tooltip?: string;
}>();

const tooltipReady = ref(false);

function markTooltipReady() {
  tooltipReady.value = true;
}
</script>

<template>
  <slot v-if="!ellipsis" />

  <div
    v-else-if="!tooltip"
    class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
  >
    <slot />
  </div>

  <div
    v-else-if="!tooltipReady"
    v-on:focusin="markTooltipReady"
    v-on:pointerenter="markTooltipReady"
    class="block min-w-0 w-full max-w-full"
  >
    <div class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
      <slot />
    </div>
  </div>

  <Tooltip
    v-else
    :content="tooltip"
    :custom-props="{
      trigger: { class: 'block min-w-0 w-full max-w-full' },
    }"
  >
    <template #trigger>
      <div class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
        <slot />
      </div>
    </template>
  </Tooltip>
</template>
