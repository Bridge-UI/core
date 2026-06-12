// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  getSnackbarTransitionClass,
  hasSnackbarTransition,
  usesTrailingSnackbarActions,
} from "@core/Utils/snackbar";

describe("getSnackbarTransitionClass", () => {
  test("it should return a transition class for slide", () => {
    expect(getSnackbarTransitionClass("slide")).toBeTruthy();
  });
});

describe("hasSnackbarTransition", () => {
  test("it should return false for none", () => {
    expect(hasSnackbarTransition("none")).toBe(false);
  });

  test("it should return true for slide", () => {
    expect(hasSnackbarTransition("slide")).toBe(true);
  });
});

describe("usesTrailingSnackbarActions", () => {
  test("it should return true for small padding", () => {
    expect(usesTrailingSnackbarActions("small")).toBe(true);
  });

  test("it should return false for medium padding", () => {
    expect(usesTrailingSnackbarActions("medium")).toBe(false);
  });
});
