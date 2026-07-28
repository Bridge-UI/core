// ** External Imports
import { describe, expect, it } from "vitest";

// ** Local Imports
import {
  countDrawerTransitionLayers,
  getDrawerOverlayTransitionClass,
  getDrawerPanelTransitionClass,
  hasDrawerTransition,
  resolveEffectiveDrawerTransition,
} from "@/Utils/drawer";

describe("hasDrawerTransition", () => {
  it("returns false for none and undefined", () => {
    expect(hasDrawerTransition("none")).toBe(false);
    expect(hasDrawerTransition(undefined)).toBe(false);
  });

  it("returns true for animated tokens", () => {
    expect(hasDrawerTransition("slide")).toBe(true);
    expect(hasDrawerTransition("fade")).toBe(true);
  });
});

describe("countDrawerTransitionLayers", () => {
  it("counts overlay and panel when backdrop is visible", () => {
    expect(countDrawerTransitionLayers("slide")).toBe(2);
  });

  it("counts only panel when backdrop is hidden", () => {
    expect(countDrawerTransitionLayers("slide", { hideBackdrop: true })).toBe(
      1,
    );
  });

  it("returns zero for none", () => {
    expect(countDrawerTransitionLayers("none")).toBe(0);
  });
});

describe("getDrawerPanelTransitionClass", () => {
  it("includes placement slide transforms for slide", () => {
    const left = getDrawerPanelTransitionClass("slide", "left");

    expect(left).toContain("-translate-x-full");
    expect(left).toContain("data-[state=open]:translate-x-0");
  });

  it("does not include placement slide for fade", () => {
    const fade = getDrawerPanelTransitionClass("fade", "left");

    expect(fade).toContain("opacity-0");
    expect(fade).not.toContain("-translate-x-full");
  });
});

describe("getDrawerOverlayTransitionClass", () => {
  it("returns fade classes for slide overlay", () => {
    expect(getDrawerOverlayTransitionClass("slide")).toContain("opacity-0");
  });
});

describe("resolveEffectiveDrawerTransition", () => {
  it("returns none when transition is none", () => {
    expect(resolveEffectiveDrawerTransition("none")).toBe("none");
  });
});
