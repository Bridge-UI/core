// ** External Imports
import {
  compact,
  findLast,
  flatMap,
  isArray,
  isFunction,
  isObject,
  isPlainObject,
  isUndefined,
  keys,
  map,
  omit,
  some,
  uniq,
  values,
} from "es-toolkit/compat";

// ** Local Imports
import type {
  BridgeUIComponentsConfig,
  BridgeUIGlobal,
  BridgeUIOptions,
} from "@/Config/types";
import { BRIDGE_UI_DEFAULT_GLOBAL } from "@/Config/types";
import { mergeBridgeUILayeredClasses } from "@/Utils";

/**
 * True for values that must replace-on-write instead of deep-merging:
 * functions, non-plain objects (class instances), and plain objects with a
 * function member (adapters such as `dates`, `icons`, `i18n`, `richText`).
 */
function isReplaceOnWriteValue(value: unknown): boolean {
  if (isFunction(value)) {
    return true;
  }

  if (!isObject(value) || isArray(value)) {
    return false;
  }

  if (!isPlainObject(value)) {
    return true;
  }

  return some(values(value), isFunction);
}

/**
 * Merges the base and partials into a single object.
 * Plain data (`breakpoints`, `formDefaults`, …) is deep-merged. Adapters and
 * other values with behavior are replace-on-write (last defined value wins),
 * including keys added by packages via `BridgeUIGlobal` augmentation.
 */
export function mergeBridgeUIGlobal({
  base,
  partials,
}: {
  base: BridgeUIGlobal;
  partials: Array<undefined | Partial<BridgeUIGlobal>>;
}): BridgeUIGlobal {
  const layers = compact<Partial<BridgeUIGlobal>>([base, ...partials]);

  const replaceKeys = uniq(
    flatMap(layers, (layer) => {
      return keys(layer).filter((key) => {
        return isReplaceOnWriteValue(layer[key as keyof BridgeUIGlobal]);
      });
    }),
  );

  const merged = mergeBridgeUILayeredClasses(
    ...map(layers, (layer) => omit(layer, replaceKeys)),
  ) as Record<string, unknown>;

  for (const key of replaceKeys) {
    const value = findLast(
      map(layers, (layer) => layer[key as keyof BridgeUIGlobal]),
      (entry) => !isUndefined(entry),
    );

    if (!isUndefined(value)) {
      merged[key] = value;
    }
  }

  return merged as unknown as BridgeUIGlobal;
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
