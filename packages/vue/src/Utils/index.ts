// ** External Imports
import type { ComputedRef } from "vue";
import { computed, unref } from "vue";

// ** Core Imports
import { createMergePartBind } from "@bridge-ui/core";
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
  P extends object,
  K extends keyof BridgeUIComponentsConfig,
> = {
  merged: ComputedRef<P>;
  bridge: ReturnType<typeof useBridgeUI>;
  entry: ComputedRef<RegistryEntryFor<K> | undefined>;
  components: ComputedRef<BridgeUIComponentsConfig | null>;
};

export const mergePartBind = createMergePartBind("class");

/**
 * Registry entry + props merged with Bridge defaults for a named component.
 */
export function useBridgeUIComponent<
  P extends object,
  K extends keyof BridgeUIComponentsConfig,
>({
  props,
  libDefaults,
  componentName,
}: {
  props: Partial<P>;
  componentName: K;
  libDefaults?: Partial<P>;
}): UseBridgeUIComponentReturn<P, K> {
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
    }) as P;
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
  return computed(() => {
    return mergeBridgeUILayeredClasses(
      entry.value?.classes as Partial<C> | undefined,
      props.classes,
    );
  });
}

// ** Exports
export {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  resolveSlotOrProp,
} from "@/Utils/slotOrProp";
export {
  createMergePartBind,
  mergeBridgeUILayeredClasses,
  mergePropsWithBridgeUIDefaults,
} from "@bridge-ui/core/Utils";
export type {
  LibDefaultsShape,
  MergeHtmlProps,
  MergeLibDefaults,
  MergeProps,
  Overwrite,
  UnionProps,
} from "@bridge-ui/core/Utils";
