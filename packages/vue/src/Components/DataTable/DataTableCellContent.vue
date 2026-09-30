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

const anchorRef = ref<null | HTMLElement>(null);

const tooltipShow = ref(false);
</script>

<template>
  <slot v-if="!ellipsis" />

  <div
    v-else
    ref="anchorRef"
    class="block min-w-0 w-full max-w-full overflow-hidden"
    v-on:focusin="tooltip ? (tooltipShow = true) : undefined"
    v-on:focusout="tooltip ? (tooltipShow = false) : undefined"
    v-on:pointerenter="tooltip ? (tooltipShow = true) : undefined"
    v-on:pointerleave="tooltip ? (tooltipShow = false) : undefined"
  >
    <div class="overflow-hidden text-ellipsis whitespace-nowrap">
      <slot />
    </div>
  </div>

  <Tooltip
    :content="tooltip"
    v-model="tooltipShow"
    :anchor-el="anchorRef"
    v-if="ellipsis && tooltip"
  />
</template>
