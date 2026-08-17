// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { getAdjacentTabValue, getTabId, getTabPanelId } from "@/Domain/tabs";

describe("getTabId", () => {
  test("it should build a stable tab id", () => {
    expect(getTabId("tabs-1", "bun")).toBe("tabs-1-tab-bun");
  });
});

describe("getTabPanelId", () => {
  test("it should build a stable panel id", () => {
    expect(getTabPanelId("tabs-1", "bun")).toBe("tabs-1-panel-bun");
  });
});

describe("getAdjacentTabValue", () => {
  test("it should move forward and wrap", () => {
    expect(getAdjacentTabValue(["a", "b", "c"], "a", 1)).toBe("b");
    expect(getAdjacentTabValue(["a", "b", "c"], "c", 1)).toBe("a");
  });

  test("it should move backward and wrap", () => {
    expect(getAdjacentTabValue(["a", "b", "c"], "a", -1)).toBe("c");
  });

  test("it should skip disabled values", () => {
    expect(getAdjacentTabValue(["a", "b", "c"], "a", 1, new Set(["b"]))).toBe(
      "c",
    );
  });

  test("it should return current when empty", () => {
    expect(getAdjacentTabValue([], "a", 1)).toBe("a");
  });
});
