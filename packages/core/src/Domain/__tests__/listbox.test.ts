// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  findFirstEnabledOptionIndex,
  findLastEnabledOptionIndex,
  findSelectedListboxOptionIndex,
  getListboxActiveDescendantId,
  getListboxOptionId,
  moveListboxHighlight,
} from "@/Domain/listbox";
import type { ListboxOption } from "@/Domain/select";

const options: ListboxOption[] = [
  { value: "a", label: "A", disabled: true },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
  { value: "d", label: "D", disabled: true },
];

describe("findFirstEnabledOptionIndex / findLastEnabledOptionIndex", () => {
  test("it should skip disabled options", () => {
    expect(findFirstEnabledOptionIndex(options)).toBe(1);
    expect(findLastEnabledOptionIndex(options)).toBe(2);
  });

  test("it should return -1 when nothing is enabled", () => {
    const disabled = [{ value: "a", label: "A", disabled: true }];

    expect(findFirstEnabledOptionIndex(disabled)).toBe(-1);
    expect(findLastEnabledOptionIndex(disabled)).toBe(-1);
  });
});

describe("moveListboxHighlight", () => {
  test("it should start at the edges without a highlight", () => {
    expect(moveListboxHighlight(options, -1, 1)).toBe(1);
    expect(moveListboxHighlight(options, -1, -1)).toBe(2);
  });

  test("it should wrap and skip disabled options", () => {
    expect(moveListboxHighlight(options, 2, 1)).toBe(1);
    expect(moveListboxHighlight(options, 1, -1)).toBe(2);
  });

  test("it should return -1 for empty options", () => {
    expect(moveListboxHighlight([], 0, 1)).toBe(-1);
  });
});

describe("findSelectedListboxOptionIndex", () => {
  test("it should find the first enabled selected option", () => {
    expect(
      findSelectedListboxOptionIndex(options, (value) =>
        ["a", "c"].includes(String(value)),
      ),
    ).toBe(2);
  });

  test("it should return -1 without a predicate", () => {
    expect(findSelectedListboxOptionIndex(options)).toBe(-1);
  });
});

describe("getListboxOptionId / getListboxActiveDescendantId", () => {
  test("it should build option ids", () => {
    expect(getListboxOptionId("list", 2)).toBe("list-option-2");
    expect(getListboxActiveDescendantId("list", 2)).toBe("list-option-2");
  });

  test("it should return undefined without a highlight", () => {
    expect(getListboxActiveDescendantId("list", -1)).toBeUndefined();
  });
});
