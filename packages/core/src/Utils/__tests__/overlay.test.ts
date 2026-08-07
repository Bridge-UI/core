// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  isFieldOverlayDialog,
  resolveFieldOverlay,
  resolveRangePickerOrientation,
} from "@/Utils/overlay";

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

describe("resolveRangePickerOrientation", () => {
  test("it should keep an explicit orientation", () => {
    expect(resolveRangePickerOrientation("horizontal", "drawer", true)).toBe(
      "horizontal",
    );
    expect(resolveRangePickerOrientation("vertical", "menu", false)).toBe(
      "vertical",
    );
  });

  test("it should default to horizontal for menu shells", () => {
    expect(resolveRangePickerOrientation(undefined, "menu", true)).toBe(
      "horizontal",
    );
    expect(resolveRangePickerOrientation(undefined, "menu", false)).toBe(
      "horizontal",
    );
  });

  test("it should use vertical on mobile drawer and modal", () => {
    expect(resolveRangePickerOrientation(undefined, "drawer", true)).toBe(
      "vertical",
    );
    expect(resolveRangePickerOrientation(undefined, "modal", true)).toBe(
      "vertical",
    );
  });

  test("it should keep horizontal on desktop drawer and modal", () => {
    expect(resolveRangePickerOrientation(undefined, "drawer", false)).toBe(
      "horizontal",
    );
    expect(resolveRangePickerOrientation(undefined, "modal", false)).toBe(
      "horizontal",
    );
  });
});

describe("isFieldOverlayDialog", () => {
  test("it should be true for modal and drawer", () => {
    expect(isFieldOverlayDialog("modal")).toBe(true);
    expect(isFieldOverlayDialog("drawer")).toBe(true);
    expect(isFieldOverlayDialog("menu")).toBe(false);
  });
});
