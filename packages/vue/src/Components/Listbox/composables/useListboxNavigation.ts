// ** External Imports
import { computed, toValue, type MaybeRefOrGetter, type Ref } from "vue";

// ** Local Imports
import type {
  ListboxOption,
  ListboxValue,
} from "@/Components/Listbox/listbox.types";

export function findFirstEnabledOptionIndex(options: ListboxOption[]) {
  return options.findIndex((option) => !option.disabled);
}

export function findLastEnabledOptionIndex(options: ListboxOption[]) {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

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

export function getListboxOptionId(listboxId: string, index: number) {
  return `${listboxId}-option-${index}`;
}

export function getListboxActiveDescendantId(
  listboxId: string,
  highlightedIndex: number,
) {
  if (highlightedIndex < 0) {
    return undefined;
  }

  return getListboxOptionId(listboxId, highlightedIndex);
}

export function useListboxNavigation(
  options: MaybeRefOrGetter<ListboxOption[]>,
  highlightedIndex: Ref<number>,
  listboxId: MaybeRefOrGetter<string>,
) {
  const activeDescendantId = computed(() => {
    return getListboxActiveDescendantId(
      toValue(listboxId),
      highlightedIndex.value,
    );
  });

  function resetHighlight() {
    highlightedIndex.value = findFirstEnabledOptionIndex(toValue(options));
  }

  function highlightCurrentSelection(
    isSelected?: (value: ListboxValue) => boolean,
  ) {
    const resolvedOptions = toValue(options);

    if (isSelected) {
      const selectedIndex = resolvedOptions.findIndex(
        (option) => !option.disabled && isSelected(option.value),
      );

      if (selectedIndex >= 0) {
        highlightedIndex.value = selectedIndex;

        return;
      }
    }

    highlightedIndex.value = -1;
  }

  function highlightFirst() {
    highlightedIndex.value = findFirstEnabledOptionIndex(toValue(options));
  }

  function highlightLast() {
    highlightedIndex.value = findLastEnabledOptionIndex(toValue(options));
  }

  function moveHighlight(delta: number) {
    highlightedIndex.value = moveListboxHighlight(
      toValue(options),
      highlightedIndex.value,
      delta,
    );
  }

  function getHighlightedOption() {
    return toValue(options)[highlightedIndex.value];
  }

  return {
    moveHighlight,
    highlightLast,
    resetHighlight,
    highlightFirst,
    activeDescendantId,
    getHighlightedOption,
    highlightCurrentSelection,
  };
}
