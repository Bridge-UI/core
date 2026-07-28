// ** Local Imports
import { useTab } from "@/Components/Tab/hooks/useTab";
import type { TabProps } from "@/Components/Tab/tab.types";

function Tab(props: TabProps) {
  const { children, rootBind } = useTab(props);

  return <button {...rootBind}>{children}</button>;
}

export default Tab;
