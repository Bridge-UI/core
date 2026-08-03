// ** External Imports
import type { ComputedRef } from "vue";

// ** Core Imports
import type {
  BridgeUIComponentsConfig,
  BridgeUIGlobal,
  Direction,
} from "@bridge-ui/core";

export interface BridgeUIContextApi {
  components: ComputedRef<BridgeUIComponentsConfig>;
  global: ComputedRef<BridgeUIGlobal>;
  setComponents: (patch: BridgeUIComponentsConfig) => void;
  setDirection: (direction: Direction) => void;
  setGlobal: (patch: Partial<BridgeUIGlobal>) => void;
  setLocale: (locale: string) => void;
  setTheme: (theme: string) => void;
}
