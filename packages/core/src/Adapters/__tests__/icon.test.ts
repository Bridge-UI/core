// ** External Imports
import { describe, expect, test, vi } from "vitest";

// ** Local Imports
import {
  createIconAdapter,
  isSemanticIconName,
  resolveIconSource,
  SEMANTIC_ICON_NAMES,
} from "@/Adapters/icon";

describe("createIconAdapter", () => {
  test("it should resolve icons from the provided map", () => {
    const Check = () => null;
    const adapter = createIconAdapter(
      Object.fromEntries(
        SEMANTIC_ICON_NAMES.map((name) => [name, Check]),
      ) as Record<(typeof SEMANTIC_ICON_NAMES)[number], unknown>,
    );

    expect(adapter.resolve("check")).toBe(Check);
  });

  test("it should throw when a name is missing from the map", () => {
    const adapter = createIconAdapter({} as never);

    expect(() => adapter.resolve("clear")).toThrow(
      '[BridgeUI] Missing icon "clear" in icon adapter.',
    );
  });

  test("it should attach an optional normalize hook", () => {
    const normalize = vi.fn((source: unknown) => source);
    const adapter = createIconAdapter(
      Object.fromEntries(
        SEMANTIC_ICON_NAMES.map((name) => [name, null]),
      ) as Record<(typeof SEMANTIC_ICON_NAMES)[number], unknown>,
      { normalize },
    );

    expect(adapter.normalize).toBe(normalize);
  });
});

describe("isSemanticIconName", () => {
  test("it should return true for default semantic names", () => {
    expect(isSemanticIconName("clear")).toBe(true);
    expect(isSemanticIconName("chevronUpDown")).toBe(true);
  });

  test("it should return false for unknown values", () => {
    expect(isSemanticIconName("not-an-icon")).toBe(false);
    expect(isSemanticIconName(null)).toBe(false);
    expect(isSemanticIconName(12)).toBe(false);
  });
});

describe("resolveIconSource", () => {
  const Glyph = () => null;
  const adapter = createIconAdapter(
    Object.fromEntries(
      SEMANTIC_ICON_NAMES.map((name) => [name, Glyph]),
    ) as Record<(typeof SEMANTIC_ICON_NAMES)[number], unknown>,
  );

  test("it should resolve semantic names via the adapter", () => {
    expect(resolveIconSource("user", adapter)).toBe(Glyph);
  });

  test("it should pass components through unchanged", () => {
    const Custom = () => null;

    expect(resolveIconSource(Custom, adapter)).toBe(Custom);
  });

  test("it should preserve null and undefined", () => {
    expect(resolveIconSource(null, adapter)).toBeNull();
    expect(resolveIconSource(undefined, adapter)).toBeUndefined();
  });

  test("it should throw when resolving a semantic name without an adapter", () => {
    expect(() => resolveIconSource("clear", undefined)).toThrow(
      /Semantic icon "clear" requires BridgeUIProvider global\.icons/,
    );
  });

  test("it should normalize concrete icon values when the adapter defines normalize", () => {
    const definition = { prefix: "fas", iconName: "coffee" };
    const Wrapped = () => null;
    const normalize = vi.fn(() => Wrapped);
    const normalizingAdapter = createIconAdapter(
      Object.fromEntries(
        SEMANTIC_ICON_NAMES.map((name) => [name, Glyph]),
      ) as Record<(typeof SEMANTIC_ICON_NAMES)[number], unknown>,
      { normalize },
    );

    expect(resolveIconSource(definition, normalizingAdapter)).toBe(Wrapped);
    expect(normalize).toHaveBeenCalledWith(definition);
  });

  test("it should normalize values returned from semantic resolve", () => {
    const definition = { prefix: "fas", iconName: "user" };
    const Wrapped = () => null;
    const normalize = vi.fn((source: unknown) => {
      return source === definition ? Wrapped : source;
    });
    const normalizingAdapter = createIconAdapter(
      Object.fromEntries(
        SEMANTIC_ICON_NAMES.map((name) => [
          name,
          name === "user" ? definition : Glyph,
        ]),
      ) as Record<(typeof SEMANTIC_ICON_NAMES)[number], unknown>,
      { normalize },
    );

    expect(resolveIconSource("user", normalizingAdapter)).toBe(Wrapped);
    expect(normalize).toHaveBeenCalledWith(definition);
  });

  test("it should pass concrete icons through when normalize is omitted", () => {
    const Custom = () => null;

    expect(resolveIconSource(Custom, undefined)).toBe(Custom);
  });
});
