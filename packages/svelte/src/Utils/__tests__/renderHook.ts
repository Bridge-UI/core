// ** External Imports
import { render } from "@testing-library/svelte";

// ** Local Imports
import HookHarness from "@/Utils/__tests__/HookHarness.svelte";

/**
 * Runs `hook` inside a component so runes and context work. The hook gets a
 * getter for the component's `$props()`; `rerender` updates them. `setup`
 * runs first in the same component (e.g. to set a context).
 */
export function renderHook<P extends object, R>(
  hook: (props: () => P) => R,
  { props, setup }: { props?: P; setup?: () => void } = {},
) {
  let result!: R;

  const view = render(HookHarness, {
    props: {
      ...props,
      setup,
      hook: hook as unknown as (
        props: () => Record<string, unknown>,
      ) => unknown,
      onResult: (value: unknown) => {
        result = value as R;
      },
    },
  });

  return {
    result,
    rerender: (next: Partial<P>) => {
      return view.rerender(next);
    },
  };
}
