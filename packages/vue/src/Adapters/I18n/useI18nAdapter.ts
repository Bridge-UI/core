// ** External Imports
import { computed, type ComputedRef } from "vue";

// ** Core Imports
import {
  resolveMessage,
  type I18nAdapter,
  type MessageParams,
} from "@bridge-ui/core";

// ** Local Imports
import { useBridgeUI } from "@/Provider/useBridgeUI";

let i18nAdapterForTests: undefined | I18nAdapter;

/**
 * Sets a process-wide i18n adapter fallback. For tests only.
 */
export function setI18nAdapterForTests(adapter: undefined | I18nAdapter) {
  i18nAdapterForTests = adapter;
}

/**
 * Returns the active i18n adapter from {@link BridgeUIProvider}.
 * When unset, {@link useResolveMessage} returns the English source string
 * (see `packages/vue/docs/examples`).
 */
export function useI18nAdapter(): ComputedRef<undefined | I18nAdapter> {
  const bridge = useBridgeUI();

  return computed(() => {
    return bridge?.global.value.i18n ?? i18nAdapterForTests;
  });
}

/**
 * Resolves Bridge chrome strings through the active i18n adapter.
 */
export function useResolveMessage() {
  const i18n = useI18nAdapter();

  return (message: string, params?: MessageParams) => {
    return resolveMessage(message, i18n.value, params);
  };
}
