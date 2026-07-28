// ** External Imports
import { isEmpty, isNil } from "es-toolkit/compat";
import { toMerged } from "es-toolkit/object";
import { useEffect, useMemo, useSyncExternalStore } from "react";

// ** Core Imports
import {
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
 * @example
 * const breakpoint = useBreakpoint();
 * <Modal align={breakpoint.mobile ? "bottom-center" : "middle-center"} />
 */
export function useBreakpoint(
  options?: UseBreakpointOptions,
): BreakpointSnapshot {
  const bridge = useBridgeUI();
  const mobileBreakpoint =
    options?.mobileBreakpoint ?? bridge?.global.mobileBreakpoint;
  const breakpoints = useMemo(() => {
    const merged = toMerged(
      bridge?.global.breakpoints ?? {},
      options?.breakpoints ?? {},
    ) as Record<string, string>;

    return isEmpty(merged) ? undefined : merged;
  }, [options?.breakpoints, bridge?.global.breakpoints]);

  const breakpointsKey = isNil(breakpoints)
    ? null
    : JSON.stringify(breakpoints);

  const observer = useMemo(() => {
    return createBreakpointObserver({
      mobileBreakpoint,
      breakpoints: isNil(breakpointsKey)
        ? undefined
        : (JSON.parse(breakpointsKey) as Record<string, string>),
    });
  }, [breakpointsKey, mobileBreakpoint]);

  useEffect(() => {
    return () => {
      observer.destroy();
    };
  }, [observer]);

  return useSyncExternalStore(
    observer.subscribe,
    observer.getSnapshot,
    observer.getServerSnapshot,
  );
}
