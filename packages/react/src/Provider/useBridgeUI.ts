// ** External Imports
import { useContext } from "react";

// ** Local Imports
import {
  BridgeUIContext,
  type BridgeUIContextValue,
} from "@/Provider/BridgeUIContext";

export function useBridgeUI(): null | BridgeUIContextValue {
  return useContext(BridgeUIContext);
}
