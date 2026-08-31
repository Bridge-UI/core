// ** Core Imports
import { isSidebarIconOnly } from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useSidebar } from "@/Components/Sidebar/SidebarContext";
import { useSidebarListContext } from "@/Components/Sidebar/SidebarListContext";
import type { SidebarListProps } from "@/Components/Sidebar/sidebar.types";
import { derived } from "@/Utils";

/**
 * Binds icon-rail mode and applies nav chrome.
 */
export function useSidebarList(
  props: Pick<SidebarListProps, "nested" | "iconOnly">,
) {
  const sidebar = useSidebar();
  const parent = useSidebarListContext();

  const iconOnly = derived(() => {
    if (props.iconOnly !== undefined) {
      return props.iconOnly === true;
    }

    if (parent) {
      return parent.iconOnly;
    }

    return isSidebarIconOnly({
      state: sidebar.state,
      isMobile: sidebar.isMobile,
      collapsible: sidebar.collapsible,
    });
  });

  const rootClassName = derived(() => {
    return cn({
      "flex flex-col gap-1": true,
      "px-2": props.nested !== true,
      "ml-3.5 translate-x-px border-l border-dark-200 py-0.5 pl-2.5 dark:border-dark-700":
        props.nested === true,
      hidden: props.nested === true && iconOnly,
    });
  });

  return { iconOnly, rootClassName };
}
