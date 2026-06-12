// ** External Imports
import { act, renderHook } from "@testing-library/react";
import { useState } from "react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  findFirstEnabledOptionIndex,
  findLastEnabledOptionIndex,
  getListboxActiveDescendantId,
  moveListboxHighlight,
  useListboxNavigation,
} from "@/Components/Listbox/hooks/useListboxNavigation";
import type { ListboxOption } from "@/Components/Listbox/listbox.types";

const options: ListboxOption[] = [
  { value: 1, label: "One", disabled: true },
  { value: 2, label: "Two" },
  { value: 3, label: "Three" },
];

function renderUseListboxNavigation(
  initialIndex = -1,
  listboxId = "status-list",
) {
  return renderHook(() => {
    const [highlightedIndex, setHighlightedIndex] = useState(initialIndex);
    const navigation = useListboxNavigation(
      options,
      highlightedIndex,
      setHighlightedIndex,
      listboxId,
    );

    return { navigation, highlightedIndex };
  });
}

test("it should find the first and last enabled option indexes", () => {
  expect(findFirstEnabledOptionIndex(options)).toBe(1);
  expect(findLastEnabledOptionIndex(options)).toBe(2);
});

test("it should skip disabled options when moving highlight", () => {
  expect(moveListboxHighlight(options, 1, -1)).toBe(2);
  expect(moveListboxHighlight(options, 2, 1)).toBe(1);
});

test("it should expose the active descendant id", () => {
  expect(getListboxActiveDescendantId("status-list", 1)).toBe(
    "status-list-option-1",
  );
});

test("it should update highlight through the hook", () => {
  const { result } = renderUseListboxNavigation(1);

  act(() => {
    result.current.navigation.moveHighlight(1);
  });

  expect(result.current.highlightedIndex).toBe(2);
  expect(result.current.navigation.activeDescendantId).toBe(
    "status-list-option-2",
  );
});

test("it should highlight current selection when present", () => {
  const { result } = renderUseListboxNavigation(-1);

  act(() => {
    result.current.navigation.highlightCurrent((value) => value === 3);
  });

  expect(result.current.highlightedIndex).toBe(2);
});

test("it should reset highlight to the first enabled option", () => {
  const { result } = renderUseListboxNavigation(-1);

  act(() => {
    result.current.navigation.resetHighlight();
  });

  expect(result.current.highlightedIndex).toBe(1);
});
