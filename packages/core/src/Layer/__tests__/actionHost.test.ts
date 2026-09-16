// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  createActionHostRegistry,
  resetActionHostRegistriesForTests,
} from "@/Layer/actionHost";

describe("createActionHostRegistry", () => {
  test("it should resolve the injected host first", () => {
    const registry = createActionHostRegistry<string>();

    registry.register("registered");

    expect(registry.resolve("injected")).toBe("injected");
  });

  test("it should fall back to the last registered host", () => {
    const registry = createActionHostRegistry<string>();

    registry.register("outer");
    const unregisterInner = registry.register("inner");

    expect(registry.resolve(null)).toBe("inner");

    unregisterInner();

    expect(registry.resolve(undefined)).toBe("outer");
  });

  test("it should return undefined when empty", () => {
    const registry = createActionHostRegistry<string>();

    expect(registry.resolve(null)).toBeUndefined();
  });
});

describe("resetActionHostRegistriesForTests", () => {
  test("it should clear every registry", () => {
    const registry = createActionHostRegistry<string>();

    registry.register("host");
    resetActionHostRegistriesForTests();

    expect(registry.resolve(null)).toBeUndefined();
  });
});
