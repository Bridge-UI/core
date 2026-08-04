/**
 * Example vue-i18n adapter for `@bridge-ui/vue`.
 * Copy into your app or wire via `BridgeUIProvider` / `createBridgeUI` `global.i18n`.
 * Not published as an npm package.
 *
 * Passes Bridge source strings and `params` straight to `i18n.t`
 * (interpolation, pluralization, etc. stay in vue-i18n).
 * `setLocale` on the adapter is invoked by Bridge `setLocale`.
 */

// ** External Imports
import type { Composer } from "vue-i18n";

// ** Core Imports
import type { I18nAdapter } from "@bridge-ui/core";

/**
 * Builds a vue-i18n-backed {@link I18nAdapter} for Bridge chrome strings.
 * Pass `vueI18n.global` (composition mode) or the result of `useI18n()`.
 */
export function createVueI18nAdapter(i18n: Composer): I18nAdapter {
  return {
    setLocale(locale) {
      i18n.locale.value = locale;
    },
    t(message, params) {
      if (params) {
        return i18n.t(message, params);
      }

      return i18n.t(message);
    },
  };
}
