// ** External Imports
import { getLayerCount } from "@bridge-ui/core";
import { computed, inject } from "vue";

// ** Local Imports
import type { BridgeSnackbarApi } from "@/Actions/Snackbar/bridgeSnackbar.types";
import { BRIDGE_SNACKBAR_INJECTION_KEY } from "@/Actions/Snackbar/bridgeSnackbarInjectionKey";

export class BridgeSnackbarHostMissingError extends Error {
  constructor() {
    super(
      "useBridgeSnackbar() requires <BridgeSnackbarHost /> in the app tree.",
    );
    this.name = "BridgeSnackbarHostMissingError";
  }
}

export function useBridgeSnackbar(): BridgeSnackbarApi {
  const api = inject(BRIDGE_SNACKBAR_INJECTION_KEY);

  if (!api) {
    throw new BridgeSnackbarHostMissingError();
  }

  const stackSize = computed(() => {
    return getLayerCount(api.entries.value);
  });

  return {
    open: api.open,
    close: api.close,
    isOpen: api.isOpen,
    update: api.update,
    closeTop: api.closeTop,
    closeAll: api.closeAll,
    get stackSize() {
      return stackSize.value;
    },
  };
}
