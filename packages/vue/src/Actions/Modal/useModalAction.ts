// ** External Imports
import { computed, inject } from "vue";

// ** Core Imports
import { getLayerCount } from "@bridge-ui/core/Layer";

// ** Local Imports
import { modalActionHosts } from "@/Actions/actionHostRegistry";
import type { BridgeModalApi } from "@/Actions/Modal/bridgeModal.types";
import { BRIDGE_MODAL_INJECTION_KEY } from "@/Actions/Modal/bridgeModalInjectionKey";

export class BridgeModalHostMissingError extends Error {
  constructor() {
    super("useModalAction() requires <BridgeModalHost /> in the app tree.");

    this.name = "BridgeModalHostMissingError";
  }
}

export function useModalAction(): BridgeModalApi {
  const api = modalActionHosts.resolve(
    inject(BRIDGE_MODAL_INJECTION_KEY, null),
  );

  if (!api) {
    throw new BridgeModalHostMissingError();
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
