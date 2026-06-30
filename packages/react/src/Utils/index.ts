// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import { useMemo } from "react";

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
  components: null | BridgeUIComponentsConfig;
  entry: undefined | RegistryEntryFor<K>;
  merged: P;
};

/**
 * A computed value that re-runs when the parent re-renders.
 */
export function derived<T>(getter: () => T): T {
  return getter();
}

/**
 * Merges React-specific classes into the `className` attribute.
 */
export const mergePartBind = createMergePartBind("className");

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
  props: Partial<P>;
}): UseBridgeUIComponentReturn<P, K> {
  const bridge = useBridgeUI();

  const components = isNil(bridge) ? null : (bridge.components ?? null);

  const entry = get(components, componentName) as
    | undefined
    | RegistryEntryFor<K>;

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
  entry?: { classes?: object };
  props: { classes?: Partial<C> };
}) {
  return useMemo(() => {
    return mergeBridgeUILayeredClasses(
      get(entry, "classes") as undefined | Partial<C>,
      props.classes,
    );
  }, [entry, props.classes]);
}

export function resolveFieldAdornmentIconSize(
  fieldSize?: keyof FormFieldSize,
): keyof IconSize {
  return get(
    {
      xs: "xs",
      sm: "sm",
      md: "md",
      lg: "md",
      xl: "lg",
      "2xs": "xs",
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
  resolveSlotOrProp,
} from "@/Utils/slotOrProp";
export type { SlotMap } from "@/Utils/slotOrProp";
export { useHoldRepeat } from "@/Utils/useHoldRepeat";
export type {
  HoldRepeatAction,
  UseHoldRepeatOptions,
} from "@/Utils/useHoldRepeat";
