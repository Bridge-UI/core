// ** External Imports
import { getLayerCount } from "@bridge-ui/core";
import { useContext, useMemo, useRef } from "react";

// ** Local Imports
import type { BridgeDrawerApi } from "@/Actions/Drawer/bridgeDrawer.types";
import { BridgeDrawerContext } from "@/Actions/Drawer/BridgeDrawerContext";

export class BridgeDrawerHostMissingError extends Error {
  constructor() {
    super("useDrawerAction() requires <BridgeDrawerHost /> in the app tree.");

    this.name = "BridgeDrawerHostMissingError";
  }
}

export function useDrawerAction(): BridgeDrawerApi {
  const api = useContext(BridgeDrawerContext);

  const apiRef = useRef(api);

  apiRef.current = api;

  if (!api) {
    throw new BridgeDrawerHostMissingError();
  }

  return useMemo((): BridgeDrawerApi => {
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
