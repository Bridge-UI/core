// ** External Imports
import type { ComputedRef } from "vue";

// ** Local Imports
import type { BridgeUIComponentsConfig, BridgeUIGlobal } from "@/Config";

export interface BridgeUIContextApi {
  global: ComputedRef<BridgeUIGlobal>;
  components: ComputedRef<BridgeUIComponentsConfig>;
  setGlobal: (patch: Partial<BridgeUIGlobal>) => void;
  setComponents: (patch: BridgeUIComponentsConfig) => void;
}
