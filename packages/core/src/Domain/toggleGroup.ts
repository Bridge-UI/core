// ** External Imports
import {
  castArray,
  head,
  includes,
  isArray,
  isEmpty,
  without,
} from "es-toolkit/compat";

/**
 * Controlled / uncontrolled selected value for a toggle group.
 * Scalar when `multiple` is false; array when true.
 */
export type ToggleGroupValue = string | string[];

/**
 * Normalizes `value` to a scalar or array matching `multiple`.
 */
export function normalizeToggleGroupValue(
  value: undefined | ToggleGroupValue,
  multiple: boolean,
): ToggleGroupValue {
  if (multiple) {
    return isEmpty(value) ? [] : castArray(value);
  }

  if (isArray(value)) {
    return head(value) ?? "";
  }

  return value ?? "";
}

/**
 * Whether `itemValue` is currently selected given the toggle group value shape.
 */
export function isToggleGroupItemSelected(
  selected: undefined | ToggleGroupValue,
  itemValue: string,
  multiple: boolean,
): boolean {
  const normalized = normalizeToggleGroupValue(selected, multiple);

  if (multiple && isArray(normalized)) {
    return includes(normalized, itemValue);
  }

  return normalized === itemValue;
}

/**
 * Applies a segment press to the toggle group value.
 * Exclusive mode always selects `itemValue` (radio behavior).
 * Multiple mode toggles membership in the array.
 */
export function applyToggleGroupSelection(
  selected: undefined | ToggleGroupValue,
  itemValue: string,
  multiple: boolean,
): ToggleGroupValue {
  const normalized = normalizeToggleGroupValue(selected, multiple);

  if (multiple && isArray(normalized)) {
    return includes(normalized, itemValue)
      ? without(normalized, itemValue)
      : [...normalized, itemValue];
  }

  return itemValue;
}
