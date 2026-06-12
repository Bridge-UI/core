// @vitest-environment happy-dom

// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { hasDocument, hasWindow } from "@core/Utils/env";

describe("hasWindow", () => {
  test("it should return true in jsdom", () => {
    expect(hasWindow()).toBe(true);
  });
});

describe("hasDocument", () => {
  test("it should return true in jsdom", () => {
    expect(hasDocument()).toBe(true);
  });
});
