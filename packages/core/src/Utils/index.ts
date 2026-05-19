// ** External Imports
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { get } from "es-toolkit/compat";
import { toMerged } from "es-toolkit/object";
import { twMerge } from "tailwind-merge";

// ** Local Imports
import type { BridgeUIComponentsConfig } from "@core/Config/types";

/**
 * Merges class values into a single string of class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Merges class maps from the Bridge registry and the instance (later layers
 * override earlier ones). Typical use: `registry.classes` then `props.classes`.
 */
export function mergeBridgeUILayeredClasses<C extends object>(
  ...layers: Array<Partial<C> | undefined>
): Partial<C> {
  return layers.reduce(
    (acc, layer) => {
      if (layer == null) {
        return acc;
      }

      return toMerged(
        acc as Record<PropertyKey, unknown>,
        layer as Record<PropertyKey, unknown>,
      ) as Record<PropertyKey, unknown>;
    },
    {} as Record<PropertyKey, unknown>,
  ) as Partial<C>;
}

/**
 * Merges a string-keyed class map (e.g. shadow sizes) with provider overrides.
 */
export function mergeBridgeUIStringMap({
  lib,
  provider,
}: {
  lib: object;
  provider?: Partial<Record<string, string>>;
}): Record<string, string> {
  return toMerged(
    lib as Record<PropertyKey, string>,
    (provider ?? {}) as Record<PropertyKey, string>,
  ) as Record<string, string>;
}

/**
 * Merges props with Bridge UI defaults and registry defaults.
 */
export function mergePropsWithBridgeUIDefaults<
  K extends keyof BridgeUIComponentsConfig,
  P extends object,
>({
  props,
  components,
  libDefaults,
  componentName,
}: {
  props: P;
  componentName: K;
  libDefaults?: Partial<P>;
  components: BridgeUIComponentsConfig | null | undefined;
}): P {
  const fromRegistry = get(components, [componentName, "defaultProps"]) as
    | Partial<P>
    | undefined;

  return mergeBridgeUILayeredClasses<P>(libDefaults, fromRegistry, props) as P;
}

export type {
  MergeHtmlProps,
  MergeProps,
  Overwrite,
  UnionProps,
} from "@core/Utils/types";
