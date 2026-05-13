// ** External Imports
import { createContext, type ReactNode } from "react";

// ** Core Imports
import type { BridgeUIComponentsConfig, BridgeUIGlobal } from "@bridge-ui/core";

export interface BridgeUIContextValue {
  global: BridgeUIGlobal;
  components: BridgeUIComponentsConfig;
  setGlobal: (patch: Partial<BridgeUIGlobal>) => void;
  setComponents: (patch: BridgeUIComponentsConfig) => void;
}

export const BridgeUIContext = createContext<BridgeUIContextValue | null>(null);

export interface BridgeUIProviderProps {
  children: ReactNode;
  global?: Partial<BridgeUIGlobal>;
  components?: BridgeUIComponentsConfig;
}
