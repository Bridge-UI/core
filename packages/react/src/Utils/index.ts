// ** External Imports
import { get, has, isNil, keys } from "es-toolkit/compat";
import { useMemo, useRef } from "react";

// ** Core Imports
import type { BridgeUIComponentsConfig } from "@bridge-ui/core/Config";
import {
  resolveFieldShowFooter,
  resolvePickerFill,
  type ResolvedFieldOverlay,
} from "@bridge-ui/core/Domain";
import type { FormFieldSize, IconSize } from "@bridge-ui/core/Tokens";
import {
  createMergeNestedComponentProps,
  createMergePartBind,
  getBridgeUIChromeComponentName,
  getBridgeUIRegistryDefaultProp,
  mergeBridgeUILayeredClasses,
  mergePropsWithBridgeUIDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useBridgeUI } from "@/Provider/useBridgeUI";

type RegistryEntryFor<K extends keyof BridgeUIComponentsConfig> = NonNullable<
  BridgeUIComponentsConfig[K]
>;

type BridgeUIRegistryChromeEntry = {
  classes?: object;
  defaultProps?: object;
  tokens?: object;
};

export type UseBridgeUIComponentReturn<
  P extends object,
  K extends keyof BridgeUIComponentsConfig = keyof BridgeUIComponentsConfig,
> = {
  bridge: ReturnType<typeof useBridgeUI>;
  chromeEntry: undefined | BridgeUIRegistryChromeEntry;
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
 * True when both objects have the same own keys and values (`===`).
 */
function shallowEqual(left: object, right: object) {
  if (left === right) {
    return true;
  }

  const leftKeys = keys(left);

  if (leftKeys.length !== keys(right).length) {
    return false;
  }

  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;

  return leftKeys.every((key) => {
    return has(right, key) && leftRecord[key] === rightRecord[key];
  });
}

/**
 * Keeps the previous object identity when all own values are shallow-equal.
 */
function useShallowStable<T extends object>(value: T): T {
  const ref = useRef(value);

  if (!shallowEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
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

  const stableProps = useShallowStable(props);
  const stableLibDefaults = useShallowStable(libDefaults ?? {});
  const components = isNil(bridge) ? null : (bridge.components ?? null);
  const resolvedLibDefaults = libDefaults ? stableLibDefaults : undefined;

  const entry = componentName
    ? (get(components, componentName) as undefined | RegistryEntryFor<K>)
    : undefined;

  const chromeName = getBridgeUIChromeComponentName(componentName);

  const chromeEntry = chromeName
    ? (get(components, chromeName) as undefined | BridgeUIRegistryChromeEntry)
    : undefined;

  const merged = useMemo(() => {
    return mergePropsWithBridgeUIDefaults({
      components,
      componentName,
      props: stableProps,
      libDefaults: resolvedLibDefaults,
      formDefaults: bridge?.global.formDefaults,
    }) as P;
  }, [
    components,
    stableProps,
    componentName,
    resolvedLibDefaults,
    bridge?.global.formDefaults,
  ]);

  return {
    entry,
    bridge,
    merged,
    components,
    chromeEntry,
  };
}

/**
 * Resolves Cancel / Apply visibility: instance prop, then registry
 * `defaultProps.showFooter`, then the overlay default from core.
 */
export function useFieldShowFooter({
  overlay,
  showFooter,
  componentName,
}: {
  componentName: undefined | keyof BridgeUIComponentsConfig;
  overlay: ResolvedFieldOverlay;
  showFooter: boolean | undefined;
}): boolean {
  const bridge = useBridgeUI();

  const registryShowFooter = getBridgeUIRegistryDefaultProp<boolean>({
    componentName,
    prop: "showFooter",
    components: bridge?.components,
  });

  return resolveFieldShowFooter(showFooter ?? registryShowFooter, overlay);
}

/**
 * Resolves picker fill: instance prop, then registry `defaultProps.fill`,
 * then the overlay default from core.
 */
export function usePickerFill({
  fill,
  overlay,
  componentName,
}: {
  componentName: undefined | keyof BridgeUIComponentsConfig;
  fill: boolean | undefined;
  overlay?: ResolvedFieldOverlay;
}): boolean {
  const bridge = useBridgeUI();

  const registryFill = getBridgeUIRegistryDefaultProp<boolean>({
    prop: "fill",
    componentName,
    components: bridge?.components,
  });

  return resolvePickerFill(fill ?? registryFill, overlay);
}

/**
 * Merges chrome `classes`, public registry `classes`, and instance `props.classes`.
 */
export function useBridgeUIMergedRegistryClasses<C extends object>({
  entry,
  props,
  chromeEntry,
}: {
  chromeEntry?: { classes?: object };
  entry?: { classes?: object };
  props: { classes?: Partial<C> };
}) {
  return useMemo(() => {
    return mergeBridgeUILayeredClasses(
      get(chromeEntry, "classes") as undefined | Partial<C>,
      get(entry, "classes") as undefined | Partial<C>,
      props.classes,
    );
  }, [entry, props.classes, chromeEntry]);
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
