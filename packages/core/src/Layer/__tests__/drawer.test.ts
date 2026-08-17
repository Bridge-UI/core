// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  countDrawerTransitionLayers,
  getDrawerOverlayTransitionClass,
  getDrawerPanelTransitionClass,
  hasDrawerTransition,
  resolveEffectiveDrawerTransition,
} from "@/Layer/drawer";

describe("hasDrawerTransition", () => {
  test("it should return false for none and undefined", () => {
    expect(hasDrawerTransition("none")).toBe(false);
    expect(hasDrawerTransition(undefined)).toBe(false);
  });

  test("it should return true for animated tokens", () => {
    expect(hasDrawerTransition("fade")).toBe(true);
    expect(hasDrawerTransition("slide")).toBe(true);
  });
});

describe("countDrawerTransitionLayers", () => {
  test("it should count overlay and panel when backdrop is visible", () => {
    expect(countDrawerTransitionLayers("slide")).toBe(2);
  });

  test("it should count only panel when backdrop is hidden", () => {
    expect(countDrawerTransitionLayers("slide", { hideBackdrop: true })).toBe(
      1,
    );
  });

  test("it should return zero for none", () => {
    expect(countDrawerTransitionLayers("none")).toBe(0);
  });
});

describe("getDrawerPanelTransitionClass", () => {
  test("it should include placement slide transforms for slide", () => {
    const left = getDrawerPanelTransitionClass("slide", "left");

    expect(left).toContain("-translate-x-full");
    expect(left).toContain("data-[state=open]:translate-x-0");
  });

  test("it should not include placement slide for fade", () => {
    const fade = getDrawerPanelTransitionClass("fade", "left");

    expect(fade).toContain("opacity-0");
    expect(fade).not.toContain("-translate-x-full");
  });
});

describe("getDrawerOverlayTransitionClass", () => {
  test("it should return fade classes for slide overlay", () => {
    expect(getDrawerOverlayTransitionClass("slide")).toContain("opacity-0");
  });
});

describe("resolveEffectiveDrawerTransition", () => {
  test("it should return none when transition is none", () => {
    expect(resolveEffectiveDrawerTransition("none")).toBe("none");
  });
});
