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
    position?: keyof typeof snackbarPositionProps;
    teleportTo?: string | false;
    snackbar?: BridgeSnackbarShellProps;
    max?: number;
    timeout?: number | false;
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
  return resolvedPosition.value.startsWith("top")
    ? "flex-col"
    : "flex-col-reverse";
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
        :class="
          cn('flex w-full max-w-sm gap-y-2 pointer-events-auto', stackClass)
        "
      >
        <BridgeSnackbarItem
          :key="entry.id"
          v-for="entry in snackbarEntries"
          :api="api"
          :entry="entry"
          :host-snackbar="props.snackbar"
        />
      </div>
    </div>
  </Teleport>
</template>
