/**
 * Example vue-i18n adapter for `@bridge-ui/vue`.
 * Copy into your app or wire via `BridgeUIProvider` / `createBridgeUI` `global.i18n`.
 * Not published as an npm package.
 *
 * Passes Bridge source strings and `params` straight to `i18n.t`
 * (interpolation, pluralization, etc. stay in vue-i18n).
 */

// ** Core Imports
import { type I18nAdapter, type MessageParams } from "@bridge-ui/core";

/**
 * Minimal vue-i18n-compatible translate surface (`i18n.global` or `useI18n()`).
 */
export type VueI18nLike = {
  t: (key: string, ...args: unknown[]) => string;
};

/**
 * Builds a vue-i18n-backed {@link I18nAdapter} for Bridge chrome strings.
 */
export function createVueI18nAdapter(i18n: VueI18nLike): I18nAdapter {
  return {
    t(message, params?: MessageParams) {
      if (params) {
        return i18n.t(message, params);
      }

      return i18n.t(message);
    },
  };
}
