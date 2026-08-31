// ** External Imports
import { computed } from "vue";

// ** Core Imports
import {
  isSidebarIconOnly,
  resolveSidebarListTooltipPlacement,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import type { ListItemOwnProps } from "@/Components/ListItem/listItem.types";
import { useSidebar } from "@/Components/Sidebar/composables/useSidebar";

/**
 * Tooltip for a rail item when the icon rail is collapsed.
 */
export function useSidebarListItem(
  props: Pick<ListItemOwnProps, "primary" | "tooltip" | "tooltipPlacement">,
) {
  const sidebar = useSidebar();

  const tooltip = computed(() => {
    if (props.tooltip !== undefined) {
      return props.tooltip;
    }

    const iconOnly = isSidebarIconOnly(
      sidebar.value.isMobile,
      sidebar.value.collapsible,
      sidebar.value.state,
    );

    if (!iconOnly || typeof props.primary !== "string") {
      return undefined;
    }

    return props.primary;
  });

  const tooltipPlacement = computed(() => {
    if (props.tooltipPlacement !== undefined) {
      return props.tooltipPlacement;
    }

    return resolveSidebarListTooltipPlacement(sidebar.value.side);
  });

  return { tooltip, tooltipPlacement };
}
