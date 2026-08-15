// ** External Imports
import { describe, expect, it } from "vitest";

// ** Local Imports
import {
  applyToggleGroupSelection,
  isToggleGroupItemSelected,
  normalizeToggleGroupValue,
} from "@/Domain/toggleGroup";

describe("normalizeToggleGroupValue", () => {
  it("normalizes single mode", () => {
    expect(normalizeToggleGroupValue(undefined, false)).toBe("");
    expect(normalizeToggleGroupValue("a", false)).toBe("a");
    expect(normalizeToggleGroupValue(["a", "b"], false)).toBe("a");
  });

  it("normalizes multiple mode", () => {
    expect(normalizeToggleGroupValue(undefined, true)).toEqual([]);
    expect(normalizeToggleGroupValue("a", true)).toEqual(["a"]);
    expect(normalizeToggleGroupValue(["a", "b"], true)).toEqual(["a", "b"]);
  });
});

describe("isToggleGroupItemSelected", () => {
  it("checks single and multiple selected state", () => {
    expect(isToggleGroupItemSelected("a", "a", false)).toBe(true);
    expect(isToggleGroupItemSelected("a", "b", false)).toBe(false);
    expect(isToggleGroupItemSelected(["a", "b"], "b", true)).toBe(true);
    expect(isToggleGroupItemSelected(["a"], "b", true)).toBe(false);
  });
});

describe("applyToggleGroupSelection", () => {
  it("selects in single mode without clearing the active item", () => {
    expect(applyToggleGroupSelection("", "a", false)).toBe("a");
    expect(applyToggleGroupSelection("a", "a", false)).toBe("a");
    expect(applyToggleGroupSelection("a", "b", false)).toBe("b");
  });

  it("toggles membership in multiple mode", () => {
    expect(applyToggleGroupSelection([], "a", true)).toEqual(["a"]);
    expect(applyToggleGroupSelection(["a"], "b", true)).toEqual(["a", "b"]);
    expect(applyToggleGroupSelection(["a", "b"], "a", true)).toEqual(["b"]);
  });
});
