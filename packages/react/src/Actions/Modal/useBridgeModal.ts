// ** External Imports
import { useContext } from "react";

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

  if (!api) {
    throw new BridgeModalHostMissingError();
  }

  return {
    open: api.open,
    close: api.close,
    isOpen: api.isOpen,
    closeTop: api.closeTop,
    get stackSize() {
      return api.getStackSize();
    },
  };
}
