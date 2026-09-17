// ** External Imports
import { useContext, useMemo, useRef } from "react";

// ** Core Imports
import { getLayerCount } from "@bridge-ui/core/Layer";

// ** Local Imports
import { dialogActionHosts } from "@/Actions/actionHostRegistry";
import type { BridgeDialogApi } from "@/Actions/Dialog/bridgeDialog.types";
import { BridgeDialogContext } from "@/Actions/Dialog/BridgeDialogContext";

export class BridgeDialogHostMissingError extends Error {
  constructor() {
    super("useDialogAction() requires <BridgeDialogHost /> in the app tree.");

    this.name = "BridgeDialogHostMissingError";
  }
}

export function useDialogAction(): BridgeDialogApi {
  const api = dialogActionHosts.resolve(useContext(BridgeDialogContext));

  const apiRef = useRef(api);

  apiRef.current = api;

  if (!api) {
    throw new BridgeDialogHostMissingError();
  }

  return useMemo((): BridgeDialogApi => {
    return {
      close: (id) => apiRef.current!.close(id),
      closeTop: () => apiRef.current!.closeTop(),
      open: (...args) => apiRef.current!.open(...args),
      isOpen: (id) => apiRef.current?.isOpen(id) ?? false,
      update: (id, options) => apiRef.current!.update(id, options),
      get stackSize() {
        return getLayerCount(apiRef.current?.entries ?? []);
      },
    };
  }, []);
}
