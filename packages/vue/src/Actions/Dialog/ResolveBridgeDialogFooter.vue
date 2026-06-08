<script setup lang="ts">
// ** Local Imports
import BridgeDialogAction from "@/Actions/Dialog/BridgeDialogAction.vue";
import type { ResolveBridgeDialogFooterOptions } from "@/Actions/Dialog/bridgeDialog.types";

const props = defineProps<ResolveBridgeDialogFooterOptions>();

function dismissFromAction(onClick?: () => void) {
  onClick?.();
  props.dismiss();
}
</script>

<template>
  <div
    class="flex justify-end gap-2"
    v-if="props.actions?.accept || props.actions?.reject"
  >
    <BridgeDialogAction
      role="reject"
      :action="props.actions.reject"
      :accept-color="props.acceptColor"
      v-if="props.actions?.reject?.label"
      v-on:run="() => dismissFromAction(props.actions?.reject?.onClick)"
    />

    <BridgeDialogAction
      role="accept"
      :action="props.actions.accept"
      :accept-color="props.acceptColor"
      v-if="props.actions?.accept?.label"
      v-on:run="() => dismissFromAction(props.actions?.accept?.onClick)"
    />
  </div>
</template>
