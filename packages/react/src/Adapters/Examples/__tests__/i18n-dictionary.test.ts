// ** External Imports
import { expect, test } from "vitest";

// ** Local Imports
import { createDictionaryI18nAdapter } from "@/Adapters/Examples/i18n-dictionary";

test("it should translate dictionary messages after setLocale", () => {
  const adapter = createDictionaryI18nAdapter();

  expect(adapter.t("Close")).toBe("Close");
  expect(adapter.t("Unknown")).toBe("Unknown");
  adapter.setLocale?.("pt-BR");
  expect(adapter.t("Close")).toBe("Fechar");
});

test("it should interpolate and pluralize dictionary messages", () => {
  const adapter = createDictionaryI18nAdapter();

  expect(
    adapter.t("{{selected}} of {{total}} row(s) selected.", 1, {
      total: 3,
      selected: 1,
    }),
  ).toBe("1 of 3 row selected.");
  adapter.setLocale?.("pt-BR");
  expect(
    adapter.t("Page {{page}} of {{count}}", 2, { page: 1, count: 2 }),
  ).toBe("Página 1 de 2");
  expect(
    adapter.t("{{selected}} of {{total}} row(s) selected.", 1, {
      total: 3,
      selected: 1,
    }),
  ).toBe("1 de 3 linha selecionada.");
});
