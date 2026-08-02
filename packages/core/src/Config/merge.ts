// ** Local Imports
import type { IconAdapter } from "@/Adapters/icon";
import type {
  BridgeUIComponentsConfig,
  BridgeUIGlobal,
  BridgeUIOptions,
} from "@/Config/types";
import { BRIDGE_UI_DEFAULT_GLOBAL } from "@/Config/types";
import { mergeBridgeUILayeredClasses } from "@/Utils";

/**
 * Drops `icons` so deep-merge does not combine adapter objects.
 */
function omitGlobalIcons(
  value: undefined | Partial<BridgeUIGlobal>,
): undefined | Omit<Partial<BridgeUIGlobal>, "icons"> {
  if (value == null) {
    return value;
  }

  const { icons: _icons, ...rest } = value;

  return rest;
}

/**
 * Merges the base and partials into a single object.
 * `icons` is replace-on-write (last defined adapter wins).
 */
export function mergeBridgeUIGlobal({
  base,
  partials,
}: {
  base: BridgeUIGlobal;
  partials: Array<undefined | Partial<BridgeUIGlobal>>;
}): BridgeUIGlobal {
  let icons: undefined | IconAdapter = base.icons;

  for (const partial of partials) {
    if (partial?.icons !== undefined) {
      icons = partial.icons;
    }
  }

  const merged = mergeBridgeUILayeredClasses(
    omitGlobalIcons(base) as BridgeUIGlobal,
    ...partials.map(omitGlobalIcons),
  ) as BridgeUIGlobal;

  if (icons !== undefined) {
    merged.icons = icons;
  } else {
    delete merged.icons;
  }

  return merged;
}

/**
 * Merges the base and partials into a single object.
 */
export function mergeBridgeUIComponents({
  base,
  partials,
}: {
  base: BridgeUIComponentsConfig;
  partials: Array<undefined | BridgeUIComponentsConfig>;
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
