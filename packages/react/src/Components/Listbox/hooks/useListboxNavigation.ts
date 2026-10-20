// ** External Imports
import { useCallback, useMemo } from "react";

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
  options: ListboxOption[],
  highlightedIndex: number,
  setHighlightedIndex: (index: number) => void,
  listboxId: string,
) {
  const activeDescendantId = useMemo(() => {
    return getListboxActiveDescendantId(listboxId, highlightedIndex);
  }, [listboxId, highlightedIndex]);

  const resetHighlight = useCallback(() => {
    setHighlightedIndex(findFirstEnabledOptionIndex(options));
  }, [options, setHighlightedIndex]);

  const highlightCurrent = useCallback(
    (isSelected?: (value: ListboxValue) => boolean) => {
      setHighlightedIndex(findSelectedListboxOptionIndex(options, isSelected));
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
    [options, highlightedIndex, setHighlightedIndex],
  );

  const getHighlightedOption = useCallback(() => {
    return options[highlightedIndex];
  }, [options, highlightedIndex]);

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
