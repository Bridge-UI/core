// ** External Imports
import { isEmpty } from "es-toolkit/compat";
import { toMerged } from "es-toolkit/object";
import { useMemo, useSyncExternalStore } from "react";

// ** Core Imports
import {
  breakpointObserverOptionsKey,
  createBreakpointObserver,
  type BreakpointObserverOptions,
  type BreakpointSnapshot,
} from "@bridge-ui/core";

// ** Local Imports
import { useBridgeUI } from "@/Provider/useBridgeUI";

export type UseBreakpointOptions = BreakpointObserverOptions;

/**
 * Reactive viewport breakpoints aligned with Tailwind `--breakpoint-*` tokens.
 *
 * Falls back to `BridgeUIProvider` `global.mobileBreakpoint` and
 * `global.breakpoints`. Hook options win when passed.
 *
 * On the server (and before hydration), `mobile` is `true` at width `0`.
 */
export function useBreakpoint(
  options?: UseBreakpointOptions,
): BreakpointSnapshot {
  const bridge = useBridgeUI();
  const mobileBreakpoint =
    options?.mobileBreakpoint ?? bridge?.global.mobileBreakpoint;
  const mergedBreakpoints = toMerged(
    bridge?.global.breakpoints ?? {},
    options?.breakpoints ?? {},
  ) as Record<string, string>;
  const breakpoints = isEmpty(mergedBreakpoints)
    ? undefined
    : mergedBreakpoints;
  const optionsKey = breakpointObserverOptionsKey({
    breakpoints,
    mobileBreakpoint,
  });

  // Recreate only when serialized options change (inline objects stay stable).
  const observer = useMemo(() => {
    return createBreakpointObserver({
      breakpoints,
      mobileBreakpoint,
    });
  }, [optionsKey]);

  return useSyncExternalStore(
    observer.subscribe,
    observer.getSnapshot,
    observer.getServerSnapshot,
  );
}
