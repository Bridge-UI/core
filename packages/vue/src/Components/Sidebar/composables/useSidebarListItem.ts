// ** External Imports
import { computed, inject } from "vue";

// ** Core Imports
import {
  isSidebarIconOnly,
  resolveSidebarListTooltipPlacement,
} from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useSidebar } from "@/Components/Sidebar/composables/useSidebar";
import type { SidebarListItemProps } from "@/Components/Sidebar/sidebar.types";
import { SIDEBAR_LIST_INJECTION_KEY } from "@/Components/Sidebar/sidebarListInjectionKey";
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
  const list = inject(SIDEBAR_LIST_INJECTION_KEY, null);

  const iconOnly = computed(() => {
    if (list) {
      return list.value.iconOnly;
    }

    return isSidebarIconOnly({
      state: sidebar.value.state,
      isMobile: sidebar.value.isMobile,
      collapsible: sidebar.value.collapsible,
    });
  });

  const tooltip = computed(() => {
    if (!iconOnly.value) {
      return undefined;
    }

    if (props.tooltip !== undefined) {
      return props.tooltip || undefined;
    }

    if (typeof props.primary !== "string") {
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

  const accessibleName = computed(() => {
    if (!iconOnly.value || typeof props.primary !== "string") {
      return undefined;
    }

    return props.primary;
  });

  const itemClasses = computed(() => {
    const hasSecondary = isPropPresent(props.secondary);

    return {
      end: cn({
        hidden: iconOnly.value,
      }),
      content: cn({
        hidden: iconOnly.value,
      }),
      start: cn({
        "items-center justify-center": true,
      }),
      interactive: cn({
        "gap-x-2 overflow-hidden rounded-lg px-2 transition-[width,height,padding] duration-200 ease-linear":
          !iconOnly.value,
        "min-h-12 py-2": !iconOnly.value && hasSecondary,
        "min-h-8 py-0": !iconOnly.value && !hasSecondary,
        "gap-0 overflow-hidden rounded-lg p-0": iconOnly.value,
        "size-8 justify-center": iconOnly.value && hasSecondary,
        "h-8 w-full px-2": iconOnly.value && !hasSecondary,
      }),
    };
  });

  return { tooltip, itemClasses, accessibleName, tooltipPlacement };
}
