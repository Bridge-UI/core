/**
 * Example i18next adapter for `@bridge-ui/react`.
 * Copy into your app or wire via `BridgeUIProvider` `global.i18n`.
 * Not published as an npm package.
 *
 * Uses the default i18next instance. Passes Bridge source strings, `count`,
 * and `params` to `i18n.t` (interpolation and pluralization stay in i18next).
 * `setLocale` syncs via `i18n.changeLanguage`.
 */

// ** External Imports
import { isNil } from "es-toolkit/compat";
import i18n from "i18next";

// ** Core Imports
import type { I18nAdapter } from "@bridge-ui/core/Adapters";

/**
 * Builds an i18next-backed {@link I18nAdapter} for Bridge chrome strings.
 */
export function createI18nextAdapter(): I18nAdapter {
  return {
    setLocale(locale) {
      void i18n.changeLanguage(locale);
    },
    t(message, count, params) {
      return i18n.t(message, {
        ...params,
        ...(isNil(count) ? {} : { count }),
      });
    },
  };
}
