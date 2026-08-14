// ** External Imports
import { clamp, isArray, isNumber, range } from "es-toolkit/compat";

/** Default minimum value for the Slider. */
export const DEFAULT_SLIDER_MIN = 0;

/** Default maximum value for the Slider. */
export const DEFAULT_SLIDER_MAX = 100;

/** Default step size for the Slider. */
export const DEFAULT_SLIDER_STEP = 1;

/**
 * A mark on the slider track, optionally labeled.
 */
export type SliderStop = {
  /**
   * Optional label rendered below the stop.
   */
  label?: string;

  /**
   * Numeric value of the stop within `[min, max]`.
   */
  value: number;
};

/**
 * Accepted stop input: a bare number or a full {@link SliderStop}.
 */
export type SliderStopInput = number | SliderStop;

/**
 * Inclusive range tuple used when `range` is enabled.
 */
export type SliderRangeValue = [number, number];

/**
 * Resolved min / max / step for a slider instance.
 */
export type SliderBounds = {
  max: number;
  min: number;
  step: number;
};

/**
 * Options for computing the filled bar geometry.
 */
export type SliderBarGeometry = {
  /**
   * Inline-start offset of the filled bar (CSS percentage string).
   */
  start: string;

  /**
   * Width of the filled bar (CSS percentage string).
   */
  width: string;
};

/**
 * Resolves slider bounds with library defaults.
 */
export function resolveSliderBounds({
  max = DEFAULT_SLIDER_MAX,
  min = DEFAULT_SLIDER_MIN,
  step = DEFAULT_SLIDER_STEP,
}: Partial<SliderBounds> = {}): SliderBounds {
  const resolvedMin = Number.isFinite(min) ? min : DEFAULT_SLIDER_MIN;
  const resolvedMax = Number.isFinite(max) ? max : DEFAULT_SLIDER_MAX;
  const resolvedStep =
    Number.isFinite(step) && step > 0 ? step : DEFAULT_SLIDER_STEP;

  if (resolvedMax < resolvedMin) {
    return {
      min: resolvedMax,
      max: resolvedMin,
      step: resolvedStep,
    };
  }

  return {
    min: resolvedMin,
    max: resolvedMax,
    step: resolvedStep,
  };
}

/**
 * Decimal precision needed to represent `min`, `max`, and `step`.
 */
export function getSliderPrecision(min: number, max: number, step: number) {
  const precisions = [min, max, step].map((item) => {
    const decimal = `${item}`.split(".")[1];

    return decimal ? decimal.length : 0;
  });

  return Math.max(...precisions);
}

/**
 * Clamps `value` into `[min, max]`.
 */
export function clampSliderValue(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return clamp(value, min, max);
}

/**
 * Converts a value to a 0–100 percentage of the track.
 */
export function valueToPercent(value: number, min: number, max: number) {
  if (max === min) {
    return 0;
  }

  const clamped = clampSliderValue(value, min, max);

  return ((clamped - min) / (max - min)) * 100;
}

/**
 * Snaps `value` to the nearest step within `[min, max]`.
 */
export function snapSliderValue(
  value: number,
  min: number,
  max: number,
  step: number,
) {
  const precision = getSliderPrecision(min, max, step);
  const clamped = clampSliderValue(value, min, max);
  const steps = Math.round((clamped - min) / step);
  const snapped = steps * step + min;

  return parseFloat(clampSliderValue(snapped, min, max).toFixed(precision));
}

/**
 * Converts a 0–100 track percentage into a snapped value.
 */
export function percentToValue(
  percent: number,
  min: number,
  max: number,
  step: number,
) {
  const clampedPercent = clampSliderValue(percent, 0, 100);
  const raw = min + (clampedPercent / 100) * (max - min);

  return snapSliderValue(raw, min, max, step);
}

/**
 * Steps `value` by one `step` in `direction`, clamped to bounds.
 */
export function stepSliderValue(
  value: number,
  direction: 1 | -1,
  min: number,
  max: number,
  step: number,
) {
  return snapSliderValue(value + direction * step, min, max, step);
}

/**
 * Sorts a range pair so `[0]` is the lower bound.
 */
export function sortSliderRangeValue(
  first: number,
  second: number,
): SliderRangeValue {
  return first <= second ? [first, second] : [second, first];
}

/**
 * Writes `next` into a range pair at `thumbIndex`, then sorts so `[0]` is lower.
 * Returns the sorted pair and the index that now holds `next` (for drag/focus follow).
 */
export function writeSliderRangeThumb(
  value: SliderRangeValue,
  thumbIndex: 0 | 1,
  next: number,
): { thumbIndex: 0 | 1; value: SliderRangeValue } {
  const other = value[thumbIndex === 0 ? 1 : 0];
  const sorted = sortSliderRangeValue(
    thumbIndex === 0 ? next : other,
    thumbIndex === 1 ? next : other,
  );

  let nextThumbIndex: 0 | 1 = thumbIndex;

  if (next < other) {
    nextThumbIndex = 0;
  } else if (next > other) {
    nextThumbIndex = 1;
  }

  return { value: sorted, thumbIndex: nextThumbIndex };
}

