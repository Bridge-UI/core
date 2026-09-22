/**
 * i18next adapter. Wire via `BridgeUIProvider` `global.i18n`.
 * Requires the optional `i18next` peer (uses the default instance).
 *
 * Passes Bridge source strings, `count`, and `params` to `i18n.t`.
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
