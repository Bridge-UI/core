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
  if (max == null || !Number.isFinite(max)) {
    return DEFAULT_RATING_MAX;
  }

  return Math.max(1, Math.floor(max));
}

/**
 * Clamps a rating to `null` or an integer from 1 through `max`.
 * Non-integers are rounded. Values below 1 become `null`.
 */
export function clampRatingValue(
  value: null | number | undefined,
  max: number,
): RatingValue {
  if (value == null || !Number.isFinite(value)) {
    return null;
  }

  const rounded = Math.round(value);

  if (rounded < 1) {
    return null;
  }

  if (rounded > max) {
    return max;
  }

  return rounded;
}

/**
 * Item values from 1 through `max`.
 */
export function getRatingItems(max: number): number[] {
  return Array.from({ length: max }, (_, index) => {
    return index + 1;
  });
}

/**
 * Whether `item` is filled for the displayed value (committed or preview).
 */
export function isRatingItemFilled(item: number, value: RatingValue): boolean {
  return value != null && item <= value;
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
  const current = value ?? 1;

  return item === current ? 0 : -1;
}

/**
 * Next rating for a keyboard key.
 * Returns `undefined` when the key is not handled.
 * Horizontal arrows follow `direction`. Moving below 1 clears the value.
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
    if (value == null) {
      return 1;
    }

    return Math.min(max, value + 1);
  }

  if (decreaseKeys.includes(key)) {
    if (value == null || value <= 1) {
      return null;
    }

    return value - 1;
  }

  return undefined;
}
