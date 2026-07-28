// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useEffect, type KeyboardEvent, type MouseEvent } from "react";

// ** Core Imports
import {
  cn,
  getTabId,
  getTabPanelId,
  splitComponentProps,
  type IconSize,
} from "@bridge-ui/core";

// ** Local Imports
import type { TabOwnProps, TabProps } from "@/Components/Tab/tab.types";
import { useTabsContext } from "@/Components/Tabs/TabsContext";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const tabBridgeKeys = [
  "slots",
  "value",
  "classes",
  "endIcon",
  "disabled",
  "startIcon",
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

  const slots = derived(() => {
    return props.slots;
  });

  const children = derived(() => {
    return props.children;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const value = derived(() => {
    return merged.value;
  });

  const disabled = derived(() => {
    return merged.disabled === true;
  });

  const selected = derived(() => {
    return tabs.selected === value;
  });

  const iconSize = derived(() => {
    return (tabs.tokenClasses.iconSize ?? "md") as keyof IconSize;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "children"]);
  });

  useEffect(() => {
    return tabs.registerTab(value, disabled);
  }, [value, disabled, tabs.registerTab]);

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

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
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
        "inline-flex cursor-pointer items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:pointer-events-none disabled:opacity-50": true,
        [tabs.tokenClasses.iconGap ?? ""]: true,
        [tabs.tokenClasses.tabSize ?? ""]: true,
        [tabs.tokenClasses.tabVariant ?? ""]: true,
        [tabs.tokenClasses.tabOrientation ?? ""]: true,
        [tabs.tokenClasses.tabVariantSelected ?? ""]: selected,
        [tabs.tokenClasses.colorSelected ?? ""]: selected,
        [tabs.tokenClasses.colorSelectedSoft ?? ""]:
          selected && tabs.tokenClasses.softFill === true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const endIconBind = derived(() => {
    return mergePartBind(
      customProps?.endIcon,
      {},
      cn({
        "shrink-0": true,
        [get(mergedClasses, "endIcon") ?? ""]: true,
      }),
    );
  });

  const endSlotBind = derived(() => {
    return mergePartBind(
      customProps?.end,
      {},
      "inline-flex shrink-0 items-center",
    );
  });

  const startIconBind = derived(() => {
    return mergePartBind(
      customProps?.startIcon,
      {},
      cn({
        "shrink-0": true,
        [get(mergedClasses, "startIcon") ?? ""]: true,
      }),
    );
  });

  const startSlotBind = derived(() => {
    return mergePartBind(
      customProps?.start,
      {},
      "inline-flex shrink-0 items-center",
    );
  });

  return {
    slots,
    merged,
    children,
    iconSize,
    rootBind,
    endIconBind,
    endSlotBind,
    startIconBind,
    startSlotBind,
  };
}
