// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { resolveFieldOverlay } from "@/Utils/overlay";

describe("resolveFieldOverlay", () => {
  test("it should default to menu when mode is undefined", () => {
    expect(resolveFieldOverlay(undefined, false)).toBe("menu");
    expect(resolveFieldOverlay(undefined, true)).toBe("menu");
  });

  test("it should keep menu when mode is menu", () => {
    expect(resolveFieldOverlay("menu", false)).toBe("menu");
    expect(resolveFieldOverlay("menu", true)).toBe("menu");
  });

  test("it should keep modal when mode is modal", () => {
    expect(resolveFieldOverlay("modal", false)).toBe("modal");
    expect(resolveFieldOverlay("modal", true)).toBe("modal");
  });

  test("it should keep drawer when mode is drawer", () => {
    expect(resolveFieldOverlay("drawer", false)).toBe("drawer");
    expect(resolveFieldOverlay("drawer", true)).toBe("drawer");
  });

  test("it should resolve auto to menu on desktop", () => {
    expect(resolveFieldOverlay("auto", false)).toBe("menu");
  });

  test("it should resolve auto to drawer on mobile", () => {
    expect(resolveFieldOverlay("auto", true)).toBe("drawer");
  });
});
