// ** External Imports
import type { ComputedRef } from "vue";
import { computed, unref } from "vue";

// ** Core Imports
import type { BridgeUIComponentsConfig } from "@bridge-ui/core/Config/types";
import {
  mergeBridgeUILayeredClasses,
  mergePropsWithBridgeUIDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useBridgeUI } from "@/Provider/useBridgeUI";

type RegistryEntryFor<K extends keyof BridgeUIComponentsConfig> = NonNullable<
  BridgeUIComponentsConfig[K]
>;

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
}) {
  const bridge = useBridgeUI();

  const components = computed(() => {
    return bridge ? unref(bridge.components) : null;
  });

  const entry = computed((): RegistryEntryFor<K> | undefined => {
    return components.value?.[componentName] as RegistryEntryFor<K> | undefined;
  });

  const merged = computed(() => {
    return mergePropsWithBridgeUIDefaults({
      props,
      libDefaults,
      componentName,
      components: components.value,
    });
  });

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
  entry: ComputedRef<{ classes?: object } | undefined>;
}) {
  return computed(() =>
    mergeBridgeUILayeredClasses(
      entry.value?.classes as Partial<C> | undefined,
      props.classes,
    ),
  );
}

// ** Exports
export {
  mergeBridgeUILayeredClasses,
  mergeBridgeUIStringMap,
  mergePropsWithBridgeUIDefaults,
} from "@bridge-ui/core/Utils";
export type {
  MergeProps,
  Overwrite,
  UnionProps,
} from "@bridge-ui/core/Utils/types";
