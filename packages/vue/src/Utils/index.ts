// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import {
  computed,
  defineComponent,
  toValue,
  unref,
  type ComponentPublicInstance,
  type ComputedRef,
  type MaybeRefOrGetter,
} from "vue";

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
  chromeEntry: ComputedRef<undefined | BridgeUIRegistryChromeEntry>;
  components: ComputedRef<null | BridgeUIComponentsConfig>;
  entry: ComputedRef<undefined | RegistryEntryFor<K>>;
  merged: ComputedRef<P>;
};

/**
 * Defines a renderless component for unit tests (avoids Vue "missing template" warnings).
 */
export function defineHeadlessComponent(setup: () => void) {
  return defineComponent({
    name: "HeadlessTestComponent",
    setup() {
      setup();

      return () => null;
    },
  });
}

/**
 * Merges Vue-specific classes into the `class` attribute.
 */
export const mergePartBind = createMergePartBind("class");

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
  props: MaybeRefOrGetter<Partial<P>>;
}): UseBridgeUIComponentReturn<P, K> {
  const bridge = useBridgeUI();

  const components = computed(() => {
    return isNil(bridge) ? null : unref(bridge.components);
  });

  const entry = computed((): undefined | RegistryEntryFor<K> => {
    if (!componentName) {
      return undefined;
    }

    return get(components.value, componentName) as
      undefined | RegistryEntryFor<K>;
  });

  const chromeEntry = computed((): undefined | BridgeUIRegistryChromeEntry => {
    const chromeName = getBridgeUIChromeComponentName(componentName);

    if (!chromeName) {
      return undefined;
    }

    return get(components.value, chromeName) as
      undefined | BridgeUIRegistryChromeEntry;
  });

  const merged = computed(() => {
    return mergePropsWithBridgeUIDefaults({
      libDefaults,
      componentName,
      props: toValue(props) as P,
      components: components.value,
      formDefaults: bridge?.global.value.formDefaults,
    }) as P;
  });

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
  overlay: MaybeRefOrGetter<ResolvedFieldOverlay>;
  showFooter: MaybeRefOrGetter<boolean | undefined>;
}): ComputedRef<boolean> {
  const bridge = useBridgeUI();

  return computed(() => {
    const registryShowFooter = getBridgeUIRegistryDefaultProp<boolean>({
      componentName,
      prop: "showFooter",
      components: unref(bridge?.components),
    });

    return resolveFieldShowFooter(
      toValue(showFooter) ?? registryShowFooter,
      toValue(overlay),
    );
  });
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
  fill: MaybeRefOrGetter<boolean | undefined>;
  overlay?: MaybeRefOrGetter<undefined | ResolvedFieldOverlay>;
}): ComputedRef<boolean> {
  const bridge = useBridgeUI();

  return computed(() => {
    const registryFill = getBridgeUIRegistryDefaultProp<boolean>({
      prop: "fill",
      componentName,
      components: unref(bridge?.components),
    });

    return resolvePickerFill(toValue(fill) ?? registryFill, toValue(overlay));
  });
}

/**
 * Merges chrome `classes`, public registry `classes`, and instance `props.classes`.
 */
export function useBridgeUIMergedRegistryClasses<C extends object>({
  entry,
  props,
  chromeEntry,
}: {
  chromeEntry?: ComputedRef<undefined | { classes?: object }>;
  entry: ComputedRef<undefined | { classes?: object }>;
  props: MaybeRefOrGetter<{ classes?: Partial<C> }>;
}) {
  return computed(() => {
    return mergeBridgeUILayeredClasses(
      get(chromeEntry?.value, "classes") as undefined | Partial<C>,
      get(entry.value, "classes") as undefined | Partial<C>,
      toValue(props).classes,
    );
  });
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

/**
 * Resolves a Vue template ref callback value to an HTMLElement.
 */
export function resolveVnodeRefElement(
  element: null | Element | ComponentPublicInstance,
): null | HTMLElement {
  if (element instanceof HTMLElement) {
    return element;
  }

  if (element && "$el" in element) {
    const el = element.$el;

    return el instanceof HTMLElement ? el : null;
  }

  return null;
}

// ** Exports
export {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  presentSlotNames,
  RenderFn,
} from "@/Utils/slotOrProp";
export { useBreakpoint } from "@/Utils/useBreakpoint";
export type { UseBreakpointOptions } from "@/Utils/useBreakpoint";
export { useHoldRepeat } from "@/Utils/useHoldRepeat";
export type {
  HoldRepeatAction,
  UseHoldRepeatOptions,
} from "@/Utils/useHoldRepeat";
export { useOptionalModel } from "@/Utils/useOptionalModel";
