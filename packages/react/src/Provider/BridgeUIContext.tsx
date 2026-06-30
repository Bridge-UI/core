// ** External Imports
import { createContext, type ReactNode } from "react";

// ** Core Imports
import type { BridgeUIComponentsConfig, BridgeUIGlobal } from "@bridge-ui/core";

export interface BridgeUIContextValue {
  components: BridgeUIComponentsConfig;
  global: BridgeUIGlobal;
  setComponents: (patch: BridgeUIComponentsConfig) => void;
  setGlobal: (patch: Partial<BridgeUIGlobal>) => void;
}

export const BridgeUIContext = createContext<null | BridgeUIContextValue>(null);

export interface BridgeUIProviderProps {
  children: ReactNode;
  components?: BridgeUIComponentsConfig;
  global?: Partial<BridgeUIGlobal>;
}
