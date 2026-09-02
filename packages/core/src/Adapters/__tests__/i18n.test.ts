// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  interpolateMessage,
  resolveMessage,
  type I18nAdapter,
} from "@/Adapters/i18n";

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

  test("it should interpolate params without an adapter", () => {
    expect(
      resolveMessage("Page {{page}} of {{count}}", undefined, {
        page: 1,
        count: 7,
      }),
    ).toBe("Page 1 of 7");
  });

  test("it should interpolate after a dictionary lookup", () => {
    const dictionary: I18nAdapter = {
      t(message, params) {
        const text =
          message === "Page {{page}} of {{count}}"
            ? "Página {{page}} de {{count}}"
            : message;

        return interpolateMessage(text, params);
      },
    };

    expect(
      resolveMessage("Page {{page}} of {{count}}", dictionary, {
        page: 1,
        count: 7,
      }),
    ).toBe("Página 1 de 7");
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

describe("interpolateMessage", () => {
  test("it should replace named tokens", () => {
    expect(
      interpolateMessage("{{selected}} of {{total}} row(s) selected.", {
        total: 68,
        selected: 2,
      }),
    ).toBe("2 of 68 row(s) selected.");
  });

  test("it should leave unknown tokens in place", () => {
    expect(interpolateMessage("Hello {{name}}", { other: true })).toBe(
      "Hello {{name}}",
    );
  });
});
