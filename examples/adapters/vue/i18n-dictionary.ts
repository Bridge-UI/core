/**
 * Example dictionary i18n adapter for `@bridge-ui/vue`.
 * Copy into your app or wire via `BridgeUIProvider` / `createBridgeUI` `global.i18n`.
 * Not published as an npm package.
 *
 * Source English strings are the lookup keys (same strings Bridge passes to
 * `resolveMessage`). For replace / pluralization, wrap vue-i18n (or similar)
 * instead of this dictionary helper.
 */

// ** Core Imports
import { createI18nAdapter, type I18nAdapter } from "@bridge-ui/core";

/** Built-in locales shipped by this example. */
export type DictionaryLocale = "en" | "pt-BR";

const PT_BR_MESSAGES: Record<string, string> = {
  Close: "Fechar",
  "Loading...": "Carregando...",
  "No options": "Nenhuma opção",
  "Hide password": "Ocultar senha",
  "Show password": "Mostrar senha",
  "Clear selection": "Limpar seleção",
  "Decrement value": "Diminuir valor",
  "Increment value": "Aumentar valor",
};

/**
 * Builds a dictionary-backed {@link I18nAdapter} for Bridge chrome strings.
 */
export function createDictionaryI18nAdapter(
  locale: DictionaryLocale = "en",
): I18nAdapter {
  if (locale === "en") {
    return createI18nAdapter({});
  }

  return createI18nAdapter(PT_BR_MESSAGES);
}
