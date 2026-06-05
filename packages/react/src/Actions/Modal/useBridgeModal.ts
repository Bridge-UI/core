// ** External Imports
import { useContext, useMemo, useRef } from "react";

// ** Local Imports
import type { BridgeModalApi } from "@/Actions/Modal/bridgeModal.types";
import { BridgeModalContext } from "@/Actions/Modal/BridgeModalContext";

export class BridgeModalHostMissingError extends Error {
  constructor() {
    super(
      "useBridgeModal() requires <BridgeUIProvider /> (or <BridgeModalHost />) in the app tree.",
    );
    this.name = "BridgeModalHostMissingError";
  }
}

export function useBridgeModal(): BridgeModalApi {
  const api = useContext(BridgeModalContext);

  const apiRef = useRef(api);

  apiRef.current = api;

  if (!api) {
    throw new BridgeModalHostMissingError();
  }

  return useMemo((): BridgeModalApi => {
    return {
      close: (id) => apiRef.current!.close(id),
      closeTop: () => apiRef.current!.closeTop(),
      open: (...args) => apiRef.current!.open(...args),
      isOpen: (id) => apiRef.current?.isOpen(id) ?? false,
      update: (id, options) => apiRef.current!.update(id, options),
      get stackSize() {
        return apiRef.current?.entries.length ?? 0;
      },
    };
  }, []);
}
