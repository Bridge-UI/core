// ** Core Imports
import { isSidebarIconOnly } from "@bridge-ui/core/Domain";

// ** Local Imports
import type { SidebarListProps } from "@/Components/Sidebar/sidebar.types";
import { useSidebar } from "@/Components/Sidebar/SidebarContext";

/**
 * Binds `List` `iconOnly` to the nearest icon rail.
 */
export function useSidebarList(props: Pick<SidebarListProps, "iconOnly">) {
  const sidebar = useSidebar();
  const iconOnly =
    props.iconOnly ??
    isSidebarIconOnly(sidebar.isMobile, sidebar.collapsible, sidebar.state);

  return { iconOnly };
}
