// ** External Imports
import type { ComputedRef } from "vue";

// ** Core Imports
import type { DateAdapter } from "@bridge-ui/core/Adapters";
import type {
  BridgeUIComponentsConfig,
  BridgeUIGlobal,
  Direction,
} from "@bridge-ui/core/Config";

export interface BridgeUIContextApi {
  components: ComputedRef<BridgeUIComponentsConfig>;
  global: ComputedRef<BridgeUIGlobal>;
  nativeDates: DateAdapter;
  setComponents: (patch: BridgeUIComponentsConfig) => void;
  setDirection: (direction: Direction) => void;
  setGlobal: (patch: Partial<BridgeUIGlobal>) => void;
  setLocale: (locale: string) => void;
  setTheme: (theme: string) => void;
  setTimeZone: (timeZone: string) => void;
}
