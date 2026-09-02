// ** External Imports
import { clamp, get, isNil, isNumber, last } from "es-toolkit/compat";

/**
 * Opaque values forwarded to the adapter (interpolation vars, …).
 * Replace is the adapter’s job. Pluralization uses the `count` argument on
 * {@link I18nAdapter.t}, not a field here.
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
 * Interpolation and pluralization are the adapter’s job (i18next / vue-i18n,
 * or {@link interpolateMessage} + {@link selectPluralMessage} in a dictionary
 * adapter). `t` receives `count` as its own argument. Without an adapter,
 * `resolveMessage` still replaces `{{name}}` and picks `|` forms when `count`
 * is set.
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
   * `count` is the cardinal for pluralization; `params` are interpolation vars.
   */
  t: (message: string, count?: number, params?: MessageParams) => string;
}

function isMessageCount(value: unknown): value is number {
  return isNumber(value) && Number.isFinite(value);
}

/**
 * Picks a `|`-separated plural form from `template`.
 * Two forms: `one | other`. Three: `zero | one | other`.
 */
export function selectPluralMessage(template: string, count: number): string {
  const parts = template.split("|").map((part) => {
    return part.trim();
  });

  if (parts.length < 2) {
    return template;
  }

  const index = parts.length === 2 ? (count === 1 ? 0 : 1) : clamp(count, 0, 2);

  return get(parts, index, last(parts) ?? template);
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
 * source string with `{{name}}` tokens replaced from `params`, and `|` plural
 * forms when `count` is set.
 *
 * `countOrParams` is the plural cardinal when it is a finite number, otherwise
 * interpolation vars (`params` stays unused).
 */
export function resolveMessage(
  message: string,
  adapter?: undefined | I18nAdapter,
  countOrParams?: number | MessageParams,
  params?: MessageParams,
): string {
  const count = isMessageCount(countOrParams) ? countOrParams : undefined;
  const resolvedParams = isMessageCount(countOrParams) ? params : countOrParams;

  if (!isNil(adapter)) {
    return adapter.t(message, count, resolvedParams);
  }

  const template = isNil(count) ? message : selectPluralMessage(message, count);

  return interpolateMessage(template, resolvedParams);
}
