// ** External Imports
import { get, omit } from "es-toolkit/compat";
import type { KeyboardEvent } from "react";

// ** Core Imports
import { getAdjacentTabValue, getTabId } from "@bridge-ui/core/Domain";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  TabListOwnProps,
  TabListProps,
} from "@/Components/TabList/tabList.types";
import { useTabsContext } from "@/Components/Tabs/TabsContext";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const tabListBridgeKeys = [
  "classes",
  "customProps",
] as const satisfies readonly (keyof TabListOwnProps)[];

export function useTabList(props: TabListProps) {
  const tabs = useTabsContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    TabListProps,
    typeof tabListBridgeKeys
  >({
    props,
    bridgeKeys: tabListBridgeKeys,
  });

  const { merged, entry: bridgeTabList } = useBridgeUIComponent<
    TabListOwnProps,
    "TabList"
  >({
    props: componentProps,
    componentName: "TabList",
  });

  const children = derived(() => {
    return props.children;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeTabList,
    props: componentProps,
  });

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const {
      id,
      selected,
      focusTab,
      tabValues,
      activation,
      orientation,
      setSelected,
      disabledValues,
    } = tabs;

    const horizontal = orientation === "horizontal";
    const nextKey = horizontal ? "ArrowRight" : "ArrowDown";
    const prevKey = horizontal ? "ArrowLeft" : "ArrowUp";

    const activeId =
      typeof document !== "undefined" ? document.activeElement?.id : undefined;
    const focused =
      tabValues.find((value) => getTabId(id, value) === activeId) ?? selected;

    if (event.key === nextKey || event.key === prevKey) {
      event.preventDefault();

      const direction = event.key === nextKey ? 1 : -1;
      const next = getAdjacentTabValue(
        tabValues,
        focused,
        direction,
        new Set(disabledValues),
      );

      focusTab(next);

      if (activation === "automatic") {
        setSelected(next);
      }

      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      const first =
        tabValues.find((value) => !disabledValues.includes(value)) ?? selected;

      focusTab(first);

      if (activation === "automatic") {
        setSelected(first);
      }

      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const last =
        [...tabValues]
          .reverse()
          .find((value) => !disabledValues.includes(value)) ?? selected;

      focusTab(last);

      if (activation === "automatic") {
        setSelected(last);
      }
    }
  }

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      role: "tablist",
      onKeyDown: handleKeyDown,
      "aria-orientation": tabs.orientation,
      className: cn({
        flex: true,
        [tabs.tokenClasses.listOrientation ?? ""]: true,
        [tabs.tokenClasses.listSize ?? ""]: true,
        [tabs.tokenClasses.listVariant ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  return {
    merged,
    children,
    rootBind,
  };
}
