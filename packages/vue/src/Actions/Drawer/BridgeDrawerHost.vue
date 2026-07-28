<script setup lang="ts">
// ** External Imports
import {
  completeLayerHide,
  invokeLayerDismiss,
  mergeLayerShellProps,
} from "@bridge-ui/core";
import { computed, inject, provide } from "vue";

// ** Local Imports
import type { BridgeDrawerHostProps } from "@/Actions/Drawer/bridgeDrawer.types";
import { BRIDGE_DRAWER_INJECTION_KEY } from "@/Actions/Drawer/bridgeDrawerInjectionKey";
import { createBridgeDrawerApi } from "@/Actions/Drawer/createBridgeDrawerApi";
import { Drawer } from "@/Components/Drawer";

const props = defineProps<BridgeDrawerHostProps>();

const NESTED_HOST_WARNING =
  "[Bridge UI] Nested <BridgeDrawerHost /> detected. useDrawerAction() will target the nearest host only. Remove the extra host.";

const parentApi = inject(BRIDGE_DRAWER_INJECTION_KEY, null);

if (parentApi && process.env.NODE_ENV !== "production") {
  console.warn(NESTED_HOST_WARNING);
}

const api = createBridgeDrawerApi();

const drawerEntries = computed(() => api.entries.value);

provide(BRIDGE_DRAWER_INJECTION_KEY, api);
</script>

<template>
  <slot />

  <Drawer
    :key="entry.id"
    :stack-id="entry.id"
    :model-value="entry.show"
    v-for="entry in drawerEntries"
    v-on:update:model-value="api.syncShow(entry.id, $event)"
    v-bind="mergeLayerShellProps(props.drawer, entry.drawer)"
    v-on:close="invokeLayerDismiss(api.entries.value, entry.id)"
    v-on:show-change="
      (show) =>
        completeLayerHide(api.entries.value, entry.id, show, api.removeEntry)
    "
  >
    <component :is="entry.component" v-bind="entry.props" />
  </Drawer>
</template>
