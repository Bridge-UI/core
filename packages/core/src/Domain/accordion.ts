// ** External Imports
import {
  castArray,
  head,
  includes,
  isArray,
  isEmpty,
  without,
} from "es-toolkit/compat";

// ** Local Imports
import { getAdjacentTabValue } from "@/Domain/tabs";

/**
 * Controlled / uncontrolled expanded value for accordion.
 * Scalar when `multiple` is false; array when true.
 */
export type AccordionValue = string | string[];

/**
 * Stable DOM id for an accordion trigger button.
 */
export function getAccordionTriggerId(
  accordionId: string,
  value: string,
): string {
  return `${accordionId}-trigger-${value}`;
}

/**
 * Stable DOM id for an accordion panel region.
 */
export function getAccordionPanelId(
  accordionId: string,
  value: string,
): string {
  return `${accordionId}-panel-${value}`;
}

/**
 * Normalizes `value` to a scalar or array matching `multiple`.
 */
export function normalizeAccordionValue(
  value: undefined | AccordionValue,
  multiple: boolean,
): AccordionValue {
  if (multiple) {
    return isEmpty(value) ? [] : castArray(value);
  }

  if (isArray(value)) {
    return head(value) ?? "";
  }

  return value ?? "";
}

/**
 * Whether `itemValue` is currently expanded given the accordion value shape.
 */
export function isAccordionItemExpanded(
  expanded: undefined | AccordionValue,
  itemValue: string,
  multiple: boolean,
): boolean {
  const normalized = normalizeAccordionValue(expanded, multiple);

  if (multiple && isArray(normalized)) {
    return includes(normalized, itemValue);
  }

  return normalized === itemValue;
}

/**
 * Toggles `itemValue` in the accordion expanded state.
 * Single mode closes when the open item is toggled again.
 */
export function toggleAccordionItem(
  expanded: undefined | AccordionValue,
  itemValue: string,
  multiple: boolean,
): AccordionValue {
  const normalized = normalizeAccordionValue(expanded, multiple);

  if (multiple && isArray(normalized)) {
    return includes(normalized, itemValue)
      ? without(normalized, itemValue)
      : [...normalized, itemValue];
  }

  return normalized === itemValue ? "" : itemValue;
}

/**
 * Returns the next enabled accordion item value from `current`, wrapping around.
 * Skips values present in `disabledValues`. When none are enabled, returns `current`.
 */
export function getAdjacentAccordionValue(
  values: readonly string[],
  current: string,
  direction: 1 | -1,
  disabledValues: ReadonlySet<string> = new Set(),
): string {
  return getAdjacentTabValue(values, current, direction, disabledValues);
}
