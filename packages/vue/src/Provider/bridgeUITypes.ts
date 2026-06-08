// ** External Imports
import type { ComputedRef } from "vue";

// ** Core Imports
import type { BridgeUIComponentsConfig, BridgeUIGlobal } from "@bridge-ui/core";

export interface BridgeUIContextApi {
  components: ComputedRef<BridgeUIComponentsConfig>;
  global: ComputedRef<BridgeUIGlobal>;
  setComponents: (patch: BridgeUIComponentsConfig) => void;
  setGlobal: (patch: Partial<BridgeUIGlobal>) => void;
}
