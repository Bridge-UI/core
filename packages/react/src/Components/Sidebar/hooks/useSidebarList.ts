// ** Core Imports
import { isSidebarIconOnly } from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { SidebarListProps } from "@/Components/Sidebar/sidebar.types";
import { useSidebar } from "@/Components/Sidebar/SidebarContext";
import { derived } from "@/Utils";

/**
 * Binds `List` `iconOnly` to the nearest icon rail and applies nav chrome.
 */
export function useSidebarList(
  props: Pick<SidebarListProps, "nested" | "iconOnly">,
) {
  const sidebar = useSidebar();

  const iconOnly = derived(() => {
    return (
      props.iconOnly ??
      isSidebarIconOnly({
        state: sidebar.state,
        isMobile: sidebar.isMobile,
        collapsible: sidebar.collapsible,
      })
    );
  });

  const rootClassName = derived(() => {
    return cn({
      "flex flex-col gap-1": true,
      "px-2": props.nested !== true,
      "ml-3.5 translate-x-px border-l border-dark-200 py-0.5 pl-2.5 dark:border-dark-700":
        props.nested === true,
    });
  });

  return { iconOnly, rootClassName };
}
