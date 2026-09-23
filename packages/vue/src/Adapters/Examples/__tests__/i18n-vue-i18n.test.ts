// ** External Imports
import { expect, test } from "vitest";
import { createI18n } from "vue-i18n";

// ** Local Imports
import { createVueI18nAdapter } from "@/Adapters/Examples/i18n-vue-i18n";

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
