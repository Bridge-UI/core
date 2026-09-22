// ** External Imports
import { expect, test } from "vitest";
import { createI18n } from "vue-i18n";

// ** Local Imports
import { createDictionaryI18nAdapter } from "@/Adapters/Examples/i18n-dictionary";
import { createVueI18nAdapter } from "@/Adapters/Examples/i18n-vue-i18n";

test("it should translate dictionary messages after setLocale", () => {
  const adapter = createDictionaryI18nAdapter({ locale: "pt-BR" });

  expect(adapter.t("Close")).toBe("Fechar");
  expect(adapter.t("Unknown")).toBe("Unknown");
  adapter.setLocale?.("en-US");
  expect(adapter.t("Close")).toBe("Close");
});

test("it should interpolate and pluralize dictionary messages", () => {
  const adapter = createDictionaryI18nAdapter({ locale: "pt-BR" });

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

test("it should forward messages to vue-i18n", () => {
  const vueI18n = createI18n({
    legacy: false,
    locale: "en-US",
    messages: {
      "en-US": { Close: "Close" },
      "pt-BR": { Close: "Fechar" },
    },
  });
  const adapter = createVueI18nAdapter(vueI18n.global);

  expect(adapter.t("Close")).toBe("Close");
  adapter.setLocale?.("pt-BR");
  expect(adapter.t("Close")).toBe("Fechar");
});
