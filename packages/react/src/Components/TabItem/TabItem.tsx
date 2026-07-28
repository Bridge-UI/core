// ** Local Imports
import { useTabItem } from "@/Components/TabItem/hooks/useTabItem";
import type { TabItemProps } from "@/Components/TabItem/tabItem.types";

/**
 * Registers a tab + panel with the parent `Tabs`. Renders nothing.
 */
function TabItem(props: TabItemProps) {
  useTabItem(props);

  return null;
}

export default TabItem;
