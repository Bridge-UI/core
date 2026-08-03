// ** External Imports
import { createContext, type ReactNode } from "react";

// ** Core Imports
import type {
  BridgeUIComponentsConfig,
  BridgeUIGlobal,
  Direction,
} from "@bridge-ui/core";

export interface BridgeUIContextValue {
  components: BridgeUIComponentsConfig;
  global: BridgeUIGlobal;
  setComponents: (patch: BridgeUIComponentsConfig) => void;
  setDirection: (direction: Direction) => void;
  setGlobal: (patch: Partial<BridgeUIGlobal>) => void;
  setLocale: (locale: string) => void;
  setTheme: (theme: string) => void;
}

export const BridgeUIContext = createContext<null | BridgeUIContextValue>(null);

export interface BridgeUIProviderProps {
  children: ReactNode;
  components?: BridgeUIComponentsConfig;
  global?: Partial<BridgeUIGlobal>;
}
