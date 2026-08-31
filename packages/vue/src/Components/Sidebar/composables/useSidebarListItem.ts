// ** External Imports
import { computed } from "vue";

// ** Core Imports
import {
  isSidebarIconOnly,
  resolveSidebarListTooltipPlacement,
} from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useSidebar } from "@/Components/Sidebar/composables/useSidebar";
import type { SidebarListItemProps } from "@/Components/Sidebar/sidebar.types";
import { isPropPresent } from "@/Utils";

/**
 * Tooltip and nav chrome for a rail item.
 */
export function useSidebarListItem(
  props: Pick<
    SidebarListItemProps,
    "primary" | "tooltip" | "secondary" | "tooltipPlacement"
  >,
) {
  const sidebar = useSidebar();

  const tooltip = computed(() => {
    if (props.tooltip !== undefined) {
      return props.tooltip;
    }

    const iconOnly = isSidebarIconOnly({
      state: sidebar.value.state,
      isMobile: sidebar.value.isMobile,
      collapsible: sidebar.value.collapsible,
    });

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

  const itemClasses = computed(() => {
    const iconOnly = isSidebarIconOnly({
      state: sidebar.value.state,
      isMobile: sidebar.value.isMobile,
      collapsible: sidebar.value.collapsible,
    });
    const hasSecondary = isPropPresent(props.secondary);

    return {
      start: cn({
        "items-center justify-center": true,
      }),
      interactive: cn({
        "gap-x-2 overflow-hidden rounded-lg px-2 transition-[width,height,padding] duration-200 ease-linear":
          !iconOnly,
        "min-h-12 py-2": !iconOnly && hasSecondary,
        "min-h-8 py-0": !iconOnly && !hasSecondary,
      }),
    };
  });

  return { tooltip, itemClasses, tooltipPlacement };
}
