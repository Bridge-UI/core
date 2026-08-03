// ** External Imports
import { expect, test } from "vitest";

// ** Local Imports
import {
  setI18nAdapterForTests,
  useResolveMessage,
} from "@/Adapters/I18n/useI18nAdapter";

test("it should return the source message when no adapter is set", () => {
  setI18nAdapterForTests(undefined);

  const resolveMessage = useResolveMessage();

  expect(resolveMessage("Hide password")).toBe("Hide password");
});

test("it should translate through the test i18n adapter", () => {
  setI18nAdapterForTests({
    t(message) {
      return message === "Close" ? "Fechar" : message;
    },
  });

  const resolveMessage = useResolveMessage();

  expect(resolveMessage("Close")).toBe("Fechar");
  expect(resolveMessage("Show password")).toBe("Show password");

  setI18nAdapterForTests(undefined);
});

test("it should forward params to the adapter", () => {
  const seen: unknown[] = [];

  setI18nAdapterForTests({
    t(message, params) {
      seen.push({ params, message });

      return message;
    },
  });

  const resolveMessage = useResolveMessage();

  resolveMessage("{{count}} item", { count: 3 });

  expect(seen).toEqual([{ params: { count: 3 }, message: "{{count}} item" }]);

  setI18nAdapterForTests(undefined);
});
