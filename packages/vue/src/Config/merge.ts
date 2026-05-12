// ** External Imports
import { reduce } from "es-toolkit/compat";
import { toMerged } from "es-toolkit/object";

// ** Local Imports
import type {
  BridgeUIComponentsConfig,
  BridgeUIGlobal,
  BridgeUIOptions,
} from "@/Config/types";
import { BRIDGE_UI_DEFAULT_GLOBAL } from "@/Config/types";

export function mergeBridgeUIGlobal(
  base: BridgeUIGlobal,
  ...partials: Array<Partial<BridgeUIGlobal> | undefined>
): BridgeUIGlobal {
  return reduce(
    partials,
    (acc: BridgeUIGlobal, partial) => {
      return partial ? toMerged(acc, partial) : acc;
    },
    { ...base },
  );
}

export function mergeBridgeUIComponents(
  base: BridgeUIComponentsConfig,
  ...partials: Array<BridgeUIComponentsConfig | undefined>
): BridgeUIComponentsConfig {
  return reduce(
    partials,
    (acc: BridgeUIComponentsConfig, partial) => {
      return partial ? toMerged(acc, partial) : acc;
    },
    toMerged({}, base),
  );
}

export function resolveBridgeUIOptions(options: BridgeUIOptions = {}): {
  global: BridgeUIGlobal;
  components: BridgeUIComponentsConfig;
} {
  return {
    components: mergeBridgeUIComponents({}, options.components),
    global: mergeBridgeUIGlobal(BRIDGE_UI_DEFAULT_GLOBAL, options.global),
  };
}
