// ** External Imports
import { isEmpty, isNil } from "es-toolkit/compat";
import { toMerged } from "es-toolkit/object";
import {
  onBeforeUnmount,
  onMounted,
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
} from "@bridge-ui/core/Runtime";

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
 * On the server and during the hydration pass, `mobile` stays `true` (width
 * `0`) so SSR HTML matches the client first paint. The real viewport is applied
 * after mount — same contract as React's `useSyncExternalStore` +
 * `getServerSnapshot`.
 */
export function useBreakpoint(
  options?: MaybeRefOrGetter<undefined | UseBreakpointOptions>,
): BreakpointSnapshot {
  const bridge = useBridgeUI();
  const state = reactive(
    buildBreakpointSnapshot(0, 0, resolveBreakpoints(), "sm"),
  ) as BreakpointSnapshot;

  let mounted = false;

  let observer: undefined | BreakpointObserver;
  let unsubscribe: undefined | (() => void);

  function applySnapshot(next: BreakpointSnapshot) {
    Object.assign(state, next);
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
    unsubscribe = undefined;
    observer = createBreakpointObserver(resolveOptions(nextOptions));

    // Seed from the server snapshot until mount so SSR and hydration agree.
    // Applying `window.innerWidth` during setup makes `overlay="auto"` SSR as
    // Drawer and hydrate as Menu on desktop, which breaks Teleport hosts.
    applySnapshot(
      mounted ? observer.getSnapshot() : observer.getServerSnapshot(),
    );

    if (!mounted) {
      return;
    }

    unsubscribe = observer.subscribe(() => {
      if (!isNil(observer)) {
        applySnapshot(observer.getSnapshot());
      }
    });
  }

  bind(toValue(options));

  onMounted(() => {
    mounted = true;
    bind(toValue(options));
  });

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
    observer = undefined;
  });

  return state;
}
