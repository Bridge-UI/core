// ** External Imports
import { get, omit } from "es-toolkit/compat";

// ** Core Imports
import { getTabId, getTabPanelId } from "@bridge-ui/core/Domain";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  TabPanelOwnProps,
  TabPanelProps,
} from "@/Components/TabPanel/tabPanel.types";
import { useTabsContext } from "@/Components/Tabs/TabsContext";
import {
  derived,
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

export function useTabPanel(props: TabPanelProps) {
  const tabs = useTabsContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    TabPanelProps,
    typeof tabPanelBridgeKeys
  >({
    props,
    bridgeKeys: tabPanelBridgeKeys,
  });

  const { merged, entry: bridgeTabPanel } = useBridgeUIComponent<
    TabPanelOwnProps,
    "TabPanel"
  >({
    props: componentProps,
    componentName: "TabPanel",
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

  const selected = derived(() => {
    return tabs.selected === value;
  });

  const keepMounted = derived(() => {
    return merged.keepMounted ?? tabs.keepMounted;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeTabPanel,
    props: componentProps,
  });

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      role: "tabpanel",
      hidden: !selected,
      tabIndex: selected ? 0 : -1,
      id: getTabPanelId(tabs.id, value),
      "aria-labelledby": getTabId(tabs.id, value),
      className: cn({
        [tabs.tokenClasses.panelSize ?? ""]: true,
        [tabs.tokenClasses.panelOrientation ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  return {
    merged,
    children,
    rootBind,
    selected,
    keepMounted,
  };
}
