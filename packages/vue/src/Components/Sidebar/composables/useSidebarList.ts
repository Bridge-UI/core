// ** External Imports
import { computed, getCurrentInstance } from "vue";

// ** Core Imports
import { isSidebarIconOnly } from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ListOwnProps } from "@/Components/List/list.types";
import { useSidebar } from "@/Components/Sidebar/composables/useSidebar";

/**
 * Binds `List` `iconOnly` to the nearest icon rail and applies nav chrome.
 */
export function useSidebarList(
  props: Pick<ListOwnProps, "nested" | "iconOnly">,
) {
  const sidebar = useSidebar();
  const instance = getCurrentInstance();

  const iconOnly = computed(() => {
    const vnodeProps = instance?.vnode.props ?? {};

    if ("iconOnly" in vnodeProps || "icon-only" in vnodeProps) {
      return props.iconOnly === true;
    }

    return isSidebarIconOnly({
      state: sidebar.value.state,
      isMobile: sidebar.value.isMobile,
      collapsible: sidebar.value.collapsible,
    });
  });

  const rootClassName = computed(() => {
    return cn({
      "flex flex-col gap-1": true,
      "px-2": props.nested !== true,
      "ml-3.5 translate-x-px border-l border-dark-200 py-0.5 pl-2.5 dark:border-dark-700":
        props.nested === true,
    });
  });

  return { iconOnly, rootClassName };
}
