<script setup lang="ts">
// ** External Imports
import { computed, inject, provide } from "vue";

// ** Local Imports
import type { BridgeUIComponentsConfig, BridgeUIGlobal } from "@/Config";
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

const optionsRef = computed(() => ({
  global: props.global ?? {},
  components: props.components ?? {},
}));

const api = createBridgeUIApi(parent, optionsRef);

provide(BRIDGE_UI_INJECTION_KEY, api);
</script>

<template>
  <slot />
</template>
