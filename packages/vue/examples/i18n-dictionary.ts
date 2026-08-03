/**
 * Example dictionary i18n adapter for `@bridge-ui/vue`.
 * Copy into your app or wire via `BridgeUIProvider` / `createBridgeUI` `global.i18n`.
 * Not published as an npm package.
 *
 * Source English strings are the lookup keys (same strings Bridge passes to
 * `resolveMessage`). Static map only — no `setLocale`. For locale switching
 * with replace / pluralization, wrap vue-i18n (or similar) instead.
 */

// ** External Imports
import { get } from "es-toolkit/compat";

// ** Core Imports
import type { I18nAdapter } from "@bridge-ui/core";

// prettier-ignore
const MESSAGES: Record<string, string> = {
  "Close": "Fechar",
  "Loading...": "Carregando...",
  "No options": "Nenhuma opção",
  "Hide password": "Ocultar senha",
  "Show password": "Mostrar senha",
  "Clear selection": "Limpar seleção",
  "Decrement value": "Diminuir valor",
  "Increment value": "Aumentar valor",
};

/**
 * Builds a static dictionary {@link I18nAdapter} for Bridge chrome strings.
 */
export function createDictionaryI18nAdapter(): I18nAdapter {
  return {
    t(message) {
      return get(MESSAGES, message, message);
    },
  };
}
