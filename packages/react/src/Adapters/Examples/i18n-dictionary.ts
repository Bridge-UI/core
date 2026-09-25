/**
 * In-memory dictionary i18n adapter. Wire via `BridgeUIProvider` `global.i18n`.
 *
 * Source English strings are the lookup keys. Messages are keyed by locale;
 * `setLocale` updates the locale used by `t` (Bridge `setLocale` syncs it).
 * `t` replaces `{{name}}` from `params` and picks `|` plural forms when
 * `count` is set (`one | other`).
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
 * Default chrome-string dictionary (`en-US` and `pt-BR`).
 */
// prettier-ignore
export const defaultDictionaryI18nMessages: DictionaryI18nMessages = {
  "en-US": {
    "OK": "OK",
    "Next": "Next",
    "Close": "Close",
    "Reset": "Reset",
    "Slides": "Slides",
    "Search": "Search",
    "Columns": "Columns",
    "Loading": "Loading",
    "No data": "No data",
    "Carousel": "Carousel",
    "Previous": "Previous",
    "Last page": "Last page",
    "Next slide": "Next slide",
    "Loading...": "Loading...",
    "No options": "No options",
    "Pagination": "Pagination",
    "Expand row": "Expand row",
    "First page": "First page",
    "Select row": "Select row",
    "Hide password": "Hide password",
    "Show password": "Show password",
    "Filter column": "Filter column",
    "Rows per page": "Rows per page",
    "Previous slide": "Previous slide",
    "Sort ascending": "Sort ascending",
    "Cancel sorting": "Cancel sorting",
    "Clear selection": "Clear selection",
    "Decrement value": "Decrement value",
    "Increment value": "Increment value",
    "Select all rows": "Select all rows",
    "Sort descending": "Sort descending",
    "Slide {{index}}": "Slide {{index}}",
    "Select all items": "Select all items",
    "Go to slide {{index}}": "Go to slide {{index}}",
    "Page {{page}} of {{count}}": "Page {{page}} of {{count}}",
    "Slide {{index}} of {{count}}": "Slide {{index}} of {{count}}",
    "{{selected}} of {{total}} row(s) selected.": "{{selected}} of {{total}} row selected. | {{selected}} of {{total}} rows selected.",
  },
  "pt-BR": {
    "OK": "OK",
    "Close": "Fechar",
    "Next": "Próxima",
    "Slides": "Slides",
    "Columns": "Colunas",
    "Reset": "Redefinir",
    "Search": "Pesquisar",
    "No data": "Sem dados",
    "Previous": "Anterior",
    "Carousel": "Carrossel",
    "Loading": "Carregando",
    "Pagination": "Paginação",
    "Last page": "Última página",
    "Next slide": "Próximo slide",
    "Loading...": "Carregando...",
    "No options": "Nenhuma opção",
    "Expand row": "Expandir linha",
    "First page": "Primeira página",
    "Hide password": "Ocultar senha",
    "Select row": "Selecionar linha",
    "Show password": "Mostrar senha",
    "Filter column": "Filtrar coluna",
    "Previous slide": "Slide anterior",
    "Clear selection": "Limpar seleção",
    "Decrement value": "Diminuir valor",
    "Increment value": "Aumentar valor",
    "Rows per page": "Linhas por página",
    "Slide {{index}}": "Slide {{index}}",
    "Sort ascending": "Ordenar crescente",
    "Cancel sorting": "Cancelar ordenação",
    "Sort descending": "Ordenar decrescente",
    "Select all items": "Selecionar todos os itens",
    "Select all rows": "Selecionar todas as linhas",
    "Go to slide {{index}}": "Ir para o slide {{index}}",
    "Page {{page}} of {{count}}": "Página {{page}} de {{count}}",
    "Slide {{index}} of {{count}}": "Slide {{index}} de {{count}}",
    "{{selected}} of {{total}} row(s) selected.": "{{selected}} de {{total}} linha selecionada. | {{selected}} de {{total}} linhas selecionadas.",
  },
};

/**
 * Builds a locale-keyed dictionary {@link I18nAdapter} for Bridge chrome strings.
 * Unknown locales / messages fall back to the English source string.
 * Locale starts as `"en-US"` until {@link I18nAdapter.setLocale}.
 */
export function createDictionaryI18nAdapter(): I18nAdapter {
  let locale = "en-US";

  return {
    setLocale(next) {
      locale = next;
    },
    t(message, count, params) {
      const translated = get(
        defaultDictionaryI18nMessages,
        [locale, message],
        message,
      );
      const template = isNil(count)
        ? translated
        : selectPluralMessage(translated, count);

      return interpolateMessage(template, params);
    },
  };
}
