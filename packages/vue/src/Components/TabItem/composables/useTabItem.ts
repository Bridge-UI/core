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

  const tabsContextRef = tabs;

  let unregister: undefined | (() => void);

  function register() {
    unregister?.();

    unregister = tabsContextRef.value.registerTabItem({
      value: props.value,
      endIcon: props.endIcon,
      disabled: props.disabled,
      startIcon: props.startIcon,
      keepMounted: props.keepMounted,
      panel: () => {
        return slots.default?.();
      },
      label:
        props.label ??
        (() => {
          return slots.label?.();
        }),
      slots:
        slots.start || slots.end
          ? {
              end: slots.end
                ? () => {
                    return slots.end?.();
                  }
                : undefined,
              start: slots.start
                ? () => {
                    return slots.start?.();
                  }
                : undefined,
            }
          : undefined,
    });
  }

  onMounted(register);

  watch(
    () =>
      [
        props.label,
        props.value,
        props.endIcon,
        props.disabled,
        props.startIcon,
        props.keepMounted,
        Boolean(slots.end),
        Boolean(slots.label),
        Boolean(slots.start),
        Boolean(slots.default),
      ] as const,
    register,
  );

  onBeforeUnmount(() => {
    unregister?.();
  });
}
