// ** External Imports
import { computed, getCurrentInstance } from "vue";

// ** Core Imports
import { isSidebarIconOnly } from "@bridge-ui/core/Domain";

// ** Local Imports
import type { ListOwnProps } from "@/Components/List/list.types";
import { useSidebar } from "@/Components/Sidebar/composables/useSidebar";

/**
 * Binds `List` `iconOnly` to the nearest icon rail.
 */
export function useSidebarList(props: Pick<ListOwnProps, "iconOnly">) {
  const sidebar = useSidebar();
  const instance = getCurrentInstance();

  const iconOnly = computed(() => {
    const vnodeProps = instance?.vnode.props ?? {};

    if ("iconOnly" in vnodeProps || "icon-only" in vnodeProps) {
      return props.iconOnly === true;
    }

    return isSidebarIconOnly(
      sidebar.value.isMobile,
      sidebar.value.collapsible,
      sidebar.value.state,
    );
  });

  return { iconOnly };
}
