// ** External Imports
import { toMerged } from "es-toolkit/object";
import type { ComputedRef } from "vue";
import { computed, unref } from "vue";

// ** Core Imports
import type { BridgeUIComponentsConfig } from "@core/Config/types";
import { mergePropsWithBridgeUIDefaults } from "@core/Utils";

// ** Local Imports
import { useBridgeUI } from "@/Provider/useBridgeUI";

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
export function mergeBridgeUIStringMap(
  lib: object,
  provider?: Partial<Record<string, string>>,
): Record<string, string> {
  return toMerged(
    { ...(lib as Record<string, string>) } as Record<PropertyKey, string>,
    (provider ?? {}) as Record<PropertyKey, string>,
  ) as Record<string, string>;
}

type RegistryEntryFor<K extends keyof BridgeUIComponentsConfig> = NonNullable<
  BridgeUIComponentsConfig[K]
>;

/**
 * Registry entry + props merged with Bridge defaults for a named component.
 */
export function useBridgeUIComponent<
  K extends keyof BridgeUIComponentsConfig,
  P extends object,
>(componentName: K, props: P, libDefaults?: Partial<P>) {
  const bridge = useBridgeUI();

  const components = computed(() => {
    return bridge ? unref(bridge.components) : null;
  });

  const entry = computed((): RegistryEntryFor<K> | undefined => {
    return components.value?.[componentName] as RegistryEntryFor<K> | undefined;
  });

  const merged = computed(() => {
    return mergePropsWithBridgeUIDefaults(
      componentName,
      props,
      components.value,
      libDefaults,
    );
  });

  return {
    bridge,
    components,
    entry,
    merged,
  };
}

/**
 * Merges `entry.classes` (Bridge provider) with `props.classes` (instance).
 */
export function useBridgeUIMergedRegistryClasses<C extends object>(
  entry: ComputedRef<{ classes?: object } | undefined>,
  props: { classes?: Partial<C> },
) {
  return computed(() =>
    mergeBridgeUILayeredClasses(
      entry.value?.classes as Partial<C> | undefined,
      props.classes,
    ),
  );
}

export { mergePropsWithBridgeUIDefaults } from "@core/Utils";
export type { MergeProps, Overwrite, UnionProps } from "@core/Utils/types";
