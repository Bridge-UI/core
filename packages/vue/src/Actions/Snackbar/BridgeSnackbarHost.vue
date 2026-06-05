<script setup lang="ts">
// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, inject, provide } from "vue";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  snackbarPositionProps,
} from "@bridge-ui/core";

// ** Local Imports
import { BRIDGE_SNACKBAR_INJECTION_KEY } from "@/Actions/Snackbar/bridgeSnackbarInjectionKey";
import BridgeSnackbarItem from "@/Actions/Snackbar/BridgeSnackbarItem.vue";
import { createBridgeSnackbarApi } from "@/Actions/Snackbar/createBridgeSnackbarApi";
import { useBridgeUI } from "@/Provider/useBridgeUI";

const NESTED_HOST_WARNING =
  "[Bridge UI] Nested <BridgeSnackbarHost /> detected. useBridgeSnackbar() will target the nearest host only. Remove the extra host.";

const props = withDefaults(
  defineProps<{
    position?: keyof typeof snackbarPositionProps;
    teleportTo?: string | false;
  }>(),
  {
    teleportTo: "body",
  },
);

const parentApi = inject(BRIDGE_SNACKBAR_INJECTION_KEY, null);

if (parentApi && process.env.NODE_ENV !== "production") {
  console.warn(NESTED_HOST_WARNING);
}

const api = createBridgeSnackbarApi();
const bridge = useBridgeUI();

provide(BRIDGE_SNACKBAR_INJECTION_KEY, api);

const snackbarEntries = computed(() => api.entries.value);

const snackbarEntry = computed(() => bridge?.components.value.Snackbar);

const resolvedPosition = computed(() => {
  return (
    props.position ??
    snackbarEntry.value?.defaultProps?.position ??
    "bottom-center"
  );
});

const positionClass = computed(() => {
  const classes = mergeBridgeUILayeredClasses(
    snackbarPositionProps,
    snackbarEntry.value?.customProps?.position,
  );

  return get(classes, resolvedPosition.value);
});

const teleportDisabled = computed(() => props.teleportTo === false);

const teleportTarget = computed(() => {
  if (props.teleportTo === false) {
    return "body";
  }

  return props.teleportTo;
});
</script>

<template>
  <slot />

  <Teleport :to="teleportTarget" :disabled="teleportDisabled">
    <div
      data-snackbar-host
      :class="
        cn(
          'fixed inset-0 z-40 flex pointer-events-none px-4 py-6 sm:p-5 sm:pt-4',
          positionClass,
        )
      "
    >
      <div
        class="flex flex-col-reverse w-full max-w-sm gap-y-2 pointer-events-auto"
      >
        <BridgeSnackbarItem
          :key="entry.id"
          v-for="entry in snackbarEntries"
          :api="api"
          :entry="entry"
        />
      </div>
    </div>
  </Teleport>
</template>
