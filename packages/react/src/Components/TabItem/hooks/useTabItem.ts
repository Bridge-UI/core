// ** External Imports
import { useEffect } from "react";

// ** Local Imports
import type { TabItemProps } from "@/Components/TabItem/tabItem.types";
import { useTabsContext } from "@/Components/Tabs/TabsContext";

export function useTabItem(props: TabItemProps) {
  const tabs = useTabsContext();

  useEffect(() => {
    return tabs.registerTabItem({
      value: props.value,
      label: props.label,
      panel: props.children,
      disabled: props.disabled,
      keepMounted: props.keepMounted,
    });
  }, [
    tabs.registerTabItem,
    props.value,
    props.label,
    props.children,
    props.disabled,
    props.keepMounted,
  ]);
}
