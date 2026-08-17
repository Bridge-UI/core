// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  applyToggleGroupSelection,
  isToggleGroupItemSelected,
  normalizeToggleGroupValue,
} from "@/Domain/toggleGroup";

describe("normalizeToggleGroupValue", () => {
  test("it should normalize single mode", () => {
    expect(normalizeToggleGroupValue(undefined, false)).toBe("");
    expect(normalizeToggleGroupValue("a", false)).toBe("a");
    expect(normalizeToggleGroupValue(["a", "b"], false)).toBe("a");
  });

  test("it should normalize multiple mode", () => {
    expect(normalizeToggleGroupValue(undefined, true)).toEqual([]);
    expect(normalizeToggleGroupValue("a", true)).toEqual(["a"]);
    expect(normalizeToggleGroupValue(["a", "b"], true)).toEqual(["a", "b"]);
  });
});

describe("isToggleGroupItemSelected", () => {
  test("it should check single and multiple selected state", () => {
    expect(isToggleGroupItemSelected("a", "a", false)).toBe(true);
    expect(isToggleGroupItemSelected("a", "b", false)).toBe(false);
    expect(isToggleGroupItemSelected(["a", "b"], "b", true)).toBe(true);
    expect(isToggleGroupItemSelected(["a"], "b", true)).toBe(false);
  });
});

describe("applyToggleGroupSelection", () => {
  test("it should select in single mode without clearing the active item", () => {
    expect(applyToggleGroupSelection("", "a", false)).toBe("a");
    expect(applyToggleGroupSelection("a", "a", false)).toBe("a");
    expect(applyToggleGroupSelection("a", "b", false)).toBe("b");
  });

  test("it should toggle membership in multiple mode", () => {
    expect(applyToggleGroupSelection([], "a", true)).toEqual(["a"]);
    expect(applyToggleGroupSelection(["a"], "b", true)).toEqual(["a", "b"]);
    expect(applyToggleGroupSelection(["a", "b"], "a", true)).toEqual(["b"]);
  });
});
