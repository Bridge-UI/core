/**
 * Example dictionary i18n adapter for `@bridge-ui/vue`.
 * Copy into your app or wire via `BridgeUIProvider` / `createBridgeUI` `global.i18n`.
 * Not published as an npm package.
 *
 * Source English strings are the lookup keys (same strings Bridge passes to
 * `resolveMessage`). Messages are keyed by locale; optional `setLocale` updates
 * the active locale used by `t`. For replace / pluralization, wrap vue-i18n (or
 * similar) instead.
 */

// ** External Imports
import { get } from "es-toolkit/compat";

// ** Core Imports
import type { I18nAdapter } from "@bridge-ui/core/Adapters";

// prettier-ignore
const MESSAGES: Record<string, Record<string, string>> = {
  "en-US": {},
  "pt-BR": {
    "OK": "OK",
    "Close": "Fechar",
    "Reset": "Redefinir",
    "Columns": "Colunas",
    "Search": "Pesquisar",
    "No data": "Sem dados",
    "Per page:": "Por página:",
    "Loading...": "Carregando...",
    "No options": "Nenhuma opção",
    "Select row": "Selecionar linha",
    "Hide password": "Ocultar senha",
    "Show password": "Mostrar senha",
    "Filter column": "Filtrar coluna",
    "Clear selection": "Limpar seleção",
    "Decrement value": "Diminuir valor",
    "Increment value": "Aumentar valor",
    "Select all rows": "Selecionar todas as linhas",
    "Select all items": "Selecionar todos os itens",
  },
};

/**
 * Builds a locale-keyed dictionary {@link I18nAdapter} for Bridge chrome strings.
 * Unknown locales / messages fall back to the English source string.
 */
export function createDictionaryI18nAdapter(): I18nAdapter {
  let locale = "en-US";

  return {
    setLocale(next) {
      locale = next;
    },
    t(message) {
      return get(MESSAGES, [locale, message], message);
    },
  };
}
