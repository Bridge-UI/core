// ** External Imports
import { isFunction, isNil, isString } from "es-toolkit/compat";

/**
 * Opaque values forwarded to the adapter (`count`, interpolation vars, …).
 * Replace and pluralization are the adapter’s responsibility (i18next, vue-i18n, …).
 */
export type MessageParams = Record<
  string,
  null | number | string | boolean | undefined
>;

/**
 * Message value for {@link createI18nAdapter}: a static string or a function.
 */
export type MessageValue = string | ((params?: MessageParams) => string);

/**
 * Pluggable i18n set for Bridge UI.
 * Apps provide an adapter via `BridgeUIProvider` `global.i18n`.
 *
 * The source English string is the lookup key (gettext-style):
 * `t("Hide password")` → `"Ocultar senha"`.
 *
 * Interpolation and pluralization are handled by the adapter implementation,
 * not by Bridge core.
 */
export interface I18nAdapter {
  /**
   * Translates a source message. Unknown messages should return the source.
   * Adapters may use `params` for replace / pluralization.
   */
  t: (message: string, params?: MessageParams) => string;
}

/**
 * Creates a simple dictionary {@link I18nAdapter}.
 * Missing entries fall back to the original source message.
 *
 * For replace / pluralization, prefer wrapping i18next, vue-i18n, or a custom
 * `t` that understands those features — see `examples/adapters/{react,vue}`.
 */
export function createI18nAdapter(
  messages: Record<string, MessageValue>,
): I18nAdapter {
  return {
    t(message, params) {
      const translated = messages[message];

      if (isNil(translated)) {
        return message;
      }

      if (isFunction(translated)) {
        return translated(params);
      }

      if (isString(translated)) {
        return translated;
      }

      return message;
    },
  };
}

/**
 * Resolves `message` through the adapter, or returns the source string.
 */
export function resolveMessage(
  message: string,
  adapter?: undefined | I18nAdapter,
  params?: MessageParams,
): string {
  if (!isNil(adapter)) {
    return adapter.t(message, params);
  }

  return message;
}
