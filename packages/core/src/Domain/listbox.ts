// ** Local Imports
import type { ListboxOption, ListboxValue } from "@/Domain/select";

/**
 * Index of the first option that is not disabled, or `-1`.
 */
export function findFirstEnabledOptionIndex(options: ListboxOption[]) {
  return options.findIndex((option) => !option.disabled);
}

/**
 * Index of the last option that is not disabled, or `-1`.
 */
export function findLastEnabledOptionIndex(options: ListboxOption[]) {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

/**
 * Moves the highlight by `delta`, wrapping around and skipping disabled
 * options. With no highlight, `delta > 0` starts at the first enabled option
 * and `delta < 0` at the last one. Returns `-1` when nothing is enabled.
 */
export function moveListboxHighlight(
  options: ListboxOption[],
  currentIndex: number,
  delta: number,
) {
  if (!options.length) {
    return -1;
  }

  if (currentIndex < 0) {
    return delta > 0
      ? findFirstEnabledOptionIndex(options)
      : findLastEnabledOptionIndex(options);
  }

  let index = currentIndex;

  for (let step = 0; step < options.length; step += 1) {
    index = (index + delta + options.length) % options.length;

    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

/**
 * Index of the first enabled option that `isSelected` accepts, or `-1`.
 */
export function findSelectedListboxOptionIndex(
  options: ListboxOption[],
  isSelected?: (value: ListboxValue) => boolean,
) {
  if (!isSelected) {
    return -1;
  }

  return options.findIndex(
    (option) => !option.disabled && isSelected(option.value),
  );
}

/**
 * DOM id of the option at `index` inside listbox `listboxId`.
 */
export function getListboxOptionId(listboxId: string, index: number) {
  return `${listboxId}-option-${index}`;
}

/**
 * `aria-activedescendant` for the highlighted option, or `undefined` when
 * nothing is highlighted.
 */
export function getListboxActiveDescendantId(
  listboxId: string,
  highlightedIndex: number,
) {
  if (highlightedIndex < 0) {
    return undefined;
  }

  return getListboxOptionId(listboxId, highlightedIndex);
}
