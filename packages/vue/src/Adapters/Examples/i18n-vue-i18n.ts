/**
 * vue-i18n adapter. Wire via `BridgeUIProvider` / `createBridgeUI` `global.i18n`.
 * Requires the optional `vue-i18n` peer.
 *
 * Passes Bridge source strings, `count`, and `params` to `i18n.t`.
 * Pass `vueI18n.global` (composition mode) or the result of `useI18n()`.
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
