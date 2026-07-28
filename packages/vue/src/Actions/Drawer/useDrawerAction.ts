// ** External Imports
import { getLayerCount } from "@bridge-ui/core";
import { computed, inject } from "vue";

// ** Local Imports
import type { BridgeDrawerApi } from "@/Actions/Drawer/bridgeDrawer.types";
import { BRIDGE_DRAWER_INJECTION_KEY } from "@/Actions/Drawer/bridgeDrawerInjectionKey";

export class BridgeDrawerHostMissingError extends Error {
  constructor() {
    super("useDrawerAction() requires <BridgeDrawerHost /> in the app tree.");

    this.name = "BridgeDrawerHostMissingError";
  }
}

export function useDrawerAction(): BridgeDrawerApi {
  const api = inject(BRIDGE_DRAWER_INJECTION_KEY, null);

  if (!api) {
    throw new BridgeDrawerHostMissingError();
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
    get stackSize() {
      return stackSize.value;
    },
  };
}
