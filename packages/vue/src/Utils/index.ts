// ** External Imports
import { pick, pickBy } from "es-toolkit/compat";
import type { ComputedRef } from "vue";
import { computed, unref } from "vue";

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
  merged: ComputedRef<P>;
  bridge: ReturnType<typeof useBridgeUI>;
  entry: ComputedRef<RegistryEntryFor<K> | undefined>;
  components: ComputedRef<BridgeUIComponentsConfig | null>;
};

/**
 * Merges non–own-props from `props` with fallthrough `attrs` for the root element.
 * Own prop keys are omitted so they are not duplicated on the DOM node.
 */
function buildRootBind<P extends object>(
  props: P,
  attrs: Record<string, unknown>,
  omitKeys: readonly (keyof P)[],
): ComputedRef<Record<string, unknown>> {
  return computed(() => {
    const rootHtmlPropsFromProps = { ...props } as Record<string, unknown>;

    for (const key of omitKeys) {
      delete rootHtmlPropsFromProps[key as string];
    }

    return { ...rootHtmlPropsFromProps, ...attrs };
  });
}

/**
 * Merges a part's `class` with a computed class string (registry + `classes.*`).
 */
export function mergePartBind<T extends object | undefined>(
  part: T,
  classValue: string,
): Omit<NonNullable<T>, "class"> & { class: string } {
  const partClass =
    part && "class" in part ? (part as { class?: unknown }).class : undefined;

  return {
    ...(part ?? {}),
    class: cn(
      classValue,
      typeof partClass === "string" ? partClass : undefined,
    ),
  } as Omit<NonNullable<T>, "class"> & { class: string };
}

/**
 * Splits merged component props into Bridge registry props, user root class,
 * and a computed `rootBind` for the root element (`props` HTML + fallthrough attrs).
 */
export function splitComponentProps<
  P extends object,
  const BridgeKeys extends ReadonlyArray<keyof P>,
>(
  props: P,
  attrs: Record<string, unknown>,
  {
    bridgeKeys,
    classKey = "class" as keyof P,
  }: {
    classKey?: keyof P;
    bridgeKeys: BridgeKeys;
  },
): {
  userClass: string | undefined;
  rootBind: ComputedRef<Record<string, unknown>>;
  propsForMerge: Pick<P, BridgeKeys[number]>;
} {
  const bridgeKeyList = [...bridgeKeys] as (keyof P)[];

  const userClass = props[classKey] as string | undefined;

  const rootBind = buildRootBind(props, attrs, [...bridgeKeyList, classKey]);

  const propsForMerge = pickBy(
    pick(props, bridgeKeyList),
    (value) => value !== undefined,
  ) as Pick<P, BridgeKeys[number]>;

  return { propsForMerge, userClass, rootBind };
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
