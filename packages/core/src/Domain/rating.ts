// ** External Imports
import { ceil, clamp, isNil, range, round } from "es-toolkit/compat";

/** Default number of rating items. */
export const DEFAULT_RATING_MAX = 5;

/**
 * Selected rating. `null` means no selection.
 */
export type RatingValue = null | number;

/**
 * Layout direction used to map horizontal arrow keys.
 */
export type RatingDirection = "ltr" | "rtl";

/**
 * Normalizes `step` to a positive finite number. Invalid values become 1.
 */
export function normalizeRatingStep(step?: number): number {
  if (isNil(step) || !Number.isFinite(step) || step <= 0) {
    return 1;
  }

  return step;
}

/**
 * Normalizes `max` to an integer of at least 1.
 */
export function normalizeRatingMax(max?: number): number {
  if (isNil(max) || !Number.isFinite(max)) {
    return DEFAULT_RATING_MAX;
  }

  return Math.max(1, Math.floor(max));
}

/**
 * Clamps a rating to `null` or a number from above 0 through `max`.
 * Fractional values are kept. Non-positive values become `null`.
 */
export function clampRatingValue(
  value: null | number | undefined,
  max: number,
): RatingValue {
  if (isNil(value) || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return Math.min(max, value);
}

/**
 * Item values from 1 through `max`.
 */
export function getRatingItems(max: number): number[] {
  return range(1, max + 1);
}

/**
 * Fill ratio of `item` for `value`, from 0 (empty) to 1 (full).
 * `1.5` fills item 1 completely and item 2 halfway.
 */
export function getRatingItemFill(item: number, value: RatingValue): number {
  if (isNil(value)) {
    return 0;
  }

  return clamp(value - (item - 1), 0, 1);
}

/**
 * Whether `item` is completely filled for the displayed value.
 * A partial icon is {@link getRatingItemFill} between 0 and 1.
 */
export function isRatingItemFilled(item: number, value: RatingValue): boolean {
  return getRatingItemFill(item, value) === 1;
}

/**
 * Item that represents `value` for tab order and `aria-checked`.
 * `null` when the rating is empty. A fraction selects the partial item
 * (`1.5` selects item 2).
 */
export function getRatingCurrentItem(value: RatingValue): null | number {
  if (isNil(value)) {
    return null;
  }

  return Math.ceil(value);
}

/**
 * Value under a pointer on `item`.
 * `ratio` is 0 at the inline start of the item and 1 at the inline end.
 * `step` of 1 selects the whole item. `0.5` selects the first half, then the rest.
 */
export function getRatingValueFromPointer({
  item,
  step,
  ratio,
}: {
  item: number;
  ratio: number;
  step?: number;
}): number {
  const safeStep = normalizeRatingStep(step);

  if (safeStep >= 1) {
    return item;
  }

  const span = clamp(Number.isFinite(ratio) ? ratio : 1, 0, 1);
  const position = span === 0 ? safeStep : span;
  const steps = Math.max(
    1,
    ceil(round(position / safeStep, decimalPlaces(safeStep))),
  );
  const fill = clamp(round(steps * safeStep, decimalPlaces(safeStep)), 0, 1);

  return roundRating(item - 1 + fill, safeStep);
}

/**
 * Selects `next`, or clears the rating when `next` is already selected.
 */
export function resolveRatingSelection(
  current: RatingValue,
  next: number,
): RatingValue {
  if (!isNil(current) && current === next) {
    return null;
  }

  return next;
}

/**
 * Tab index for a rating item. The committed value stays in the tab order;
 * an empty rating keeps the first item tabbable.
 */
export function getRatingTabIndex(item: number, value: RatingValue): 0 | -1 {
  const current = getRatingCurrentItem(value) ?? 1;

  return item === current ? 0 : -1;
}

/**
 * Next rating for a keyboard key.
 * Returns `undefined` when the key is not handled.
 * Horizontal arrows follow `direction` and move by `step`.
 * A move at or below the first step clears the value.
 * Home selects the first step. End selects `max`.
 */
export function getRatingValueFromKey({
  key,
  max,
  step,
  value,
  direction = "ltr",
}: {
  direction?: RatingDirection;
  key: string;
  max: number;
  step?: number;
  value: RatingValue;
}): undefined | RatingValue {
  const increaseKeys =
    direction === "rtl" ? ["ArrowLeft", "ArrowUp"] : ["ArrowRight", "ArrowUp"];

  const decreaseKeys =
    direction === "rtl"
      ? ["ArrowRight", "ArrowDown"]
      : ["ArrowLeft", "ArrowDown"];

  const safeStep = normalizeRatingStep(step);

  if (key === "Home") {
    return Math.min(max, safeStep);
  }

  if (key === "End") {
    return max;
  }

  if (increaseKeys.includes(key)) {
    if (isNil(value)) {
      return Math.min(max, safeStep);
    }

    return Math.min(max, roundRating(value + safeStep, value, safeStep));
  }

  if (decreaseKeys.includes(key)) {
    if (isNil(value)) {
      return null;
    }

    const next = roundRating(value - safeStep, value, safeStep);

    return next <= 0 ? null : next;
  }

  return undefined;
}

/**
 * Decimal places of `value`, from its base-10 text.
 */
function decimalPlaces(value: number): number {
  const decimal = `${value}`.split(".")[1];

  return decimal ? decimal.length : 0;
}

/**
 * Rounds `value` to the decimal places of `sources`.
 * `1.5 + 1` stays `2.5`.
 */
function roundRating(value: number, ...sources: number[]): number {
  const precision = Math.max(0, ...sources.map(decimalPlaces));

  return round(value, precision);
}
