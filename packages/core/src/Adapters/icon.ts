// ** External Imports
import { isNil, isString } from "es-toolkit/compat";

/**
 * Augmentable map of extra semantic icon names beyond the Bridge defaults.
 */
export interface SemanticIconNameOverrides {}

/**
 * Augmentable native icon values accepted by {@link IconSource}
 * (e.g. Font Awesome `IconDefinition` in an app module augmentation).
 */
export interface IconSourceValueOverrides {}

/** Default semantic names shipped by Bridge (excludes augmentations). */
export const SEMANTIC_ICON_NAMES = [
  "eye",
  "bell",
  "info",
  "user",
  "alert",
  "check",
  "clear",
  "error",
  "eyeOff",
  "loader",
  "success",
  "warning",
  "chevronUp",
  "chevronDown",
  "chevronUpDown",
] as const;

/**
 * Semantic icon names used by Bridge chrome and public `IconSource` props.
 */
export type SemanticIconName =
  | keyof SemanticIconNameOverrides
  | (typeof SEMANTIC_ICON_NAMES)[number];

/**
 * Extra icon values from {@link IconSourceValueOverrides} module augmentation.
 */
export type IconSourceValue =
  IconSourceValueOverrides[keyof IconSourceValueOverrides];

/**
 * Pluggable icon set for Bridge UI.
 * Apps provide an adapter via `BridgeUIProvider` `global.icons`.
 */
export interface IconAdapter {
  /**
   * Converts library-native icon values into a renderable component.
   * Called for both semantic resolves and concrete `icon` props.
   *
   * @example Font Awesome adapters wrap `IconDefinition` values here.
   */
  normalize?: (source: unknown) => unknown;

  /**
   * Resolves a semantic icon name to a framework icon component
   * (or a library-native value that {@link normalize} can convert).
   */
  resolve: (name: SemanticIconName) => unknown;
}

/**
 * Semantic name, concrete icon component (`TIcon`), or an augmented native value.
 */
export type IconSource<TIcon = unknown> =
  | TIcon
  | IconSourceValue
  | SemanticIconName;

/**
 * Optional hooks when building an {@link IconAdapter} from a semantic map.
 */
export type CreateIconAdapterOptions = {
  /**
   * Converts library-native icon values into a renderable component.
   */
  normalize?: (source: unknown) => unknown;
};

/**
 * Creates an {@link IconAdapter} from a complete semantic icon map.
 */
export function createIconAdapter(
  icons: Record<SemanticIconName, unknown>,
  options?: CreateIconAdapterOptions,
): IconAdapter {
  return {
    normalize: options?.normalize,
    resolve(name) {
      const icon = icons[name];

      if (isNil(icon)) {
        throw new Error(`[BridgeUI] Missing icon "${name}" in icon adapter.`);
      }

      return icon;
    },
  };
}

/**
 * Returns whether `value` is a known default semantic icon name.
 */
export function isSemanticIconName(value: unknown): value is SemanticIconName {
  return (
    isString(value) &&
    (SEMANTIC_ICON_NAMES as readonly string[]).includes(value)
  );
}

/**
 * Resolves an {@link IconSource}: strings go through `resolve`, then optional
 * `normalize` runs for library-native values (e.g. Font Awesome definitions).
 * Semantic names require an adapter (`BridgeUIProvider` `global.icons`).
 */
export function resolveIconSource<TIcon = unknown>(
  source: null | undefined | IconSource<TIcon>,
  adapter: undefined | IconAdapter,
): null | TIcon | undefined {
  if (isNil(source)) {
    return source;
  }

  let resolved: unknown = source;

  if (isString(source)) {
    if (isNil(adapter)) {
      throw new Error(
        `[BridgeUI] Semantic icon "${source}" requires BridgeUIProvider global.icons. See examples/adapters/{react,vue}.`,
      );
    }

    resolved = adapter.resolve(source as SemanticIconName);
  }

  if (!isNil(adapter?.normalize)) {
    resolved = adapter.normalize(resolved);
  }

  return resolved as TIcon;
}
