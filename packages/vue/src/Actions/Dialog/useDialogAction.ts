// ** External Imports
import { getLayerCount } from "@bridge-ui/core";
import { computed, inject } from "vue";

// ** Local Imports
import type { BridgeDialogApi } from "@/Actions/Dialog/bridgeDialog.types";
import { BRIDGE_DIALOG_INJECTION_KEY } from "@/Actions/Dialog/bridgeDialogInjectionKey";

export class BridgeDialogHostMissingError extends Error {
  constructor() {
    super("useDialogAction() requires <BridgeDialogHost /> in the app tree.");

    this.name = "BridgeDialogHostMissingError";
  }
}

export function useDialogAction(): BridgeDialogApi {
  const api = inject(BRIDGE_DIALOG_INJECTION_KEY, null);

  if (!api) {
    throw new BridgeDialogHostMissingError();
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
