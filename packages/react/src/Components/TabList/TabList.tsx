// ** Local Imports
import { useTabList } from "@/Components/TabList/hooks/useTabList";
import type { TabListProps } from "@/Components/TabList/tabList.types";

function TabList(props: TabListProps) {
  const { children, rootBind } = useTabList(props);

  return <div {...rootBind}>{children}</div>;
}

export default TabList;
