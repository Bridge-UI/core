// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  getSnackbarTransitionClass,
  hasSnackbarTransition,
  resolveEffectiveSnackbarTransition,
} from "@/Layer/snackbar";

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

describe("resolveEffectiveSnackbarTransition", () => {
  test("it should return none when transition is none", () => {
    expect(resolveEffectiveSnackbarTransition("none")).toBe("none");
  });
});
