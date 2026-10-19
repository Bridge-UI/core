// ** Core Imports
import {
  resolveMessage,
  type I18nAdapter,
  type MessageParams,
} from "@bridge-ui/core/Adapters";

// ** Local Imports
import { useBridgeUI } from "@/Provider/context";

let i18nAdapterForTests: undefined | I18nAdapter;

/**
 * Sets a process-wide i18n adapter fallback. For tests only.
 */
export function setI18nAdapterForTests(adapter: undefined | I18nAdapter) {
  i18nAdapterForTests = adapter;
}

/**
 * Getter for the active i18n adapter from `BridgeUIProvider`. When unset,
 * {@link useResolveMessage} returns the English source string.
 */
export function useI18nAdapter(): () => undefined | I18nAdapter {
  const bridge = useBridgeUI();

  return () => {
    return bridge?.global.i18n ?? i18nAdapterForTests;
  };
}

/**
 * Resolves Bridge chrome strings through the active i18n adapter.
 */
export function useResolveMessage() {
  const i18n = useI18nAdapter();

  function resolve(
    message: string,
    countOrParams?: number | MessageParams,
    params?: MessageParams,
  ): string {
    return resolveMessage(message, i18n(), countOrParams, params);
  }

  return resolve;
}
