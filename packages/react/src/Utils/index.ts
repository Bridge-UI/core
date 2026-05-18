// ** External Imports
import { useMemo } from "react";

// ** Core Imports
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
  mergeBridgeUILayeredClasses,
  mergeBridgeUIStringMap,
  mergePropsWithBridgeUIDefaults,
} from "@bridge-ui/core/Utils";
export type { MergeProps, Overwrite, UnionProps } from "@bridge-ui/core/Utils";