/**
 * Picks the thumb closest to `targetValue` (0 = first, 1 = second).
 */
export function pickClosestSliderThumb(
  targetValue: number,
  first: number,
  second: number,
): 0 | 1 {
  const minValue = Math.min(first, second);
  const maxValue = Math.max(first, second);

  if (Math.abs(minValue - targetValue) < Math.abs(maxValue - targetValue)) {
    return first <= second ? 0 : 1;
  }

  return first >= second ? 0 : 1;
}

/**
 * Builds bar `start` / `width` percentages for single or range values.
 */
export function getSliderBarGeometry({
  max,
  min,
  range,
  value,
}: {
  max: number;
  min: number;
  range: boolean;
  value: number | SliderRangeValue;
}): SliderBarGeometry {
  if (range && isArray(value)) {
    const [low, high] = sortSliderRangeValue(value[0], value[1]);
    const startPercent = valueToPercent(low, min, max);
    const endPercent = valueToPercent(high, min, max);

    return {
      start: `${startPercent}%`,
      width: `${Math.max(0, endPercent - startPercent)}%`,
    };
  }

  const single = isArray(value) ? value[0] : value;

  return {
    start: "0%",
    width: `${valueToPercent(single, min, max)}%`,
  };
}

/**
 * Normalizes stop inputs. When `showStops` is true and no stops are given,
 * generates a stop for every step between `min` and `max` (exclusive).
 */
export function normalizeSliderStops({
  max,
  min,
  step,
  stops,
  showStops = false,
}: {
  max: number;
  min: number;
  showStops?: boolean;
  step: number;
  stops?: null | readonly SliderStopInput[];
}): SliderStop[] {
  if (stops && stops.length > 0) {
    return stops.map((stop) => {
      if (isNumber(stop)) {
        return { value: stop };
      }

      return {
        value: stop.value,
        ...(stop.label !== undefined ? { label: stop.label } : {}),
      };
    });
  }

  if (!showStops) {
    return [];
  }

  return range(min + step, max, step).map((value) => ({
    value: snapSliderValue(value, min, max, step),
  }));
}

/**
 * Whether a stop sits under the filled portion of the bar (hidden marker).
 */
export function isSliderStopCovered({
  max,
  min,
  range,
  value,
  stopValue,
}: {
  max: number;
  min: number;
  range: boolean;
  stopValue: number;
  value: number | SliderRangeValue;
}) {
  if (range && isArray(value)) {
    const [low, high] = sortSliderRangeValue(value[0], value[1]);

    return stopValue >= low && stopValue <= high;
  }

  const single = isArray(value) ? value[0] : value;

  return stopValue <= clampSliderValue(single, min, max);
}

/**
 * Pointer X from a mouse or touch event.
 */
export function getSliderPointerClientX(
  event: MouseEvent | TouchEvent | { clientX: number },
) {
  if ("touches" in event && event.touches.length > 0) {
    return event.touches[0].clientX;
  }

  if ("changedTouches" in event && event.changedTouches.length > 0) {
    return event.changedTouches[0].clientX;
  }

  return "clientX" in event ? event.clientX : 0;
}

/**
 * Converts a pointer position into a 0–100 track percentage.
 */
export function percentFromSliderPointer({
  rect,
  clientX,
  isRtl = false,
}: {
  clientX: number;
  isRtl?: boolean;
  rect: Pick<DOMRect, "left" | "width">;
}) {
  if (rect.width <= 0) {
    return 0;
  }

  const offset = clientX - rect.left;
  const percent = (offset / rect.width) * 100;

  return clampSliderValue(isRtl ? 100 - percent : percent, 0, 100);
}

/**
 * Resolves the uncontrolled default value for single or range mode.
 */
export function resolveSliderDefaultValue({
  max,
  min,
  step,
  range,
  defaultValue,
}: {
  defaultValue?: number | SliderRangeValue;
  max: number;
  min: number;
  range: boolean;
  step: number;
}): number | SliderRangeValue {
  if (range) {
    if (isArray(defaultValue)) {
      return sortSliderRangeValue(
        snapSliderValue(defaultValue[0], min, max, step),
        snapSliderValue(defaultValue[1], min, max, step),
      );
    }

    const single = snapSliderValue(
      isNumber(defaultValue) ? defaultValue : min,
      min,
      max,
      step,
    );

    return [single, single];
  }

  if (isArray(defaultValue)) {
    return snapSliderValue(defaultValue[0], min, max, step);
  }

  return snapSliderValue(
    isNumber(defaultValue) ? defaultValue : min,
    min,
    max,
    step,
  );
}
