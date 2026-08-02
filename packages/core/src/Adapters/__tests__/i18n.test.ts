// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import { createI18nAdapter, resolveMessage } from "@/Adapters/i18n";

describe("createI18nAdapter", () => {
  test("it should translate known source messages", () => {
    const adapter = createI18nAdapter({
      Close: "Fechar",
      "Hide password": "Ocultar senha",
    });

    expect(adapter.t("Close")).toBe("Fechar");
    expect(adapter.t("Hide password")).toBe("Ocultar senha");
  });

  test("it should fall back to the source message when missing", () => {
    const adapter = createI18nAdapter({ Close: "Fechar" });

    expect(adapter.t("Show password")).toBe("Show password");
  });

  test("it should support function message values for custom formatting", () => {
    const adapter = createI18nAdapter({
      item: (params) => {
        const count = Number(params?.count ?? 0);

        return count === 1 ? "1 item" : `${count} items`;
      },
    });

    expect(adapter.t("item", { count: 1 })).toBe("1 item");
    expect(adapter.t("item", { count: 3 })).toBe("3 items");
  });
});

describe("resolveMessage", () => {
  const adapter = createI18nAdapter({
    Close: "Fechar",
  });

  test("it should resolve via the adapter when provided", () => {
    expect(resolveMessage("Close", adapter)).toBe("Fechar");
  });

  test("it should return the source message without an adapter", () => {
    expect(resolveMessage("Hide password")).toBe("Hide password");
  });

  test("it should forward params to the adapter", () => {
    const seen: unknown[] = [];
    const tracking = {
      t(message: string, params?: Record<string, unknown>) {
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
