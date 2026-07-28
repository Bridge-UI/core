// ** External Imports
import { isEmpty, isNil } from "es-toolkit/compat";
import { toMerged } from "es-toolkit/object";
import {
  onBeforeUnmount,
  reactive,
  toValue,
  watch,
  type MaybeRefOrGetter,
} from "vue";

// ** Core Imports
import {
  buildBreakpointSnapshot,
  createBreakpointObserver,
  resolveBreakpoints,
  type BreakpointObserver,
  type BreakpointObserverOptions,
  type BreakpointSnapshot,
} from "@bridge-ui/core";

// ** Local Imports
import { useBridgeUI } from "@/Provider/useBridgeUI";

export type UseBreakpointOptions = BreakpointObserverOptions;

/**
 * Reactive viewport breakpoints aligned with Tailwind `--breakpoint-*` tokens.
 *
 * Returns a reactive object — call helpers on the object (do not destructure
 * them) so updates stay reactive in script.
 *
 * Falls back to `BridgeUIProvider` `global.mobileBreakpoint` and
 * `global.breakpoints`. Composable options win when passed.
 *
 * @example
 * const breakpoint = useBreakpoint();
 * // :align="breakpoint.mobile ? 'bottom-center' : 'middle-center'"
 */
export function useBreakpoint(
  options?: MaybeRefOrGetter<undefined | UseBreakpointOptions>,
): BreakpointSnapshot {
  const bridge = useBridgeUI();
  const state = reactive(
    buildBreakpointSnapshot(0, 0, resolveBreakpoints(), "sm"),
  ) as BreakpointSnapshot;

  let observer: undefined | BreakpointObserver;
  let unsubscribe: undefined | (() => void);

  function applySnapshot(next: BreakpointSnapshot) {
    const previousThresholdKeys = Object.keys(state.thresholds);

    Object.assign(state, next);

    for (const key of previousThresholdKeys) {
      if (!(key in next.thresholds)) {
        delete state.thresholds[key];
      }
    }
  }

  function resolveOptions(
    nextOptions?: UseBreakpointOptions,
  ): UseBreakpointOptions {
    const breakpoints = toMerged(
      bridge?.global.value.breakpoints ?? {},
      nextOptions?.breakpoints ?? {},
    ) as Record<string, string>;

    return {
      breakpoints: isEmpty(breakpoints) ? undefined : breakpoints,
      mobileBreakpoint: isNil(nextOptions?.mobileBreakpoint)
        ? bridge?.global.value.mobileBreakpoint
        : nextOptions.mobileBreakpoint,
    };
  }

  function bind(nextOptions?: UseBreakpointOptions) {
    unsubscribe?.();
    observer?.destroy();
    observer = createBreakpointObserver(resolveOptions(nextOptions));
    applySnapshot(observer.getSnapshot());
    unsubscribe = observer.subscribe(() => {
      if (!isNil(observer)) {
        applySnapshot(observer.getSnapshot());
      }
    });
  }

  bind(toValue(options));

  watch(
    () =>
      [
        toValue(options),
        bridge?.global.value.breakpoints,
        bridge?.global.value.mobileBreakpoint,
      ] as const,
    () => {
      bind(toValue(options));
    },
    { deep: true },
  );

  onBeforeUnmount(() => {
    unsubscribe?.();
    unsubscribe = undefined;
    observer?.destroy();
    observer = undefined;
  });

  return state;
}
