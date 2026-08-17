// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  getAccordionPanelId,
  getAccordionTriggerId,
  getAdjacentAccordionValue,
  isAccordionItemExpanded,
  normalizeAccordionValue,
  toggleAccordionItem,
} from "@/Domain/accordion";

describe("getAccordionTriggerId", () => {
  test("it should build a stable trigger id", () => {
    expect(getAccordionTriggerId("acc-1", "shipping")).toBe(
      "acc-1-trigger-shipping",
    );
  });
});

describe("getAccordionPanelId", () => {
  test("it should build a stable panel id", () => {
    expect(getAccordionPanelId("acc-1", "shipping")).toBe(
      "acc-1-panel-shipping",
    );
  });
});

describe("normalizeAccordionValue", () => {
  test("it should normalize single mode", () => {
    expect(normalizeAccordionValue(undefined, false)).toBe("");
    expect(normalizeAccordionValue("a", false)).toBe("a");
    expect(normalizeAccordionValue(["a", "b"], false)).toBe("a");
  });

  test("it should normalize multiple mode", () => {
    expect(normalizeAccordionValue(undefined, true)).toEqual([]);
    expect(normalizeAccordionValue("a", true)).toEqual(["a"]);
    expect(normalizeAccordionValue(["a", "b"], true)).toEqual(["a", "b"]);
  });
});

describe("isAccordionItemExpanded", () => {
  test("it should check single and multiple expanded state", () => {
    expect(isAccordionItemExpanded("a", "a", false)).toBe(true);
    expect(isAccordionItemExpanded("a", "b", false)).toBe(false);
    expect(isAccordionItemExpanded(["a", "b"], "b", true)).toBe(true);
    expect(isAccordionItemExpanded(["a"], "b", true)).toBe(false);
  });
});

describe("toggleAccordionItem", () => {
  test("it should toggle single mode open and closed", () => {
    expect(toggleAccordionItem("", "a", false)).toBe("a");
    expect(toggleAccordionItem("a", "a", false)).toBe("");
    expect(toggleAccordionItem("a", "b", false)).toBe("b");
  });

  test("it should toggle multiple mode membership", () => {
    expect(toggleAccordionItem([], "a", true)).toEqual(["a"]);
    expect(toggleAccordionItem(["a"], "b", true)).toEqual(["a", "b"]);
    expect(toggleAccordionItem(["a", "b"], "a", true)).toEqual(["b"]);
  });
});

describe("getAdjacentAccordionValue", () => {
  test("it should move forward and skip disabled values", () => {
    expect(getAdjacentAccordionValue(["a", "b", "c"], "a", 1)).toBe("b");
    expect(
      getAdjacentAccordionValue(["a", "b", "c"], "a", 1, new Set(["b"])),
    ).toBe("c");
  });
});
