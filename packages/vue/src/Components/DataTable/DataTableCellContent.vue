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

const tooltipShow = ref(false);
const tooltipReady = ref(false);

function openDeferredTooltip() {
  tooltipShow.value = true;
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
    v-on:focusin="openDeferredTooltip"
    v-on:pointerenter="openDeferredTooltip"
    class="block min-w-0 w-full max-w-full"
  >
    <div class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
      <slot />
    </div>
  </div>

  <Tooltip
    v-else
    :content="tooltip"
    v-model="tooltipShow"
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
