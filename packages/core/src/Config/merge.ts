// ** Local Imports
import type {
  BridgeUIComponentsConfig,
  BridgeUIGlobal,
  BridgeUIOptions,
} from "@core/Config/types";
import { BRIDGE_UI_DEFAULT_GLOBAL } from "@core/Config/types";
import { mergeBridgeUILayeredClasses } from "@core/Utils";

export function mergeBridgeUIGlobal({
  base,
  partials,
}: {
  base: BridgeUIGlobal;
  partials: Array<Partial<BridgeUIGlobal> | undefined>;
}): BridgeUIGlobal {
  return mergeBridgeUILayeredClasses(base, ...partials) as BridgeUIGlobal;
}

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

export function resolveBridgeUIOptions(options: BridgeUIOptions = {}): {
  global: BridgeUIGlobal;
  components: BridgeUIComponentsConfig;
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
