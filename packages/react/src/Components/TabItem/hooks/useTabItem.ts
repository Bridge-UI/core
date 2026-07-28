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
      slots: props.slots,
      panel: props.children,
      endIcon: props.endIcon,
      disabled: props.disabled,
      startIcon: props.startIcon,
      keepMounted: props.keepMounted,
    });
  }, [
    props.value,
    props.label,
    props.slots,
    props.endIcon,
    props.children,
    props.disabled,
    props.startIcon,
    props.keepMounted,
    tabs.registerTabItem,
  ]);
}
