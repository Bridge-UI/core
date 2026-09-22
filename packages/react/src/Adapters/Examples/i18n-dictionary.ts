/**
 * In-memory dictionary i18n adapter. Wire via `BridgeUIProvider` `global.i18n`.
 *
 * Source English strings are the lookup keys. Messages are keyed by locale;
 * `setLocale` updates the locale used by `t`. `t` replaces `{{name}}` from
 * `params` and picks `|` plural forms when `count` is set (`one | other`).
 */

// ** External Imports
import { get, isNil } from "es-toolkit/compat";

// ** Core Imports
import {
  interpolateMessage,
  selectPluralMessage,
  type I18nAdapter,
} from "@bridge-ui/core/Adapters";

/**
 * Locale-keyed Bridge chrome strings (`source English` → translation).
 */
export type DictionaryI18nMessages = Record<string, Record<string, string>>;

/**
 * Options for {@link createDictionaryI18nAdapter}.
 */
export type DictionaryI18nAdapterOptions = {
  /**
   * Initial locale used by `t` until `setLocale`.
   *
   * @default "en-US"
   */
  locale?: string;

  /**
   * Locale-keyed message map. Unknown keys fall back to the source string.
   *
   * @default {@link defaultDictionaryI18nMessages}
   */
  messages?: DictionaryI18nMessages;
};

/**
 * Default chrome-string dictionary (`pt-BR` translations; `en-US` is empty so
 * source English is used).
 */
// prettier-ignore
export const defaultDictionaryI18nMessages: DictionaryI18nMessages = {
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
    "Loading": "Carregando",
    "Pagination": "Paginação",
    "Last page": "Última página",
    "Loading...": "Carregando...",
    "No options": "Nenhuma opção",
    "Expand row": "Expandir linha",
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
export function createDictionaryI18nAdapter(
  options: DictionaryI18nAdapterOptions = {},
): I18nAdapter {
  const messages = options.messages ?? defaultDictionaryI18nMessages;
  let locale = options.locale ?? "en-US";

  return {
    setLocale(next) {
      locale = next;
    },
    t(message, count, params) {
      const translated = get(messages, [locale, message], message);
      const template = isNil(count)
        ? translated
        : selectPluralMessage(translated, count);

      return interpolateMessage(template, params);
    },
  };
}
