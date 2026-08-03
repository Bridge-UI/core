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
 * Interpolation and pluralization are handled by the adapter implementation,
 * not by Bridge core.
 *
 * Optional {@link setLocale} is called by Bridge `setLocale` so the app can
 * sync i18next / vue-i18n in one place. Persistence stays in the app.
 *
 * See `packages/{react,vue}/examples` for sample implementations.
 */
export interface I18nAdapter {
  /**
   * Called by Bridge `setLocale` to sync the underlying i18n library.
   */
  setLocale?: (locale: string) => void;

  /**
   * Translates a source message. Unknown messages should return the source.
   * Adapters may use `params` for replace / pluralization.
   */
  t: (message: string, params?: MessageParams) => string;
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
