/**
 * Example dictionary i18n adapter for `@bridge-ui/vue`.
 * Copy into your app or wire via `BridgeUIProvider` / `createBridgeUI` `global.i18n`.
 * Not published as an npm package.
 *
 * Source English strings are the lookup keys (same strings Bridge passes to
 * `resolveMessage`). Messages are keyed by locale; optional `setLocale` updates
 * the active locale used by `t`. `t` replaces `{{name}}` from `params` and
 * picks `|` plural forms when `count` is set (`one | other`).
 */

// ** External Imports
import { get, isNil } from "es-toolkit/compat";

// ** Core Imports
import {
  interpolateMessage,
  selectPluralMessage,
  type I18nAdapter,
} from "@bridge-ui/core/Adapters";

// prettier-ignore
const MESSAGES: Record<string, Record<string, string>> = {
  "en-US": {},
  "pt-BR": {
    "OK": "OK",
    "Close": "Fechar",
    "Next": "Próxima",
    "Columns": "Colunas",
    "Reset": "Redefinir",
    "Search": "Pesquisar",
    "No data": "Sem dados",
    "Previous": "Anterior",
    "Pagination": "Paginação",
    "Last page": "Última página",
    "Loading...": "Carregando...",
    "No options": "Nenhuma opção",
    "First page": "Primeira página",
    "Hide password": "Ocultar senha",
    "Select row": "Selecionar linha",
    "Show password": "Mostrar senha",
    "Filter column": "Filtrar coluna",
    "Clear selection": "Limpar seleção",
    "Decrement value": "Diminuir valor",
    "Increment value": "Aumentar valor",
    "Rows per page": "Linhas por página",
    "Sort ascending": "Ordenar crescente",
    "Cancel sorting": "Cancelar ordenação",
    "Sort descending": "Ordenar decrescente",
    "Select all items": "Selecionar todos os itens",
    "Select all rows": "Selecionar todas as linhas",
    "Page {{page}} of {{count}}": "Página {{page}} de {{count}}",
    "{{selected}} of {{total}} row(s) selected.": "{{selected}} de {{total}} linha selecionada. | {{selected}} de {{total}} linhas selecionadas.",
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
    t(message, count, params) {
      const translated = get(MESSAGES, [locale, message], message);
      const template = isNil(count)
        ? translated
        : selectPluralMessage(translated, count);

      return interpolateMessage(template, params);
    },
  };
}
