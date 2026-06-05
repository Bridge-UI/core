// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  toValue,
  unref,
} from "vue";

// ** Core Imports
import { createMergePartBind } from "@bridge-ui/core";
import type { FormFieldSize } from "@bridge-ui/core/Components/FormField";
import type { IconSize } from "@bridge-ui/core/Components/Icon";
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
  bridge: ReturnType<typeof useBridgeUI>;
  components: ComputedRef<BridgeUIComponentsConfig | null>;
  entry: ComputedRef<RegistryEntryFor<K> | undefined>;
  merged: ComputedRef<P>;
};

/**
 * Merges Vue-specific classes into the `class` attribute.
 */
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
  componentName: K;
  libDefaults?: Partial<P>;
  props: MaybeRefOrGetter<Partial<P>>;
}): UseBridgeUIComponentReturn<P, K> {
  const bridge = useBridgeUI();

  const components = computed(() => {
    return isNil(bridge) ? null : unref(bridge.components);
  });

  const entry = computed((): RegistryEntryFor<K> | undefined => {
    return get(components.value, componentName) as
      | RegistryEntryFor<K>
      | undefined;
  });

  const merged = computed(() => {
    return mergePropsWithBridgeUIDefaults({
      libDefaults,
      componentName,
      props: toValue(props) as P,
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
  entry: ComputedRef<{ classes?: object } | undefined>;
  props: MaybeRefOrGetter<{ classes?: Partial<C> }>;
}) {
  return computed(() => {
    return mergeBridgeUILayeredClasses(
      get(entry.value, "classes") as Partial<C> | undefined,
      toValue(props).classes,
    );
  });
}

export function resolveFieldAdornmentIconSize(
  fieldSize?: keyof FormFieldSize,
): keyof IconSize {
  return get(
    {
      "2xs": "xs",
      xs: "xs",
      sm: "sm",
      md: "md",
      lg: "md",
      xl: "lg",
      "2xl": "lg",
    },
    fieldSize ?? "md",
  ) as keyof IconSize;
}

// ** Exports
export {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  resolveNamedSlot,
  resolveSlotOrProp,
} from "@/Utils/slotOrProp";
export { useHoldRepeat } from "@/Utils/useHoldRepeat";
export type {
  HoldRepeatAction,
  UseHoldRepeatOptions,
} from "@/Utils/useHoldRepeat";
