// ** External Imports
import i18n from "i18next";
import { expect, test, vi } from "vitest";

// ** Local Imports
import { createDictionaryI18nAdapter } from "@/Adapters/Examples/i18n-dictionary";
import { createI18nextAdapter } from "@/Adapters/Examples/i18n-i18next";

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

test("it should forward messages to i18next", async () => {
  await i18n.init({
    lng: "en",
    resources: {
      en: { translation: { Close: "Close" } },
      "pt-BR": { translation: { Close: "Fechar" } },
    },
  });

  const adapter = createI18nextAdapter();

  expect(adapter.t("Close")).toBe("Close");

  const changeLanguage = vi.spyOn(i18n, "changeLanguage");

  adapter.setLocale?.("pt-BR");

  expect(changeLanguage).toHaveBeenCalledWith("pt-BR");
  await changeLanguage.mock.results[0]?.value;
  expect(adapter.t("Close")).toBe("Fechar");
  changeLanguage.mockRestore();
});
