// ** External Imports
import { get, omit } from "es-toolkit/compat";

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
import { useTabsContext } from "@/Components/Tabs/TabsContext";
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

  const value = merged.value;
  const selected = tabs.selected === value;
  const keepMounted = merged.keepMounted ?? tabs.keepMounted;

  const rootInheritedAttrs = omit(inheritedAttrs, ["children"]);

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeTabPanel,
    props: componentProps,
  });

  const customProps = merged.customProps;

  const rootBind = mergePartBind(customProps?.root, rootInheritedAttrs, {
    tabIndex: 0,
    role: "tabpanel",
    hidden: !selected,
    id: getTabPanelId(tabs.id, value),
    "aria-labelledby": getTabId(tabs.id, value),
    className: cn({
      [tabs.tokenClasses.panelSize ?? ""]: true,
      [get(mergedClasses, "root") ?? ""]: true,
    }),
  });

  return {
    merged,
    rootBind,
    selected,
    keepMounted,
    children: props.children,
  };
}
