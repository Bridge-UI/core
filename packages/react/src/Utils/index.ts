// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  createMergeNestedComponentProps,
  createMergePartBind,
} from "@bridge-ui/core";
import type { BridgeUIComponentsConfig } from "@bridge-ui/core/Config";
import type { FormFieldSize } from "@bridge-ui/core/Tokens/FormField";
import type { IconSize } from "@bridge-ui/core/Tokens/Icon";
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
  K extends keyof BridgeUIComponentsConfig = keyof BridgeUIComponentsConfig,
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
 * Merges consumer nested-component props with package defaults (consumer wins).
 */
export const mergeNestedComponentProps =
  createMergeNestedComponentProps(mergePartBind);

/**
 * Registry entry + props merged with Bridge defaults for a named component.
 */
export function useBridgeUIComponent<
  P extends object,
  K extends keyof BridgeUIComponentsConfig = keyof BridgeUIComponentsConfig,
>({
  props,
  libDefaults,
  componentName,
}: {
  componentName?: K;
  libDefaults?: Partial<P>;
  props: Partial<P>;
}): UseBridgeUIComponentReturn<P, K> {
  const bridge = useBridgeUI();

  const components = isNil(bridge) ? null : (bridge.components ?? null);

  const entry = componentName
    ? (get(components, componentName) as undefined | RegistryEntryFor<K>)
    : undefined;

  const merged = useMemo(() => {
    return mergePropsWithBridgeUIDefaults({
      props,
      components,
      libDefaults,
      componentName,
      formDefaults: bridge?.global.formDefaults,
    }) as P;
  }, [
    props,
    components,
    libDefaults,
    componentName,
    bridge?.global.formDefaults,
  ]);

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
export { hasNamedSlot, hasSlotOrProp, isPropPresent } from "@/Utils/slotOrProp";
export type { SlotMap } from "@/Utils/slotOrProp";
export { useBreakpoint } from "@/Utils/useBreakpoint";
export type { UseBreakpointOptions } from "@/Utils/useBreakpoint";
export { useHoldRepeat } from "@/Utils/useHoldRepeat";
export type {
  HoldRepeatAction,
  UseHoldRepeatOptions,
} from "@/Utils/useHoldRepeat";
