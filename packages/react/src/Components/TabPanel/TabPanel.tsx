// ** Local Imports
import { useTabPanel } from "@/Components/TabPanel/hooks/useTabPanel";
import type { TabPanelProps } from "@/Components/TabPanel/tabPanel.types";

function TabPanel(props: TabPanelProps) {
  const { children, rootBind, selected, keepMounted } = useTabPanel(props);

  if (!selected && !keepMounted) {
    return null;
  }

  return <div {...rootBind}>{children}</div>;
}

export default TabPanel;
