// ** External Imports
import { get, isEmpty, isNil, mapValues, sortBy } from "es-toolkit/compat";
import { toMerged } from "es-toolkit/object";

// ** Local Imports
import { hasDocument, hasWindow } from "@/Utils/env";

/**
 * Tailwind default breakpoint CSS lengths (`--breakpoint-*`).
 */
export const DEFAULT_BREAKPOINTS = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
  "2xl": "96rem",
} as const;

/**
 * Options for {@link createBreakpointObserver}.
 */
export type BreakpointObserverOptions = {
  /**
   * Extra or overridden breakpoint CSS lengths (e.g. `{ "3xl": "120rem" }`).
   * Merged over CSS vars and {@link DEFAULT_BREAKPOINTS}.
   */
  breakpoints?: Record<string, string>;

  /**
   * Named threshold below which {@link BreakpointSnapshot.mobile} is true.
   * In React/Vue hooks, falls back to `BridgeUIProvider` `global.mobileBreakpoint`.
   *
   * @default "sm"
   */
  mobileBreakpoint?: string;
};

/**
 * Viewport breakpoint state with comparison helpers.
 *
 * Helpers accept any resolved breakpoint name (Tailwind defaults or custom
 * `--breakpoint-*` / `breakpoints` overrides). Unknown names return `false`.
 */
export type BreakpointSnapshot = {
  /**
   * `true` when `width >= min` and `width < max`.
   */
  between: (min: string, max: string) => boolean;

  /**
   * `true` when `width >=` the named breakpoint threshold (Tailwind `sm:` semantics).
   */
  greaterOrEqual: (name: string) => boolean;

  /**
   * `true` when `width >` the named breakpoint threshold.
   */
  greaterThan: (name: string) => boolean;

  /**
   * Viewport height in CSS pixels.
   */
  height: number;

  /**
   * `true` when `width <=` the named breakpoint threshold.
   */
  lessOrEqual: (name: string) => boolean;

  /**
   * `true` when `width <` the named breakpoint threshold.
   */
  lessThan: (name: string) => boolean;

  /**
   * Whether the viewport is below {@link BreakpointObserverOptions.mobileBreakpoint}.
   */
  mobile: boolean;

  /**
   * Active band name (`xs` below the smallest threshold, else a breakpoint key).
   */
  name: string;

  /**
   * Resolved min-width thresholds in CSS pixels.
   */
  thresholds: Record<string, number>;

  /**
   * Viewport width in CSS pixels.
   */
  width: number;
};

/**
 * Subscribe / snapshot handle for viewport breakpoints.
 */
export type BreakpointObserver = {
  /**
   * Release this handle. Shared observers tear down when the last consumer leaves.
   */
  destroy: () => void;

  /**
   * SSR / hydration snapshot (xs / mobile defaults).
   */
  getServerSnapshot: () => BreakpointSnapshot;

  /**
   * Current snapshot (stable reference until the viewport changes).
   */
  getSnapshot: () => BreakpointSnapshot;

  /**
   * Subscribe to viewport changes. Returns an unsubscribe function.
   */
  subscribe: (listener: () => void) => () => void;
};

type SharedBreakpointObserverEntry = {
  observer: BreakpointObserver;
  refCount: number;
};

let discoveredKeysCache: null | string[] = null;
const sharedObservers = new Map<string, SharedBreakpointObserverEntry>();

/**
 * Cache key for shared observers (stable across equivalent options).
 */
export function breakpointObserverOptionsKey(
  options?: BreakpointObserverOptions,
): string {
  return JSON.stringify({
    breakpoints: options?.breakpoints ?? null,
    mobileBreakpoint: options?.mobileBreakpoint ?? "sm",
  });
}

/**
 * Clears discovery + shared observer caches. For tests only.
 */
export function resetBreakpointCachesForTests() {
  discoveredKeysCache = null;

  for (const entry of sharedObservers.values()) {
    entry.observer.destroy();
  }

  sharedObservers.clear();
}

/**
 * Converts a CSS length (`40rem`, `640px`, …) to CSS pixels.
 */
export function cssLengthToPx(value: string, rootFontSize = 16): number {
  const trimmed = value.trim();

  if (trimmed.endsWith("rem") || trimmed.endsWith("em")) {
    return parseFloat(trimmed) * rootFontSize;
  }

  if (trimmed.endsWith("px")) {
    return parseFloat(trimmed);
  }

  const asNumber = parseFloat(trimmed);

  return Number.isFinite(asNumber) ? asNumber : 0;
}

/**
 * Collects breakpoint names from stylesheets (`--breakpoint-*` custom properties).
 * Results are cached until {@link resetBreakpointCachesForTests}.
 */
export function discoverBreakpointKeys(): string[] {
  if (!isNil(discoveredKeysCache)) {
    return discoveredKeysCache;
  }

  if (!hasDocument()) {
    discoveredKeysCache = [];

    return discoveredKeysCache;
  }

  const keys = new Set<string>();

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;

    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }

    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule)) {
        continue;
      }

      for (const property of Array.from(rule.style)) {
        if (!property.startsWith("--breakpoint-")) {
          continue;
        }

        keys.add(property.slice("--breakpoint-".length));
      }
    }
  }

  discoveredKeysCache = Array.from(keys);

  return discoveredKeysCache;
}

/**
 * Reads `--breakpoint-*` from `:root`, merges defaults and overrides, returns px.
 */
