<script setup lang="ts">
// ** Core Imports
import type { SnackbarPosition } from "@bridge-ui/core";

// ** Local Imports
import { BridgeModalHost } from "@/Actions/Modal";
import { BridgeSnackbarHost } from "@/Actions/Snackbar";

withDefaults(
  defineProps<{
    snackbar?: {
      teleportTo?: string | false;
      position?: keyof SnackbarPosition;
    };
  }>(),
  {
    snackbar: () => ({}),
  },
);
</script>

<template>
  <BridgeSnackbarHost v-bind="snackbar">
    <BridgeModalHost>
      <slot />
    </BridgeModalHost>
  </BridgeSnackbarHost>
</template>
