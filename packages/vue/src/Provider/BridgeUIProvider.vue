<script setup lang="ts">
// ** External Imports
import { computed, inject, provide } from "vue";

// ** Core Imports
import type { BridgeUIComponentsConfig, BridgeUIGlobal } from "@bridge-ui/core";

// ** Local Imports
import { BridgeModalHost } from "@/Actions/Modal";
import { BridgeSnackbarHost } from "@/Actions/Snackbar";
import type { BridgeUIContextApi } from "@/Provider/bridgeUITypes";
import { createBridgeUIApi } from "@/Provider/createBridgeUIApi";
import { BRIDGE_UI_INJECTION_KEY } from "@/Provider/injectionKey";

const props = defineProps<{
  global?: Partial<BridgeUIGlobal>;
  components?: BridgeUIComponentsConfig;
}>();

const parent = inject<BridgeUIContextApi | undefined>(
  BRIDGE_UI_INJECTION_KEY,
  undefined,
);

const optionsRef = computed(() => {
  return {
    global: props.global ?? {},
    components: props.components ?? {},
  };
});

const api = createBridgeUIApi(parent, optionsRef);

provide(BRIDGE_UI_INJECTION_KEY, api);
</script>

<template>
  <BridgeSnackbarHost>
    <BridgeModalHost>
      <slot />
    </BridgeModalHost>
  </BridgeSnackbarHost>
</template>
