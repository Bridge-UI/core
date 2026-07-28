// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useEffect, type KeyboardEvent, type MouseEvent } from "react";

// ** Core Imports
import {
  cn,
  getTabId,
  getTabPanelId,
  splitComponentProps,
} from "@bridge-ui/core";

// ** Local Imports
import type { TabOwnProps, TabProps } from "@/Components/Tab/tab.types";
import { useTabsContext } from "@/Components/Tabs/TabsContext";
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

export function useTab(props: TabProps) {
  const tabs = useTabsContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    TabProps,
    typeof tabBridgeKeys
  >({
    props,
    bridgeKeys: tabBridgeKeys,
  });

  const { merged, entry: bridgeTab } = useBridgeUIComponent<TabOwnProps, "Tab">(
    {
      componentName: "Tab",
      props: componentProps,
    },
  );

  const value = merged.value;
  const disabled = merged.disabled === true;
  const selected = tabs.selected === value;

  useEffect(() => {
    return tabs.registerTab(value, disabled);
  }, [value, disabled, tabs.registerTab]);

  const rootInheritedAttrs = omit(inheritedAttrs, ["children"]);

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeTab,
    props: componentProps,
  });

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }

    tabs.setSelected(value);
    rootInheritedAttrs.onClick?.(event);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (
      tabs.activation === "manual" &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();

      if (!disabled) {
        tabs.setSelected(value);
      }
    }

    rootInheritedAttrs.onKeyDown?.(event);
  }

  const customProps = merged.customProps;

  const rootBind = mergePartBind(customProps?.root, rootInheritedAttrs, {
    disabled,
    role: "tab",
    type: "button",
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    "aria-selected": selected,
    tabIndex: selected ? 0 : -1,
    id: getTabId(tabs.id, value),
    "aria-controls": getTabPanelId(tabs.id, value),
    className: cn({
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:pointer-events-none disabled:opacity-50": true,
      [tabs.tokenClasses.tabSize ?? ""]: true,
      [tabs.tokenClasses.tabVariant ?? ""]: true,
      [tabs.tokenClasses.tabVariantSelected ?? ""]: selected,
      [tabs.tokenClasses.colorSelected ?? ""]: selected,
      [get(mergedClasses, "root") ?? ""]: true,
    }),
  });

  return {
    merged,
    rootBind,
    children: props.children,
  };
}
