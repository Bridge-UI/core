// ** Local Imports
import { ListItem } from "@/Components/ListItem";
import { useSidebarListItem } from "@/Components/Sidebar/hooks/useSidebarListItem";
import type { SidebarListItemProps } from "@/Components/Sidebar/sidebar.types";

function SidebarListItem(props: SidebarListItemProps) {
  const { tooltip, tooltipPlacement } = useSidebarListItem(props);

  return (
    <ListItem
      {...props}
      tooltip={tooltip}
      tooltipPlacement={tooltipPlacement}
    />
  );
}

export default SidebarListItem;