export function resolveBreakpoints(
  overrides?: Record<string, string>,
): Record<string, number> {
  const rootFontSize = hasDocument()
    ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    : 16;

  const fromCss: Record<string, string> = {};

  const keys = new Set<string>([
    ...Object.keys(DEFAULT_BREAKPOINTS),
    ...discoverBreakpointKeys(),
    ...Object.keys(overrides ?? {}),
  ]);

  if (hasWindow() && hasDocument()) {
    const styles = getComputedStyle(document.documentElement);

    for (const key of keys) {
      const raw = styles.getPropertyValue(`--breakpoint-${key}`).trim();

      if (!isEmpty(raw)) {
        fromCss[key] = raw;
      }
    }
  }

  const merged = toMerged(
    toMerged({ ...DEFAULT_BREAKPOINTS }, fromCss),
    overrides ?? {},
  ) as Record<string, string>;

  return mapValues(merged, (length) => cssLengthToPx(length, rootFontSize));
}

/**
 * Builds a {@link BreakpointSnapshot} for the given viewport size.
 */
export function buildBreakpointSnapshot(
  width: number,
  height: number,
  thresholds: Record<string, number>,
  mobileBreakpoint = "sm",
): BreakpointSnapshot {
  const sorted = sortBy(Object.entries(thresholds), ([, px]) => px);

  let name = "xs";

  for (const [key, px] of sorted) {
    if (width >= px) {
      name = key;
    }
  }

  function resolve(breakpoint: string) {
    return get(thresholds, breakpoint) as number | undefined;
  }

  function compare(
    breakpoint: string,
    predicate: (viewportWidth: number, threshold: number) => boolean,
  ) {
    const px = resolve(breakpoint);

    return isNil(px) ? false : predicate(width, px);
  }

  function lessThan(breakpoint: string) {
    return compare(breakpoint, (viewportWidth, px) => viewportWidth < px);
  }

  function lessOrEqual(breakpoint: string) {
    return compare(breakpoint, (viewportWidth, px) => viewportWidth <= px);
  }

  function greaterThan(breakpoint: string) {
    return compare(breakpoint, (viewportWidth, px) => viewportWidth > px);
  }

  function greaterOrEqual(breakpoint: string) {
    return compare(breakpoint, (viewportWidth, px) => viewportWidth >= px);
  }

  function between(min: string, max: string) {
    return greaterOrEqual(min) && lessThan(max);
  }

  const mobileThreshold =
    get(thresholds, mobileBreakpoint) ?? sorted[0]?.[1] ?? 0;

  return {
    name,
    width,
    height,
    between,
    lessThan,
    lessOrEqual,
    greaterThan,
    greaterOrEqual,
    thresholds: { ...thresholds },
    mobile: width < mobileThreshold,
  };
}

/**
 * Creates a non-shared observer instance (one set of listeners).
 */
function createBreakpointObserverInstance(
  options?: BreakpointObserverOptions,
): BreakpointObserver {
  let destroyed = false;
  let onResize: undefined | (() => void);
  const listeners = new Set<() => void>();
  const mediaQueries: MediaQueryList[] = [];
  const mobileBreakpoint = options?.mobileBreakpoint ?? "sm";
  const thresholds = resolveBreakpoints(options?.breakpoints);
  const serverSnapshot = buildBreakpointSnapshot(
    0,
    0,
    thresholds,
    mobileBreakpoint,
  );
  let snapshot = serverSnapshot;

  function readViewport() {
    if (!hasWindow()) {
      return { width: 0, height: 0 };
    }

    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  function refresh() {
    if (destroyed) {
      return;
    }

    const { width, height } = readViewport();

    snapshot = buildBreakpointSnapshot(
      width,
      height,
      thresholds,
      mobileBreakpoint,
    );

    for (const listener of listeners) {
      listener();
    }
  }

  function attach() {
    if (!hasWindow() || destroyed) {
      return;
    }

    refresh();

    for (const px of Object.values(thresholds)) {
      const query = window.matchMedia(`(min-width: ${px}px)`);

      query.addEventListener("change", refresh);
      mediaQueries.push(query);
    }

    onResize = refresh;
    window.addEventListener("resize", onResize);
  }

  function destroy() {
    if (destroyed) {
      return;
    }

    destroyed = true;
    listeners.clear();

    for (const query of mediaQueries) {
      query.removeEventListener("change", refresh);
    }

    mediaQueries.length = 0;

    if (!isNil(onResize) && hasWindow()) {
      window.removeEventListener("resize", onResize);
    }

    onResize = undefined;
  }

  attach();

  return {
    destroy,
    getSnapshot: () => snapshot,
    getServerSnapshot: () => serverSnapshot,
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/**
 * Observes viewport breakpoints. Equivalent options share one listener set
 * (ref-counted); call {@link BreakpointObserver.destroy} when done.
 */
export function createBreakpointObserver(
  options?: BreakpointObserverOptions,
): BreakpointObserver {
  const key = breakpointObserverOptionsKey(options);
  let entry = sharedObservers.get(key);

  if (isNil(entry)) {
    entry = {
      refCount: 0,
      observer: createBreakpointObserverInstance(options),
    };
    sharedObservers.set(key, entry);
  }

  const shared = entry;

  shared.refCount += 1;

  let released = false;

  return {
    subscribe: shared.observer.subscribe,
    getSnapshot: shared.observer.getSnapshot,
    getServerSnapshot: shared.observer.getServerSnapshot,
    destroy: () => {
      if (released) {
        return;
      }

      released = true;
      shared.refCount -= 1;

      if (shared.refCount > 0) {
        return;
      }

      shared.observer.destroy();
      sharedObservers.delete(key);
    },
  };
}
