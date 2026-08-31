// ** Core Imports
import {
  isSidebarIconOnly,
  resolveSidebarListTooltipPlacement,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import type { SidebarListItemProps } from "@/Components/Sidebar/sidebar.types";
import { useSidebar } from "@/Components/Sidebar/SidebarContext";

/**
 * Tooltip for a rail item when the icon rail is collapsed.
 */
export function useSidebarListItem(
  props: Pick<SidebarListItemProps, "primary" | "tooltip" | "tooltipPlacement">,
) {
  const sidebar = useSidebar();
  const iconOnly = isSidebarIconOnly(
    sidebar.isMobile,
    sidebar.collapsible,
    sidebar.state,
  );
  const tooltip =
    props.tooltip ??
    (iconOnly && typeof props.primary === "string" ? props.primary : undefined);
  const tooltipPlacement =
    props.tooltipPlacement ?? resolveSidebarListTooltipPlacement(sidebar.side);

  return { tooltip, tooltipPlacement };
}
