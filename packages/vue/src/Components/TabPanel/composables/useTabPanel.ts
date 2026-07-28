// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, getCurrentInstance, inject, useAttrs } from "vue";

// ** Core Imports
import {
  cn,
  getTabId,
  getTabPanelId,
  splitComponentProps,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  TabPanelOwnProps,
  TabPanelProps,
} from "@/Components/TabPanel/tabPanel.types";
import { TABS_INJECTION_KEY } from "@/Components/Tabs/tabsInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const tabPanelBridgeKeys = [
  "value",
  "classes",
  "customProps",
  "keepMounted",
] as const satisfies readonly (keyof TabPanelOwnProps)[];

export function useTabPanel(props: TabPanelOwnProps) {
  const attrs = useAttrs();

  const injectedTabsContext = inject(TABS_INJECTION_KEY, null);

  if (!injectedTabsContext) {
    throw new Error("TabPanel must be used within a Tabs provider");
  }

  const tabsContextRef = injectedTabsContext;

  const split = computed(() => {
    return splitComponentProps<TabPanelProps, typeof tabPanelBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: tabPanelBridgeKeys,
    });
  });

  const { merged, entry: bridgeTabPanel } = useBridgeUIComponent<
    TabPanelOwnProps,
    "TabPanel"
  >({
    componentName: "TabPanel",
    props: () => split.value.componentProps,
  });

  const value = computed(() => merged.value.value);
  const selected = computed(
    () => tabsContextRef.value.selected === value.value,
  );

  const keepMounted = computed(() => {
    const vnodeProps = getCurrentInstance()?.vnode.props ?? {};

    if ("keepMounted" in vnodeProps) {
      return merged.value.keepMounted === true;
    }

    return tabsContextRef.value.keepMounted;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeTabPanel,
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => merged.value.customProps);

  const rootBind = computed(() => {
    const tabs = tabsContextRef.value;

    return mergePartBind(customProps.value?.root, split.value.inheritedAttrs, {
      tabindex: 0,
      role: "tabpanel",
      hidden: !selected.value,
      id: getTabPanelId(tabs.id, value.value),
      "aria-labelledby": getTabId(tabs.id, value.value),
      class: cn({
        [tabs.tokenClasses.panelSize ?? ""]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    });
  });

  return {
    merged,
    rootBind,
    selected,
    keepMounted,
  };
}
