// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import { useMemo } from "react";

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
  props: Partial<P>;
  libDefaults?: Partial<P>;
}): UseBridgeUIComponentReturn<P, K> {
  const bridge = useBridgeUI();

  const components = isNil(bridge) ? null : (bridge.components ?? null);

  const entry = get(components, componentName) as
    | RegistryEntryFor<K>
    | undefined;

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
      get(entry, "classes") as Partial<C> | undefined,
      props.classes,
    );
  }, [entry, props.classes]);
}

// ** Exports
export {
  resolveEndAdornmentButtonClasses,
  resolveEndAdornmentClasses,
  resolveEndAdornmentShellClasses,
} from "@/Utils/resolveEndAdornmentClasses";
export type { ResolveEndAdornmentClassesOptions } from "@/Utils/resolveEndAdornmentClasses";
export {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  resolveSlotOrProp,
} from "@/Utils/slotOrProp";
export type { SlotMap } from "@/Utils/slotOrProp";
export { useTextFieldEndAdornment } from "@/Utils/useTextFieldEndAdornment";
