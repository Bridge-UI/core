// ** External Imports
import type { ComputedRef } from "vue";

// ** Core Imports
import type { BridgeUIComponentsConfig, BridgeUIGlobal } from "@bridge-ui/core";

export interface BridgeUIContextApi {
  global: ComputedRef<BridgeUIGlobal>;
  components: ComputedRef<BridgeUIComponentsConfig>;
  setGlobal: (patch: Partial<BridgeUIGlobal>) => void;
  setComponents: (patch: BridgeUIComponentsConfig) => void;
}
