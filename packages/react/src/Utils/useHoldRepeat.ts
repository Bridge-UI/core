// ** External Imports
import type { MouseEventHandler, PointerEventHandler } from "react";
import { useCallback, useEffect, useRef } from "react";

export type HoldRepeatAction = () => boolean | void;

export type UseHoldRepeatOptions = {
  disabled?: boolean;
  initialDelayMs?: number;
  intervalMs?: number;
};

const DEFAULT_INTERVAL_MS = 75;
const DEFAULT_INITIAL_DELAY_MS = 400;

export function useHoldRepeat(
  action: HoldRepeatAction,
  options?: UseHoldRepeatOptions,
) {
  const actionRef = useRef(action);
  actionRef.current = action;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const skipClickRef = useRef(false);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const intervalTimerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const stop = useCallback(() => {
    if (delayTimerRef.current !== undefined) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = undefined;
    }

    if (intervalTimerRef.current !== undefined) {
      clearInterval(intervalTimerRef.current);
      intervalTimerRef.current = undefined;
    }
  }, []);

  const run = useCallback(() => {
    const result = actionRef.current();

    if (result === false) {
      stop();
    }
  }, [stop]);

  const start = useCallback(() => {
    stop();
    run();

    const { initialDelayMs, intervalMs } = optionsRef.current ?? {};

    delayTimerRef.current = setTimeout(() => {
      intervalTimerRef.current = setInterval(
        run,
        intervalMs ?? DEFAULT_INTERVAL_MS,
      );
    }, initialDelayMs ?? DEFAULT_INITIAL_DELAY_MS);
  }, [run, stop]);

  useEffect(() => {
    if (options?.disabled) {
      stop();
    }
  }, [options?.disabled, stop]);

  useEffect(() => stop, [stop]);

  const onPointerDown: PointerEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (optionsRef.current?.disabled) {
        return;
      }

      if (event.button !== 0) {
        return;
      }

      skipClickRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      start();
    },
    [start],
  );

  const onPointerUp: PointerEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      stop();
    },
    [stop],
  );

  const onLostPointerCapture: PointerEventHandler<HTMLButtonElement> =
    useCallback(() => {
      stop();
    }, [stop]);

  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    if (skipClickRef.current) {
      skipClickRef.current = false;

      return;
    }

    if (optionsRef.current?.disabled) {
      return;
    }

    run();
  }, [run]);

  return {
    handlers: {
      onClick,
      onPointerUp,
      onPointerDown,
      onLostPointerCapture,
    },
  };
}
