// ** External Imports
import { isNil } from "es-toolkit/compat";
import { useContext } from "react";

// ** Local Imports
import {
  BridgeUIContext,
  type BridgeUIContextValue,
} from "@/Provider/BridgeUIContext";

export function useBridgeUI(): BridgeUIContextValue {
  const context = useContext(BridgeUIContext);

  if (isNil(context)) {
    throw new Error("useBridgeUI must be used within BridgeUIProvider.");
  }

  return context;
}

export function useBridgeUIOptional(): BridgeUIContextValue | null {
  return useContext(BridgeUIContext);
}
