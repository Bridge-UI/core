// ** External Imports
import { describe, expect, test, vi } from "vitest";

// ** Local Imports
import {
  isSemanticIconName,
  resolveIconSource,
  SEMANTIC_ICON_NAMES,
  type IconAdapter,
  type SemanticIconName,
} from "@/Adapters/icon";

function createTestIconAdapter(
  icons: Partial<Record<SemanticIconName, unknown>>,
  normalize?: IconAdapter["normalize"],
): IconAdapter {
  return {
    normalize,
    resolve(name) {
      return icons[name];
    },
  };
}

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
  const adapter = createTestIconAdapter(
    Object.fromEntries(
      SEMANTIC_ICON_NAMES.map((name) => [name, Glyph]),
    ) as Record<SemanticIconName, unknown>,
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
    const normalizingAdapter = createTestIconAdapter(
      Object.fromEntries(
        SEMANTIC_ICON_NAMES.map((name) => [name, Glyph]),
      ) as Record<SemanticIconName, unknown>,
      normalize,
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
    const normalizingAdapter = createTestIconAdapter(
      Object.fromEntries(
        SEMANTIC_ICON_NAMES.map((name) => [
          name,
          name === "user" ? definition : Glyph,
        ]),
      ) as Record<SemanticIconName, unknown>,
      normalize,
    );

    expect(resolveIconSource("user", normalizingAdapter)).toBe(Wrapped);
    expect(normalize).toHaveBeenCalledWith(definition);
  });

  test("it should pass concrete icons through when normalize is omitted", () => {
    const Custom = () => null;

    expect(resolveIconSource(Custom, undefined)).toBe(Custom);
  });
});
