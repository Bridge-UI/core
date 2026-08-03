// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { resolveMessage, type I18nAdapter } from "@/Adapters/i18n";

describe("resolveMessage", () => {
  const adapter: I18nAdapter = {
    t(message) {
      if (message === "Close") {
        return "Fechar";
      }

      return message;
    },
  };

  test("it should resolve via the adapter when provided", () => {
    expect(resolveMessage("Close", adapter)).toBe("Fechar");
  });

  test("it should return the source message without an adapter", () => {
    expect(resolveMessage("Hide password")).toBe("Hide password");
  });

  test("it should forward params to the adapter", () => {
    const seen: unknown[] = [];
    const tracking: I18nAdapter = {
      t(message, params) {
        seen.push({ params, message });

        return message;
      },
    };

    resolveMessage("Hello {{name}}", tracking, { count: 2, name: "Bridge" });

    expect(seen).toEqual([
      { message: "Hello {{name}}", params: { count: 2, name: "Bridge" } },
    ]);
  });
});
