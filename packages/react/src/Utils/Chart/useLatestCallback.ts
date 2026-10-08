// ** External Imports
import { isNil } from "es-toolkit/compat";
import { useCallback, useLayoutEffect, useRef } from "react";

/**
 * Stable wrapper around the latest `callback`, so inline formatters do not
 * redraw the plot on every render. `undefined` while `callback` is unset.
 */
export function useLatestCallback<Args extends unknown[], Result>(
  callback: undefined | ((...args: Args) => Result),
): undefined | ((...args: Args) => Result) {
  const ref = useRef(callback);

  useLayoutEffect(() => {
    ref.current = callback;
  });

  const stable = useCallback((...args: Args) => {
    return (ref.current as (...args: Args) => Result)(...args);
  }, []);

  return isNil(callback) ? undefined : stable;
}
