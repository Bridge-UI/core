// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import {
  setI18nAdapterForTests,
  useResolveMessage,
} from "@/Adapters/I18n/useI18nAdapter";

afterEach(() => {
  cleanup();
  setI18nAdapterForTests(undefined);
});

test("it should return the source message when no adapter is set", () => {
  const { result } = renderHook(() => useResolveMessage());

  expect(result.current("Hide password")).toBe("Hide password");
});

test("it should translate through the test i18n adapter", () => {
  setI18nAdapterForTests({
    t(message) {
      return message === "Close" ? "Fechar" : message;
    },
  });

  const { result } = renderHook(() => useResolveMessage());

  expect(result.current("Close")).toBe("Fechar");
  expect(result.current("Show password")).toBe("Show password");
});

test("it should forward params to the adapter", () => {
  const seen: unknown[] = [];

  setI18nAdapterForTests({
    t(message, count, params) {
      seen.push({ count, params, message });

      return message;
    },
  });

  const { result } = renderHook(() => useResolveMessage());

  result.current("{{count}} item", { count: 3 });
  result.current("{{count}} item", 3);

  expect(seen).toEqual([
    {
      count: undefined,
      params: { count: 3 },
      message: "{{count}} item",
    },
    { count: 3, params: undefined, message: "{{count}} item" },
  ]);
});
