// ** External Imports
import { omit, pick } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core";
import type { BridgeUIComponentsConfig } from "@bridge-ui/core/Config";
import {
  mergeBridgeUILayeredClasses,
  mergePropsWithBridgeUIDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useBridgeUI } from "@/Provider/useBridgeUI";

type RegistryEntryFor<K extends keyof BridgeUIComponentsConfig> = NonNullable<
  BridgeUIComponentsConfig[K]
>;

export type UseBridgeUIComponentReturn<
  K extends keyof BridgeUIComponentsConfig,
  P extends object,
> = {
  merged: P;
  bridge: ReturnType<typeof useBridgeUI>;
  entry: RegistryEntryFor<K> | undefined;
  components: BridgeUIComponentsConfig | null;
};

/**
 * A computed value that re-runs when the parent re-renders.
 */
export function derived<T>(getter: () => T): T {
  return getter();
}

/**
 * Merges a part's `className` with a computed class string (registry + `classes.*`).
 */
export function mergePartBind<T extends { className?: string } | undefined>(
  part: T,
  classValue: string,
): Omit<NonNullable<T>, "className"> & { className: string } {
  return {
    ...(part ?? {}),
    className: cn(classValue, part?.className),
  } as Omit<NonNullable<T>, "className"> & { className: string };
}

/**
 * Splits merged component props into Bridge registry props, peeled own props,
 * and native HTML attributes for the root element.
 */
export function splitComponentProps<
  P extends object,
  const PeelKeys extends ReadonlyArray<keyof P>,
  const BridgeKeys extends ReadonlyArray<keyof P>,
>(
  props: P,
  {
    peel,
    bridgeKeys,
  }: {
    peel: PeelKeys;
    bridgeKeys: BridgeKeys;
  },
): Pick<P, PeelKeys[number]> & {
  propsForMerge: Pick<P, BridgeKeys[number]>;
  rootHtmlProps: Omit<P, BridgeKeys[number] | PeelKeys[number]>;
} {
  const peelKeyList = [...peel] as (keyof P)[];

  const bridgeKeyList = [...bridgeKeys] as (keyof P)[];

  const peeled = pick(props, peelKeyList) as Pick<P, PeelKeys[number]>;

  const propsForMerge = pick(props, bridgeKeyList) as Pick<
    P,
    BridgeKeys[number]
  >;

  const rootHtmlProps = omit(props, [...bridgeKeyList, ...peelKeyList]) as Omit<
    P,
    BridgeKeys[number] | PeelKeys[number]
  >;

  return { ...peeled, propsForMerge, rootHtmlProps };
}

/**
 * Registry entry + props merged with Bridge defaults for a named component.
 */
export function useBridgeUIComponent<
  K extends keyof BridgeUIComponentsConfig,
  P extends object,
>({
  props,
  libDefaults,
  componentName,
}: {
  props: P;
  componentName: K;
  libDefaults?: Partial<P>;
}): UseBridgeUIComponentReturn<K, P> {
  const bridge = useBridgeUI();

  const components = bridge?.components ?? null;

  const entry = components?.[componentName] as RegistryEntryFor<K> | undefined;

  const merged = useMemo(() => {
    return mergePropsWithBridgeUIDefaults({
      props,
      components,
      libDefaults,
      componentName,
    }) as P;
  }, [props, components, libDefaults, componentName]);

  return {
    entry,
    bridge,
    merged,
    components,
  };
}

/**
 * Merges `entry.classes` (Bridge provider) with `props.classes` (instance).
 */
export function useBridgeUIMergedRegistryClasses<C extends object>({
  entry,
  props,
}: {
  props: { classes?: Partial<C> };
  entry?: { classes?: object };
}) {
  return useMemo(() => {
    return mergeBridgeUILayeredClasses(
      entry?.classes as Partial<C> | undefined,
      props.classes,
    );
  }, [entry?.classes, props.classes]);
}

// ** Exports
export {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  resolveSlotOrProp,
} from "@/Utils/slotOrProp";
export type { SlotMap } from "@/Utils/slotOrProp";
export {
  mergeBridgeUILayeredClasses,
  mergeBridgeUIStringMap,
  mergePropsWithBridgeUIDefaults,
} from "@bridge-ui/core/Utils";
export type {
  MergeHtmlProps,
  MergeProps,
  Overwrite,
  UnionProps,
} from "@bridge-ui/core/Utils";
