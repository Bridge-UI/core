// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, inject, useAttrs } from "vue";

// ** Core Imports
import { getAdjacentTabValue, getTabId } from "@bridge-ui/core/Domain";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  TabListOwnProps,
  TabListProps,
} from "@/Components/TabList/tabList.types";
import { TABS_INJECTION_KEY } from "@/Components/Tabs/tabsInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const tabListBridgeKeys = [
  "classes",
  "customProps",
] as const satisfies readonly (keyof TabListOwnProps)[];

export function useTabList(props: TabListOwnProps) {
  const attrs = useAttrs();

  const injectedTabsContext = inject(TABS_INJECTION_KEY, null);

  if (!injectedTabsContext) {
    throw new Error("TabList must be used within a Tabs provider");
  }

  const tabsContextRef = injectedTabsContext;

  const split = computed(() => {
    return splitComponentProps<TabListProps, typeof tabListBridgeKeys>({
      bridgeKeys: tabListBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeTabList } = useBridgeUIComponent<
    TabListOwnProps,
    "TabList"
  >({
    componentName: "TabList",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeTabList,
    props: () => split.value.componentProps,
  });

  function handleKeydown(event: KeyboardEvent) {
    const tabs = tabsContextRef.value;

    const horizontal = tabs.orientation === "horizontal";
    const nextKey = horizontal ? "ArrowRight" : "ArrowDown";
    const prevKey = horizontal ? "ArrowLeft" : "ArrowUp";

    const activeId =
      typeof document !== "undefined" ? document.activeElement?.id : undefined;
    const focused =
      tabs.tabValues.find((value) => getTabId(tabs.id, value) === activeId) ??
      tabs.selected;

    if (event.key === nextKey || event.key === prevKey) {
      event.preventDefault();

      const direction = event.key === nextKey ? 1 : -1;
      const next = getAdjacentTabValue(
        tabs.tabValues,
        focused,
        direction,
        new Set(tabs.disabledValues),
      );

      tabs.focusTab(next);

      if (tabs.activation === "automatic") {
        tabs.setSelected(next);
      }

      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      const first =
        tabs.tabValues.find((value) => !tabs.disabledValues.includes(value)) ??
        tabs.selected;

      tabs.focusTab(first);

      if (tabs.activation === "automatic") {
        tabs.setSelected(first);
      }

      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const last =
        [...tabs.tabValues]
          .reverse()
          .find((value) => !tabs.disabledValues.includes(value)) ??
        tabs.selected;

      tabs.focusTab(last);

      if (tabs.activation === "automatic") {
        tabs.setSelected(last);
      }
    }
  }

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const rootBind = computed(() => {
    const tabs = tabsContextRef.value;

    return mergePartBind(customProps.value?.root, split.value.inheritedAttrs, {
      role: "tablist",
      onKeydown: handleKeydown,
      "aria-orientation": tabs.orientation,
      class: cn({
        flex: true,
        [tabs.tokenClasses.listOrientation ?? ""]: true,
        [tabs.tokenClasses.listSize ?? ""]: true,
        [tabs.tokenClasses.listVariant ?? ""]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    });
  });

  return {
    merged,
    rootBind,
  };
}
