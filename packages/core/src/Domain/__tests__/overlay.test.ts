// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  getFieldOverlayControlSize,
  isFieldOverlayDialog,
  resolveFieldOverlay,
  resolveFieldPickerClassName,
  resolveFieldShowFooter,
  resolvePickerFill,
  resolveRangePickerOrientation,
} from "@/Domain/overlay";

describe("resolveFieldOverlay", () => {
  test("it should default like auto when mode is undefined", () => {
    expect(resolveFieldOverlay(undefined, false)).toBe("menu");
    expect(resolveFieldOverlay(undefined, true)).toBe("drawer");
  });

  test("it should keep menu when mode is menu", () => {
    expect(resolveFieldOverlay("menu", true)).toBe("menu");
    expect(resolveFieldOverlay("menu", false)).toBe("menu");
  });

  test("it should keep modal when mode is modal", () => {
    expect(resolveFieldOverlay("modal", true)).toBe("modal");
    expect(resolveFieldOverlay("modal", false)).toBe("modal");
  });

  test("it should keep drawer when mode is drawer", () => {
    expect(resolveFieldOverlay("drawer", true)).toBe("drawer");
    expect(resolveFieldOverlay("drawer", false)).toBe("drawer");
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
    expect(isFieldOverlayDialog("menu")).toBe(false);
    expect(isFieldOverlayDialog("modal")).toBe(true);
    expect(isFieldOverlayDialog("drawer")).toBe(true);
  });
});

describe("getFieldOverlayControlSize", () => {
  test("it should use md for dialog shells", () => {
    expect(getFieldOverlayControlSize("menu")).toBe("sm");
    expect(getFieldOverlayControlSize("modal")).toBe("md");
    expect(getFieldOverlayControlSize("drawer")).toBe("md");
  });
});

describe("resolvePickerFill", () => {
  test("it should keep an explicit fill", () => {
    expect(resolvePickerFill(true, "menu")).toBe(true);
    expect(resolvePickerFill(false, "drawer")).toBe(false);
  });

  test("it should default to true for drawer when unset", () => {
    expect(resolvePickerFill(undefined, "drawer")).toBe(true);
  });

  test("it should default to false for menu and modal when unset", () => {
    expect(resolvePickerFill(undefined, "menu")).toBe(false);
    expect(resolvePickerFill(undefined, "modal")).toBe(false);
  });

  test("it should default to false without an overlay", () => {
    expect(resolvePickerFill(undefined)).toBe(false);
  });
});

describe("resolveFieldPickerClassName", () => {
  test("it should stretch, drop shadow, and let a filled drawer scroll", () => {
    expect(resolveFieldPickerClassName(true, "drawer")).toBe(
      "w-full shadow-none min-w-max rounded-b-none overflow-visible",
    );
  });

  test("it should drop shadow without stretching in a modal", () => {
    expect(resolveFieldPickerClassName(false, "modal")).toBe("shadow-none");
  });

  test("it should flush the bottom without stretching in an unfilled drawer", () => {
    expect(resolveFieldPickerClassName(false, "drawer")).toBe(
      "shadow-none min-w-max rounded-b-none overflow-visible",
    );
  });

  test("it should stretch a filled menu", () => {
    expect(resolveFieldPickerClassName(true, "menu")).toBe("w-full");
  });

  test("it should leave menu class empty when not filling", () => {
    expect(resolveFieldPickerClassName(false, "menu")).toBeUndefined();
  });
});

describe("resolveFieldShowFooter", () => {
  test("it should keep an explicit showFooter", () => {
    expect(resolveFieldShowFooter(true, "menu")).toBe(true);
    expect(resolveFieldShowFooter(false, "drawer")).toBe(false);
  });

  test("it should default to true for drawer and modal when unset", () => {
    expect(resolveFieldShowFooter(undefined, "modal")).toBe(true);
    expect(resolveFieldShowFooter(undefined, "drawer")).toBe(true);
  });

  test("it should default to false for menu when unset", () => {
    expect(resolveFieldShowFooter(undefined, "menu")).toBe(false);
  });
});
