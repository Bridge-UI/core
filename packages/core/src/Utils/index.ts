// ** External Imports
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { compact, get, isNil, omit, pick, reduce } from "es-toolkit/compat";
import { toMerged } from "es-toolkit/object";
import { twMerge } from "tailwind-merge";

// ** Local Imports
import type { BridgeUIComponentsConfig } from "@core/Config/types";
import type { ClassPropKey, MergePartBind } from "@core/Utils/types";

/**
 * Converts a string or object to a record of strings.
 */
function toBridgeProps<K extends ClassPropKey>(
  classKey: K,
  value: object | string | undefined,
): Record<string, unknown> {
  if (typeof value === "string") {
    return { [classKey]: value };
  }

  return (value ?? {}) as Record<string, unknown>;
}

/**
 * Resizes an autosize `<textarea>` to fit its content (`scrollHeight`).
 */
export function adjustAutosizeTextareaHeight(
  element: HTMLTextAreaElement,
): void {
  element.style.height = "auto";
  element.style.lineHeight = "";
  element.style.height = `${element.scrollHeight}px`;
}

/**
 * Merges class values into a single string of class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Merges `partProps`, `inheritedAttrs`, and `bridgeProps` (package).
 * Later layers override; `class` / `className` merged via `cn`.
 */
export function createMergePartBind<const K extends ClassPropKey>(classKey: K) {
  return function mergePartBind<
    Bridge extends object,
    Part extends object | undefined = undefined,
    Inherited extends object | undefined = undefined,
  >(
    partProps: Part,
    inheritedAttrs: Inherited,
    bridgeProps: Bridge | string,
  ): MergePartBind<Bridge, K, Part, Inherited> {
    const bridge = toBridgeProps(classKey, bridgeProps);

    const bridgeClass = get(bridge, classKey) as string | undefined;

    const partClass = get(partProps, classKey) as string | undefined;

    const inheritedClass = get(inheritedAttrs, classKey) as string | undefined;

    return {
      ...bridge,
      ...(inheritedAttrs ?? {}),
      ...(partProps ?? {}),
      [classKey]: cn(bridgeClass, inheritedClass, partClass),
    } as MergePartBind<Bridge, K, Part, Inherited>;
  };
}

/**
 * Merges class maps from the Bridge registry and the instance (later layers
 * override earlier ones). Typical use: `registry.classes` then `props.classes`.
 */
export function mergeBridgeUILayeredClasses<C extends object>(
  ...layers: Array<Partial<C> | undefined>
): Partial<C> {
  return reduce(
    layers,
    (acc, layer) => {
      if (isNil(layer)) {
        return acc;
      }

      return toMerged(acc, layer);
    },
    {} as Partial<C>,
  );
}

/**
 * Merges props with Bridge UI defaults and registry defaults.
 */
export function mergePropsWithBridgeUIDefaults<
  P extends object,
  K extends keyof BridgeUIComponentsConfig,
>({
  props,
  components,
  libDefaults,
  componentName,
}: {
  props: P;
  componentName: K;
  libDefaults?: Partial<P>;
  components: BridgeUIComponentsConfig | null | undefined;
}): P {
  const fromRegistry = get(components, [componentName, "defaultProps"]) as
    | Partial<P>
    | undefined;

  return mergeBridgeUILayeredClasses<P>(libDefaults, fromRegistry, props) as P;
}

/**
 * Splits `props` into Bridge keys (`customProps`) and the rest (`inheritedAttrs`).
 */
export function splitComponentProps<
  P extends object,
  const BridgeKeys extends ReadonlyArray<keyof P>,
>({
  props,
  bridgeKeys,
}: {
  props: P;
  bridgeKeys: BridgeKeys;
}): {
  customProps: Pick<P, BridgeKeys[number]>;
  inheritedAttrs: Omit<P, BridgeKeys[number]>;
} {
  const list = compact(bridgeKeys);

  return {
    customProps: pick(props, list),
    inheritedAttrs: omit(props, list),
  };
}

export {
  closeLayer,
  closeTopLayer,
  getLayerCount,
  hideLayer,
  isLayerMounted,
  removeLayer,
  updateLayer,
  type LayerRegistryEntry,
} from "@core/Utils/layerRegistry";
export {
  acquireModalStackOrder,
  countModalTransitionLayers,
  createLayerId,
  getModalOverlayTransitionClass,
  getModalPanelTransitionClass,
  getModalStackEntry,
  getModalStackSnapshot,
  hasModalTransition,
  isModalStackTop,
  MODAL_STACK_BASE_Z_INDEX,
  pushModalStack,
  resetModalStackForTests,
  resolveEffectiveModalTransition,
  type LayerId,
  type ModalStackHandle,
  type ModalStackSnapshotEntry,
} from "@core/Utils/modal";
export {
  isModalBackdropClick,
  resolveModalPortalElement,
} from "@core/Utils/portal";
export type {
  ClassPropKey,
  LibDefaultsShape,
  MergeHtmlProps,
  MergeLibDefaults,
  MergePartBind,
  MergeProps,
  Overwrite,
  UnionProps,
} from "@core/Utils/types";
