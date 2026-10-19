// ** Core Imports
import type { DateAdapter } from "@bridge-ui/core/Adapters";
import type {
  BridgeUIComponentsConfig,
  BridgeUIGlobal,
  Direction,
} from "@bridge-ui/core/Config";

/**
 * Reactive Bridge context. `global` and `components` are getters backed by
 * runes, so reading them inside `$derived` / `$effect` tracks changes.
 */
export interface BridgeUIContextApi {
  readonly components: BridgeUIComponentsConfig;
  readonly global: BridgeUIGlobal;
  nativeDates: DateAdapter;
  setComponents: (patch: BridgeUIComponentsConfig) => void;
  setDirection: (direction: Direction) => void;
  setGlobal: (patch: Partial<BridgeUIGlobal>) => void;
  setLocale: (locale: string) => void;
  setTheme: (theme: string) => void;
  setTimeZone: (timeZone: string) => void;
}

/**
 * Options read by {@link BridgeUIContextApi} on every change.
 */
export type BridgeUIOptionsGetter = () => {
  components: BridgeUIComponentsConfig;
  global: Partial<BridgeUIGlobal>;
};
