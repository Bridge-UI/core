// ** External Imports
import { isNil } from "es-toolkit/compat";

/**
 * Opaque values forwarded to the adapter (`count`, interpolation vars, …).
 * Replace and pluralization are the adapter’s responsibility (i18next, vue-i18n, …).
 */
export type MessageParams = Record<
  string,
  null | number | string | boolean | undefined
>;

/**
 * Pluggable i18n set for Bridge UI.
 * Apps provide an adapter via `BridgeUIProvider` `global.i18n`.
 *
 * The source English string is the lookup key (gettext-style):
 * `t("Hide password")` → `"Ocultar senha"`.
 *
 * Interpolation is the adapter’s job (i18next / vue-i18n, or
 * `interpolateMessage` in a dictionary adapter). Without an adapter,
 * `resolveMessage` still replaces `{{name}}` on the English source.
 *
 * Optional `setLocale` is called by Bridge `setLocale` so the app can
 * sync i18next / vue-i18n / multi-locale dictionaries in one place. Single-
 * locale adapters can omit it. Persistence stays in the app.
 *
 * See `packages/{react,vue}/examples` for sample implementations.
 */
export interface I18nAdapter {
  /**
   * Called by Bridge `setLocale` to sync the adapter’s active locale.
   * Optional for single-locale adapters.
   */
  setLocale?: (locale: string) => void;

  /**
   * Translates a source message. Unknown messages should return the source.
   * Adapters may use `params` for replace / pluralization.
   */
  t: (message: string, params?: MessageParams) => string;
}

/**
 * Replaces `{{name}}` tokens using `params`. Missing keys stay as the token.
 */
export function interpolateMessage(
  template: string,
  params?: MessageParams,
): string {
  if (isNil(params)) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const value = params[key];

    if (isNil(value)) {
      return match;
    }

    return String(value);
  });
}

/**
 * Resolves `message` through the adapter. Without an adapter, returns the
 * source string with `{{name}}` tokens replaced from `params`.
 */
export function resolveMessage(
  message: string,
  adapter?: undefined | I18nAdapter,
  params?: MessageParams,
): string {
  if (!isNil(adapter)) {
    return adapter.t(message, params);
  }

  return interpolateMessage(message, params);
}
