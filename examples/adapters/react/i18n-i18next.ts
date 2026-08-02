/**
 * Example i18next adapter for `@bridge-ui/react`.
 * Copy into your app or wire via `BridgeUIProvider` `global.i18n`.
 * Not published as an npm package.
 *
 * Passes Bridge source strings and `params` straight to `i18n.t`
 * (interpolation, pluralization, etc. stay in i18next).
 */

// ** Core Imports
import { type I18nAdapter, type MessageParams } from "@bridge-ui/core";

/**
 * Minimal i18next-compatible translate surface.
 */
export type I18nextLike = {
  t: (key: string, options?: MessageParams) => string;
};

/**
 * Builds an i18next-backed {@link I18nAdapter} for Bridge chrome strings.
 */
export function createI18nextAdapter(i18n: I18nextLike): I18nAdapter {
  return {
    t(message, params) {
      return i18n.t(message, params);
    },
  };
}
