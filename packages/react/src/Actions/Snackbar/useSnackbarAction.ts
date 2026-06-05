// ** External Imports
import { getLayerCount } from "@bridge-ui/core";
import { useContext, useMemo, useRef } from "react";

// ** Local Imports
import type { BridgeSnackbarApi } from "@/Actions/Snackbar/bridgeSnackbar.types";
import { BridgeSnackbarContext } from "@/Actions/Snackbar/BridgeSnackbarContext";

export class BridgeSnackbarHostMissingError extends Error {
  constructor() {
    super(
      "useSnackbarAction() requires <BridgeSnackbarHost /> in the app tree.",
    );

    this.name = "BridgeSnackbarHostMissingError";
  }
}

export function useSnackbarAction(): BridgeSnackbarApi {
  const api = useContext(BridgeSnackbarContext);

  const apiRef = useRef(api);

  apiRef.current = api;

  if (!api) {
    throw new BridgeSnackbarHostMissingError();
  }

  return useMemo((): BridgeSnackbarApi => {
    return {
      close: (id) => apiRef.current!.close(id),
      closeTop: () => apiRef.current!.closeTop(),
      closeAll: () => apiRef.current!.closeAll(),
      open: (...args) => apiRef.current!.open(...args),
      isOpen: (id) => apiRef.current?.isOpen(id) ?? false,
      update: (id, options) => apiRef.current!.update(id, options),
      get stackSize() {
        return getLayerCount(apiRef.current?.entries ?? []);
      },
    };
  }, []);
}
