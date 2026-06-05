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
import type { BridgeSnackbarShellProps } from "@/Actions/Snackbar/bridgeSnackbar.types";
import { BRIDGE_SNACKBAR_INJECTION_KEY } from "@/Actions/Snackbar/bridgeSnackbarInjectionKey";
import BridgeSnackbarItem from "@/Actions/Snackbar/BridgeSnackbarItem.vue";
import { createBridgeSnackbarApi } from "@/Actions/Snackbar/createBridgeSnackbarApi";
import { useBridgeUI } from "@/Provider/useBridgeUI";

const NESTED_HOST_WARNING =
  "[Bridge UI] Nested <BridgeSnackbarHost /> detected. useSnackbarAction() will target the nearest host only. Remove the extra host.";

const props = withDefaults(
  defineProps<{
    max?: number;
    timeout?: number | false;
    teleportTo?: string | false;
    snackbar?: BridgeSnackbarShellProps;
    position?: keyof typeof snackbarPositionProps;
  }>(),
  {
    teleportTo: "body",
  },
);

const parentApi = inject(BRIDGE_SNACKBAR_INJECTION_KEY, null);

if (parentApi && process.env.NODE_ENV !== "production") {
  console.warn(NESTED_HOST_WARNING);
}

const api = createBridgeSnackbarApi({
  max: props.max,
  timeout: props.timeout,
});

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

const stackClass = computed(() => {
  if (resolvedPosition.value.startsWith("top")) {
    return "flex-col";
  }

  return "flex-col-reverse";
});
</script>

<template>
  <slot />

  <Teleport :to="teleportTarget" :disabled="teleportDisabled">
    <div
      data-snackbar-host
      :class="
        cn({
          'fixed inset-0 z-40 flex pointer-events-none px-4 py-6 sm:p-5 sm:pt-4': true,
          [positionClass ?? '']: true,
        })
      "
    >
      <div
        :class="
          cn({
            'flex w-full max-w-sm gap-y-2 pointer-events-auto': true,
            [stackClass]: true,
          })
        "
      >
        <BridgeSnackbarItem
          :api="api"
          :entry="entry"
          :key="entry.id"
          :host-snackbar="props.snackbar"
          v-for="entry in snackbarEntries"
        />
      </div>
    </div>
  </Teleport>
</template>
