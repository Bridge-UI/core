/**
 * Example i18next adapter for `@bridge-ui/react`.
 * Copy into your app or wire via `BridgeUIProvider` `global.i18n`.
 * Not published as an npm package.
 *
 * Passes Bridge source strings and `params` straight to `i18n.t`
 * (interpolation, pluralization, etc. stay in i18next).
 * `setLocale` on the adapter is invoked by Bridge `setLocale`.
 */

// ** External Imports
import type { i18n as I18next } from "i18next";

// ** Core Imports
import type { I18nAdapter } from "@bridge-ui/core";

/**
 * Builds an i18next-backed {@link I18nAdapter} for Bridge chrome strings.
 */
export function createI18nextAdapter(i18n: I18next): I18nAdapter {
  return {
    t(message, params) {
      return i18n.t(message, params);
    },
    setLocale(locale) {
      void i18n.changeLanguage(locale);
    },
  };
}
