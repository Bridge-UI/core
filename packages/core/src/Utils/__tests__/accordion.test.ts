// ** External Imports
import { describe, expect, it } from "vitest";

// ** Local Imports
import {
  getAccordionPanelId,
  getAccordionTriggerId,
  getAdjacentAccordionValue,
  isAccordionItemExpanded,
  normalizeAccordionValue,
  toggleAccordionItem,
} from "@/Utils/accordion";

describe("getAccordionTriggerId", () => {
  it("builds a stable trigger id", () => {
    expect(getAccordionTriggerId("acc-1", "shipping")).toBe(
      "acc-1-trigger-shipping",
    );
  });
});

describe("getAccordionPanelId", () => {
  it("builds a stable panel id", () => {
    expect(getAccordionPanelId("acc-1", "shipping")).toBe(
      "acc-1-panel-shipping",
    );
  });
});

describe("normalizeAccordionValue", () => {
  it("normalizes single mode", () => {
    expect(normalizeAccordionValue(undefined, false)).toBe("");
    expect(normalizeAccordionValue("a", false)).toBe("a");
    expect(normalizeAccordionValue(["a", "b"], false)).toBe("a");
  });

  it("normalizes multiple mode", () => {
    expect(normalizeAccordionValue(undefined, true)).toEqual([]);
    expect(normalizeAccordionValue("a", true)).toEqual(["a"]);
    expect(normalizeAccordionValue(["a", "b"], true)).toEqual(["a", "b"]);
  });
});

describe("isAccordionItemExpanded", () => {
  it("checks single and multiple expanded state", () => {
    expect(isAccordionItemExpanded("a", "a", false)).toBe(true);
    expect(isAccordionItemExpanded("a", "b", false)).toBe(false);
    expect(isAccordionItemExpanded(["a", "b"], "b", true)).toBe(true);
    expect(isAccordionItemExpanded(["a"], "b", true)).toBe(false);
  });
});

describe("toggleAccordionItem", () => {
  it("toggles single mode open and closed", () => {
    expect(toggleAccordionItem("", "a", false)).toBe("a");
    expect(toggleAccordionItem("a", "a", false)).toBe("");
    expect(toggleAccordionItem("a", "b", false)).toBe("b");
  });

  it("toggles multiple mode membership", () => {
    expect(toggleAccordionItem([], "a", true)).toEqual(["a"]);
    expect(toggleAccordionItem(["a"], "b", true)).toEqual(["a", "b"]);
    expect(toggleAccordionItem(["a", "b"], "a", true)).toEqual(["b"]);
  });
});

describe("getAdjacentAccordionValue", () => {
  it("moves forward and skips disabled values", () => {
    expect(getAdjacentAccordionValue(["a", "b", "c"], "a", 1)).toBe("b");
    expect(
      getAdjacentAccordionValue(["a", "b", "c"], "a", 1, new Set(["b"])),
    ).toBe("c");
  });
});
