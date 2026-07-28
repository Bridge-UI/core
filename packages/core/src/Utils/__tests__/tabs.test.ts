// ** External Imports
import { describe, expect, it } from "vitest";

// ** Local Imports
import { getAdjacentTabValue, getTabId, getTabPanelId } from "@/Utils/tabs";

describe("getTabId", () => {
  it("builds a stable tab id", () => {
    expect(getTabId("tabs-1", "bun")).toBe("tabs-1-tab-bun");
  });
});

describe("getTabPanelId", () => {
  it("builds a stable panel id", () => {
    expect(getTabPanelId("tabs-1", "bun")).toBe("tabs-1-panel-bun");
  });
});

describe("getAdjacentTabValue", () => {
  it("moves forward and wraps", () => {
    expect(getAdjacentTabValue(["a", "b", "c"], "a", 1)).toBe("b");
    expect(getAdjacentTabValue(["a", "b", "c"], "c", 1)).toBe("a");
  });

  it("moves backward and wraps", () => {
    expect(getAdjacentTabValue(["a", "b", "c"], "a", -1)).toBe("c");
  });

  it("skips disabled values", () => {
    expect(getAdjacentTabValue(["a", "b", "c"], "a", 1, new Set(["b"]))).toBe(
      "c",
    );
  });

  it("returns current when empty", () => {
    expect(getAdjacentTabValue([], "a", 1)).toBe("a");
  });
});
