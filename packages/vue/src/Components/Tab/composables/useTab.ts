// ** External Imports
import { get } from "es-toolkit/compat";
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  useAttrs,
  watch,
} from "vue";

// ** Core Imports
import {
  cn,
  getTabId,
  getTabPanelId,
  splitComponentProps,
} from "@bridge-ui/core";

// ** Local Imports
import type { TabOwnProps, TabProps } from "@/Components/Tab/tab.types";
import { TABS_INJECTION_KEY } from "@/Components/Tabs/tabsInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const tabBridgeKeys = [
  "value",
  "classes",
  "disabled",
  "customProps",
] as const satisfies readonly (keyof TabOwnProps)[];

export function useTab(props: TabOwnProps) {
  const attrs = useAttrs();

  const injectedTabsContext = inject(TABS_INJECTION_KEY, null);

  if (!injectedTabsContext) {
    throw new Error("Tab must be used within a Tabs provider");
  }

  const tabsContextRef = injectedTabsContext;

  const split = computed(() => {
    return splitComponentProps<TabProps, typeof tabBridgeKeys>({
      bridgeKeys: tabBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeTab } = useBridgeUIComponent<TabOwnProps, "Tab">(
    {
      componentName: "Tab",
      props: () => split.value.componentProps,
    },
  );

  const value = computed(() => merged.value.value);
  const disabled = computed(() => merged.value.disabled === true);
  const selected = computed(
    () => tabsContextRef.value.selected === value.value,
  );

  let unregister: null | (() => void) = null;

  function syncRegistration() {
    unregister?.();
    unregister = tabsContextRef.value.registerTab(value.value, disabled.value);
  }

  onMounted(syncRegistration);

  watch([value, disabled], syncRegistration);

  onBeforeUnmount(() => {
    unregister?.();
    unregister = null;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeTab,
    props: () => split.value.componentProps,
  });

  function handleClick(event: PointerEvent) {
    if (disabled.value) {
      return;
    }

    tabsContextRef.value.setSelected(value.value);
    split.value.inheritedAttrs.onClick?.(event);
  }

  function handleKeydown(event: KeyboardEvent) {
    const tabs = tabsContextRef.value;

    if (
      tabs.activation === "manual" &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();

      if (!disabled.value) {
        tabs.setSelected(value.value);
      }
    }

    split.value.inheritedAttrs.onKeydown?.(event);
  }

  const customProps = computed(() => merged.value.customProps);

  const rootBind = computed(() => {
    const tabs = tabsContextRef.value;

    return mergePartBind(customProps.value?.root, split.value.inheritedAttrs, {
      role: "tab",
      type: "button",
      onClick: handleClick,
      disabled: disabled.value,
      onKeydown: handleKeydown,
      "aria-selected": selected.value,
      tabindex: selected.value ? 0 : -1,
      id: getTabId(tabs.id, value.value),
      "aria-controls": getTabPanelId(tabs.id, value.value),
      class: cn({
        "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:pointer-events-none disabled:opacity-50": true,
        [tabs.tokenClasses.tabSize ?? ""]: true,
        [tabs.tokenClasses.tabVariant ?? ""]: true,
        [tabs.tokenClasses.tabVariantSelected ?? ""]: selected.value,
        [tabs.tokenClasses.colorSelected ?? ""]: selected.value,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    });
  });

  return {
    merged,
    rootBind,
    selected,
  };
}
