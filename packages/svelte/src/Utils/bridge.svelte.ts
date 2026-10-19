// ** External Imports
import { get, isNil } from "es-toolkit/compat";

// ** Core Imports
import type { BridgeUIComponentsConfig } from "@bridge-ui/core/Config";
import type { FormFieldSize, IconSize } from "@bridge-ui/core/Tokens";
import {
  createMergeNestedComponentProps,
  createMergePartBind,
  mergeBridgeUILayeredClasses,
  mergePropsWithBridgeUIDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useBridgeUI } from "@/Provider/context";

type RegistryEntryFor<K extends keyof BridgeUIComponentsConfig> = NonNullable<
  BridgeUIComponentsConfig[K]
>;

type BridgeUIRegistryChromeEntry = {
  classes?: object;
  defaultProps?: object;
  tokens?: object;
};

/**
 * Reactive registry state for one component. Fields are getters: read them
 * through the returned object (`component.merged`), never destructure.
 */
export type UseBridgeUIComponentReturn<
  P extends object,
  K extends keyof BridgeUIComponentsConfig = keyof BridgeUIComponentsConfig,
> = {
  readonly bridge: ReturnType<typeof useBridgeUI>;
  readonly chromeEntry: undefined | BridgeUIRegistryChromeEntry;
  readonly components: null | BridgeUIComponentsConfig;
  readonly entry: undefined | RegistryEntryFor<K>;
  readonly merged: P;
};

/**
 * Merges Svelte-specific classes into the `class` attribute.
 */
export const mergePartBind = createMergePartBind("class");

/**
 * Merges consumer nested-component props with package defaults (consumer wins).
 */
export const mergeNestedComponentProps =
  createMergeNestedComponentProps(mergePartBind);

/**
 * Registry entry + props merged with Bridge defaults for a named component.
 * `chrome` inherits another entry's `classes` / `defaultProps` (e.g.
 * `"FormField"`) and, for form chrome, `global.formDefaults`.
 * Colorable components (or their chrome) also receive `global.defaultColor`.
 */
export function useBridgeUIComponent<
  P extends object,
  K extends keyof BridgeUIComponentsConfig = keyof BridgeUIComponentsConfig,
>({
  props,
  chrome,
  libDefaults,
  componentName,
}: {
  chrome?: keyof BridgeUIComponentsConfig;
  componentName?: K;
  libDefaults?: Partial<P>;
  props: () => Partial<P>;
}): UseBridgeUIComponentReturn<P, K> {
  const bridge = useBridgeUI();

  const components = $derived(isNil(bridge) ? null : bridge.components);

  const entry = $derived(
    componentName
      ? (get(components, componentName) as undefined | RegistryEntryFor<K>)
      : undefined,
  );

  const chromeEntry = $derived(
    chrome
      ? (get(components, chrome) as undefined | BridgeUIRegistryChromeEntry)
      : undefined,
  );

  const merged = $derived(
    mergePropsWithBridgeUIDefaults({
      libDefaults,
      components,
      componentName,
      props: props(),
      chromeName: chrome,
      defaultColor: bridge?.global.defaultColor,
      formDefaults: bridge?.global.formDefaults,
    }) as P,
  );

  return {
    bridge,
    get entry() {
      return entry;
    },
    get merged() {
      return merged;
    },
    get components() {
      return components;
    },
    get chromeEntry() {
      return chromeEntry;
    },
  };
}

/**
 * Getter for chrome `classes`, public registry `classes`, and instance
 * `props.classes`, merged in that order.
 */
export function useBridgeUIMergedRegistryClasses<C extends object>(
  source: () => {
    chromeEntry?: { classes?: object };
    entry?: { classes?: object };
    props: { classes?: Partial<C> };
  },
): () => Partial<C> {
  const classes = $derived.by(() => {
    const { entry, props, chromeEntry } = source();

    return mergeBridgeUILayeredClasses(
      get(chromeEntry, "classes") as undefined | Partial<C>,
      get(entry, "classes") as undefined | Partial<C>,
      props.classes,
    );
  });

  return () => {
    return classes;
  };
}

/**
 * Maps a form field `size` to the `Icon` size used by field adornments.
 */
export function resolveFieldAdornmentIconSize(
  fieldSize?: keyof FormFieldSize,
): keyof IconSize {
  // prettier-ignore
  return get(
    {
      "xs": "xs",
      "sm": "sm",
      "md": "md",
      "lg": "md",
      "xl": "lg",
      "2xs": "xs",
      "2xl": "lg",
    },
    fieldSize ?? "md",
  ) as keyof IconSize;
}
