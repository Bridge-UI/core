// ** External Imports
import { isNil } from "es-toolkit/compat";
import { onBeforeUnmount, toValue, type MaybeRefOrGetter } from "vue";

export type HoldRepeatAction = () => void | boolean;

export type UseHoldRepeatOptions = {
  disabled?: boolean;
  initialDelayMs?: number;
  intervalMs?: number;
};

const DEFAULT_INTERVAL_MS = 75;
const DEFAULT_INITIAL_DELAY_MS = 400;

export function useHoldRepeat(
  action: HoldRepeatAction,
  options?: MaybeRefOrGetter<UseHoldRepeatOptions>,
) {
  let skipClick = false;

  let delayTimer: undefined | ReturnType<typeof setTimeout>;
  let intervalTimer: undefined | ReturnType<typeof setInterval>;

  const stop = () => {
    if (!isNil(delayTimer)) {
      clearTimeout(delayTimer);
      delayTimer = undefined;
    }

    if (!isNil(intervalTimer)) {
      clearInterval(intervalTimer);
      intervalTimer = undefined;
    }
  };

  const run = () => {
    const result = action();

    if (result === false) {
      stop();
    }
  };

  const start = () => {
    stop();
    run();

    const { intervalMs, initialDelayMs } = toValue(options) ?? {};

    delayTimer = setTimeout(() => {
      intervalTimer = setInterval(run, intervalMs ?? DEFAULT_INTERVAL_MS);
    }, initialDelayMs ?? DEFAULT_INITIAL_DELAY_MS);
  };

  onBeforeUnmount(stop);

  const onPressClick = () => {
    if (skipClick) {
      skipClick = false;

      return;
    }

    if (toValue(options)?.disabled) {
      return;
    }

    run();
  };

  const onPressPointerDown = (event: PointerEvent) => {
    if (toValue(options)?.disabled) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    skipClick = true;
    (event.currentTarget as HTMLButtonElement).setPointerCapture(
      event.pointerId,
    );
    start();
  };

  const onPressPointerUp = (event: PointerEvent) => {
    const target = event.currentTarget as HTMLButtonElement;

    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }

    stop();
  };

  const onPressLostPointerCapture = () => {
    stop();
  };

  return {
    onPressClick,
    onPressPointerUp,
    onPressPointerDown,
    onPressLostPointerCapture,
  };
}
