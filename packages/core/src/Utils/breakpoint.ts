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
 *
 * Lifecycle is **subscribe-owned**: listeners attach on the first `subscribe`
 * and tear down when the last subscriber unsubscribes. `destroy` is a no-op
 * kept for API compatibility.
 */
export type BreakpointObserver = {
  /**
   * No-op. Tear-down is owned by `subscribe` unsubscribe.
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
  const breakpoints = options?.breakpoints;
  const sortedBreakpoints = isNil(breakpoints)
    ? null
    : Object.fromEntries(
        Object.entries(breakpoints).sort(([left], [right]) =>
          left.localeCompare(right),
        ),
      );

  return JSON.stringify({
    breakpoints: sortedBreakpoints,
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
 * Walks style + grouping rules (e.g. `@layer`) for `--breakpoint-*` names.
 */
function collectBreakpointKeysFromRules(rules: CSSRuleList, keys: Set<string>) {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule) {
      const { style } = rule;

      for (let index = 0; index < style.length; index += 1) {
        const property = style.item(index);

        if (isNil(property) || !property.startsWith("--breakpoint-")) {
          continue;
        }

        keys.add(property.slice("--breakpoint-".length));
      }

      continue;
    }

    if (!("cssRules" in rule)) {
      continue;
    }

    try {
      collectBreakpointKeysFromRules((rule as CSSGroupingRule).cssRules, keys);
    } catch {
      // Inaccessible nested rules (cross-origin / browser limits).
    }
  }
}

/**
 * Collects breakpoint names from stylesheets (`--breakpoint-*` custom properties).
 * Results are cached on the client until {@link resetBreakpointCachesForTests}.
 * SSR never caches, so a shared module instance cannot poison the client.
 */
export function discoverBreakpointKeys(): string[] {
  if (!hasDocument()) {
    return [];
  }

  if (!isNil(discoveredKeysCache)) {
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

    collectBreakpointKeysFromRules(rules, keys);
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
    get(thresholds, mobileBreakpoint) ??
    get(thresholds, "sm") ??
    sorted[0]?.[1] ??
    0;

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

    if (width === snapshot.width && height === snapshot.height) {
      return;
    }

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
 * Observes viewport breakpoints. Equivalent options share one listener set.
 *
 * Ref-counting is subscribe-owned so React can safely call this during render
 * without leaking when concurrent renders are discarded.
 */
export function createBreakpointObserver(
  options?: BreakpointObserverOptions,
): BreakpointObserver {
  const key = breakpointObserverOptionsKey(options);
  const mobileBreakpoint = options?.mobileBreakpoint ?? "sm";
  let cachedServerSnapshot: undefined | BreakpointSnapshot;
  let cachedPreSubscribeSnapshot: undefined | BreakpointSnapshot;

  function getServerSnapshot() {
    cachedServerSnapshot ??= buildBreakpointSnapshot(
      0,
      0,
      resolveBreakpoints(options?.breakpoints),
      mobileBreakpoint,
    );

    return cachedServerSnapshot;
  }

  function getSnapshot() {
    const existing = sharedObservers.get(key);

    if (existing) {
      return existing.observer.getSnapshot();
    }

    if (!hasWindow()) {
      return getServerSnapshot();
    }

    // React may call getSnapshot during render before subscribe runs; return a
    // stable reference so useSyncExternalStore does not loop.
    cachedPreSubscribeSnapshot ??= buildBreakpointSnapshot(
      window.innerWidth,
      window.innerHeight,
      resolveBreakpoints(options?.breakpoints),
      mobileBreakpoint,
    );

    return cachedPreSubscribeSnapshot;
  }

  return {
    getSnapshot,
    getServerSnapshot,
    destroy: () => {
      // Subscribe-owned lifecycle — kept for API compatibility.
    },
    subscribe: (listener) => {
      let entry = sharedObservers.get(key);

      if (isNil(entry)) {
        entry = {
          refCount: 0,
          observer: createBreakpointObserverInstance(options),
        };
        sharedObservers.set(key, entry);
      }

      entry.refCount += 1;

      const unsubscribe = entry.observer.subscribe(listener);

      return () => {
        unsubscribe();
        entry.refCount -= 1;

        if (entry.refCount > 0) {
          return;
        }

        entry.observer.destroy();
        sharedObservers.delete(key);
      };
    },
  };
}
