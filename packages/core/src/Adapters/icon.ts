/**
 * Augmentable map of extra semantic icon names beyond the Bridge defaults.
 */
export interface SemanticIconNameOverrides {}

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
 * Pluggable icon set for Bridge UI.
 * Apps provide an adapter via `BridgeUIProvider` `global.icons`.
 */
export interface IconAdapter {
  /**
   * Resolves a semantic icon name to a framework icon component.
   */
  resolve: (name: SemanticIconName) => unknown;
}

/**
 * Semantic name or a concrete icon component (`TIcon`).
 */
export type IconSource<TIcon = unknown> = TIcon | SemanticIconName;

/**
 * Creates an {@link IconAdapter} from a complete semantic icon map.
 */
export function createIconAdapter(
  icons: Record<SemanticIconName, unknown>,
): IconAdapter {
  return {
    resolve(name) {
      const icon = icons[name];

      if (icon == null) {
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
    typeof value === "string" &&
    (SEMANTIC_ICON_NAMES as readonly string[]).includes(value)
  );
}

/**
 * Resolves an {@link IconSource}: strings go through the adapter, components pass through.
 * Semantic names require an adapter (`BridgeUIProvider` `global.icons`).
 */
export function resolveIconSource<TIcon = unknown>(
  source: null | undefined | IconSource<TIcon>,
  adapter: undefined | IconAdapter,
): null | TIcon | undefined {
  if (source == null) {
    return source;
  }

  if (typeof source === "string") {
    if (adapter == null) {
      throw new Error(
        `[BridgeUI] Semantic icon "${source}" requires BridgeUIProvider global.icons. See examples/adapters/{react,vue}.`,
      );
    }

    return adapter.resolve(source as SemanticIconName) as TIcon;
  }

  return source;
}
