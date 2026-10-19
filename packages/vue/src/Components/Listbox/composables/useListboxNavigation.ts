// ** External Imports
import { computed, toValue, type MaybeRefOrGetter, type Ref } from "vue";

// ** Core Imports
import {
  findFirstEnabledOptionIndex,
  findLastEnabledOptionIndex,
  findSelectedListboxOptionIndex,
  getListboxActiveDescendantId,
  moveListboxHighlight,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import type {
  ListboxOption,
  ListboxValue,
} from "@/Components/Listbox/listbox.types";

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
    highlightedIndex.value = findSelectedListboxOptionIndex(
      toValue(options),
      isSelected,
    );
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
