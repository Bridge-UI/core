// ** External Imports
import {
  inject,
  onBeforeUnmount,
  onMounted,
  watch,
  type SetupContext,
} from "vue";

// ** Local Imports
import type {
  TabItemOwnProps,
  TabItemSlots,
} from "@/Components/TabItem/tabItem.types";
import { TABS_INJECTION_KEY } from "@/Components/Tabs/tabsInjectionKey";

export function useTabItem(
  props: TabItemOwnProps,
  slots: SetupContext<TabItemSlots>["slots"],
) {
  const tabs = inject(TABS_INJECTION_KEY, null);

  if (!tabs) {
    throw new Error("TabItem must be used within a Tabs provider");
  }

  let unregister: undefined | (() => void);

  function register() {
    unregister?.();

    unregister = tabs.value.registerTabItem({
      value: props.value,
      disabled: props.disabled,
      keepMounted: props.keepMounted,
      panel: () => {
        return slots.default?.();
      },
      label:
        props.label ??
        (() => {
          return slots.label?.();
        }),
    });
  }

  onMounted(register);

  watch(
    () =>
      [props.label, props.value, props.disabled, props.keepMounted] as const,
    register,
  );

  onBeforeUnmount(() => {
    unregister?.();
  });
}
