// ** External Imports
import { findLast, isNil, isUndefined, omit } from "es-toolkit/compat";

// ** Local Imports
import type { I18nAdapter } from "@/Adapters/i18n";
import type { IconAdapter } from "@/Adapters/icon";
import type {
  BridgeUIComponentsConfig,
  BridgeUIGlobal,
  BridgeUIOptions,
} from "@/Config/types";
import { BRIDGE_UI_DEFAULT_GLOBAL } from "@/Config/types";
import { mergeBridgeUILayeredClasses } from "@/Utils";

/** Adapter keys that must replace-on-write instead of deep-merging. */
const GLOBAL_ADAPTER_KEYS = ["i18n", "icons"] as const;

/**
 * Drops adapter fields so deep-merge does not combine adapter objects.
 */
function omitGlobalAdapters(
  value: undefined | Partial<BridgeUIGlobal>,
): undefined | Omit<Partial<BridgeUIGlobal>, "i18n" | "icons"> {
  if (isNil(value)) {
    return value;
  }

  return omit(value, GLOBAL_ADAPTER_KEYS);
}

/**
 * Merges the base and partials into a single object.
 * `icons` and `i18n` are replace-on-write (last defined adapter wins).
 */
export function mergeBridgeUIGlobal({
  base,
  partials,
}: {
  base: BridgeUIGlobal;
  partials: Array<undefined | Partial<BridgeUIGlobal>>;
}): BridgeUIGlobal {
  const layers = [base, ...partials];

  const icons = findLast(
    layers,
    (layer): layer is Partial<BridgeUIGlobal> & { icons: IconAdapter } => {
      return !isNil(layer) && !isUndefined(layer.icons);
    },
  )?.icons;

  const i18n = findLast(
    layers,
    (layer): layer is Partial<BridgeUIGlobal> & { i18n: I18nAdapter } => {
      return !isNil(layer) && !isUndefined(layer.i18n);
    },
  )?.i18n;

  const merged = mergeBridgeUILayeredClasses(
    omitGlobalAdapters(base) as BridgeUIGlobal,
    ...partials.map(omitGlobalAdapters),
  ) as BridgeUIGlobal;

  if (isUndefined(icons)) {
    delete merged.icons;
  } else {
    merged.icons = icons;
  }

  if (isUndefined(i18n)) {
    delete merged.i18n;
  } else {
    merged.i18n = i18n;
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
