// ** Local Imports
import type {
  BridgeUIComponentsConfig,
  BridgeUIGlobal,
  BridgeUIOptions,
} from "@/Config/types";
import { BRIDGE_UI_DEFAULT_GLOBAL } from "@/Config/types";
import { mergeBridgeUILayeredClasses } from "@/Utils";

/**
 * Merges the base and partials into a single object.
 */
export function mergeBridgeUIGlobal({
  base,
  partials,
}: {
  base: BridgeUIGlobal;
  partials: Array<Partial<BridgeUIGlobal> | undefined>;
}): BridgeUIGlobal {
  return mergeBridgeUILayeredClasses(base, ...partials) as BridgeUIGlobal;
}

/**
 * Merges the base and partials into a single object.
 */
export function mergeBridgeUIComponents({
  base,
  partials,
}: {
  base: BridgeUIComponentsConfig;
  partials: Array<BridgeUIComponentsConfig | undefined>;
}): BridgeUIComponentsConfig {
  return mergeBridgeUILayeredClasses(
    base,
    ...partials,
  ) as BridgeUIComponentsConfig;
}

/**
 * Resolves the bridge UI options.
 */
export function resolveBridgeUIOptions(options: BridgeUIOptions = {}): {
  components: BridgeUIComponentsConfig;
  global: BridgeUIGlobal;
} {
  return {
    components: mergeBridgeUIComponents({
      base: {},
      partials: [options.components],
    }),
    global: mergeBridgeUIGlobal({
      partials: [options.global],
      base: BRIDGE_UI_DEFAULT_GLOBAL,
    }),
  };
}
