/**
 * Example vue-i18n adapter for `@bridge-ui/vue`.
 * Copy into your app or wire via `BridgeUIProvider` / `createBridgeUI` `global.i18n`.
 * Not published as an npm package.
 *
 * Passes Bridge source strings, `count`, and `params` to `i18n.t`
 * (interpolation and `|` pluralization stay in vue-i18n).
 * `setLocale` on the adapter is invoked by Bridge `setLocale`.
 */

// ** External Imports
import { isNil } from "es-toolkit/compat";
import type { Composer } from "vue-i18n";

// ** Core Imports
import type { I18nAdapter } from "@bridge-ui/core/Adapters";

/**
 * Builds a vue-i18n-backed {@link I18nAdapter} for Bridge chrome strings.
 * Pass `vueI18n.global` (composition mode) or the result of `useI18n()`.
 */
export function createVueI18nAdapter(i18n: Composer): I18nAdapter {
  return {
    setLocale(locale) {
      i18n.locale.value = locale;
    },
    t(message, count, params) {
      if (isNil(count)) {
        return params ? i18n.t(message, params) : i18n.t(message);
      }

      return params ? i18n.t(message, count, params) : i18n.t(message, count);
    },
  };
}
