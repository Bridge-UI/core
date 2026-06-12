// ** External Imports
import { useCallback, useMemo } from "react";

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

export function highlightCurrentSelection(
  options: ListboxOption[],
  isSelected?: (value: ListboxValue) => boolean,
) {
  if (isSelected) {
    const selectedIndex = options.findIndex(
      (option) => !option.disabled && isSelected(option.value),
    );

    if (selectedIndex >= 0) {
      return selectedIndex;
    }
  }

  return -1;
}

export function useListboxNavigation(
  options: ListboxOption[],
  highlightedIndex: number,
  setHighlightedIndex: (index: number) => void,
  listboxId: string,
) {
  const activeDescendantId = useMemo(() => {
    return getListboxActiveDescendantId(listboxId, highlightedIndex);
  }, [highlightedIndex, listboxId]);

  const resetHighlight = useCallback(() => {
    setHighlightedIndex(findFirstEnabledOptionIndex(options));
  }, [options, setHighlightedIndex]);

  const highlightCurrent = useCallback(
    (isSelected?: (value: ListboxValue) => boolean) => {
      setHighlightedIndex(highlightCurrentSelection(options, isSelected));
    },
    [options, setHighlightedIndex],
  );

  const highlightFirst = useCallback(() => {
    setHighlightedIndex(findFirstEnabledOptionIndex(options));
  }, [options, setHighlightedIndex]);

  const highlightLast = useCallback(() => {
    setHighlightedIndex(findLastEnabledOptionIndex(options));
  }, [options, setHighlightedIndex]);

  const moveHighlight = useCallback(
    (delta: number) => {
      setHighlightedIndex(
        moveListboxHighlight(options, highlightedIndex, delta),
      );
    },
    [highlightedIndex, options, setHighlightedIndex],
  );

  const getHighlightedOption = useCallback(() => {
    return options[highlightedIndex];
  }, [highlightedIndex, options]);

  return {
    moveHighlight,
    highlightLast,
    resetHighlight,
    highlightFirst,
    highlightCurrent,
    activeDescendantId,
    getHighlightedOption,
  };
}
