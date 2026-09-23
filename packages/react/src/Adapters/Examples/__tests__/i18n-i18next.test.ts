// ** External Imports
import i18n from "i18next";
import { expect, test, vi } from "vitest";

// ** Local Imports
import { createI18nextAdapter } from "@/Adapters/Examples/i18n-i18next";

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
