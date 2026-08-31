// ** Local Imports
import { List } from "@/Components/List";
import { useSidebarList } from "@/Components/Sidebar/hooks/useSidebarList";
import type { SidebarListProps } from "@/Components/Sidebar/sidebar.types";

function SidebarList({ iconOnly: iconOnlyProp, ...props }: SidebarListProps) {
  const { iconOnly } = useSidebarList({ iconOnly: iconOnlyProp });

  return <List {...props} iconOnly={iconOnly} />;
}

export default SidebarList;
