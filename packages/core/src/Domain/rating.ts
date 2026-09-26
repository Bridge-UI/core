// ** External Imports
import { clamp, isNil, range } from "es-toolkit/compat";

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
 * Selects `item`, or clears the rating when `item` is already selected.
 */
export function resolveRatingSelection(
  current: RatingValue,
  item: number,
): RatingValue {
  if (current === item) {
    return null;
  }

  return item;
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
 * Horizontal arrows follow `direction`. A step to 0 or below clears the value.
 * Home selects 1. End selects `max`.
 */
export function getRatingValueFromKey({
  key,
  max,
  value,
  direction = "ltr",
}: {
  direction?: RatingDirection;
  key: string;
  max: number;
  value: RatingValue;
}): undefined | RatingValue {
  const increaseKeys =
    direction === "rtl" ? ["ArrowLeft", "ArrowUp"] : ["ArrowRight", "ArrowUp"];

  const decreaseKeys =
    direction === "rtl"
      ? ["ArrowRight", "ArrowDown"]
      : ["ArrowLeft", "ArrowDown"];

  if (key === "Home") {
    return 1;
  }

  if (key === "End") {
    return max;
  }

  if (increaseKeys.includes(key)) {
    if (isNil(value)) {
      return 1;
    }

    return Math.min(max, value + 1);
  }

  if (decreaseKeys.includes(key)) {
    if (isNil(value) || value <= 1) {
      return null;
    }

    return value - 1;
  }

  return undefined;
}
