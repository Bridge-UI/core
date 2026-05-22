// ** External Imports
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { compact, get, isNil, omit, pick, reduce } from "es-toolkit/compat";
import { toMerged } from "es-toolkit/object";
import { twMerge } from "tailwind-merge";

// ** Local Imports
import type { BridgeUIComponentsConfig } from "@core/Config/types";
import type { ClassPropKey, MergePartBind } from "@core/Utils/types";

/**
 * Merges class values into a single string of class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Merges `bridgeProps` (package) with `partProps` (consumer).
 * `partProps` override other keys; the class prop is merged via `cn`.
 */
export function createMergePartBind<const K extends ClassPropKey>(classKey: K) {
  return function mergePartBind<
    Bridge extends object,
    Part extends object | undefined = undefined,
  >(partProps: Part, bridgeProps: Bridge): MergePartBind<Bridge, K, Part> {
    const partClass = get(partProps, classKey) as string | undefined;

    const bridgeClass = get(bridgeProps, classKey) as string | undefined;

    return {
      ...(bridgeProps ?? {}),
      ...(partProps ?? {}),
      [classKey]: cn(bridgeClass, partClass),
    } as MergePartBind<Bridge, K, Part>;
  };
}

/**
 * Merges class maps from the Bridge registry and the instance (later layers
 * override earlier ones). Typical use: `registry.classes` then `props.classes`.
 */
export function mergeBridgeUILayeredClasses<C extends object>(
  ...layers: Array<Partial<C> | undefined>
): Partial<C> {
  return reduce(
    layers,
    (acc, layer) => {
      if (isNil(layer)) {
        return acc;
      }

      return toMerged(acc, layer);
    },
    {} as Partial<C>,
  );
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
  P extends Record<string, unknown>,
  K extends keyof BridgeUIComponentsConfig,
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

/**
 * Splits merged component props into Bridge registry props, peeled own props,
 */
export function splitComponentProps<
  P extends Record<string, unknown>,
  const BridgeKeys extends ReadonlyArray<keyof P>,
>({
  props,
  bridgeKeys,
}: {
  props: P;
  bridgeKeys: BridgeKeys;
}): {
  customProps: Pick<P, BridgeKeys[number]>;
  inheritedAttrs: Omit<P, BridgeKeys[number]>;
} {
  const list = compact(bridgeKeys);

  return {
    customProps: pick(props, list),
    inheritedAttrs: omit(props, list),
  };
}

export type {
  ClassPropKey,
  MergeHtmlProps,
  MergePartBind,
  MergeProps,
  Overwrite,
  UnionProps,
} from "@core/Utils/types";
