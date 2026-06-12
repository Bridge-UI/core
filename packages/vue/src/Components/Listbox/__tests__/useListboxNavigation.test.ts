// ** External Imports
import { expect, test } from "vitest";
import { ref } from "vue";

// ** Local Imports
import {
  findFirstEnabledOptionIndex,
  findLastEnabledOptionIndex,
  getListboxActiveDescendantId,
  moveListboxHighlight,
  useListboxNavigation,
} from "@/Components/Listbox/composables/useListboxNavigation";
import type { ListboxOption } from "@/Components/Listbox/listbox.types";

const options: ListboxOption[] = [
  { value: 1, label: "One", disabled: true },
  { value: 2, label: "Two" },
  { value: 3, label: "Three" },
];

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

test("it should update highlight through the composable", () => {
  const highlightedIndex = ref(1);
  const navigation = useListboxNavigation(
    () => options,
    highlightedIndex,
    "status-list",
  );

  navigation.moveHighlight(1);

  expect(highlightedIndex.value).toBe(2);
  expect(navigation.activeDescendantId.value).toBe("status-list-option-2");
});

test("it should highlight current selection when present", () => {
  const highlightedIndex = ref(-1);
  const navigation = useListboxNavigation(
    () => options,
    highlightedIndex,
    "status-list",
  );

  navigation.highlightCurrentSelection((value) => value === 3);

  expect(highlightedIndex.value).toBe(2);
});

test("it should reset highlight to the first enabled option", () => {
  const highlightedIndex = ref(-1);
  const navigation = useListboxNavigation(
    () => options,
    highlightedIndex,
    "status-list",
  );

  navigation.resetHighlight();

  expect(highlightedIndex.value).toBe(1);
});
