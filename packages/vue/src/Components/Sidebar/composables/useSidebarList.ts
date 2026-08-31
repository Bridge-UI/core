// ** External Imports
import { computed, getCurrentInstance, inject, provide } from "vue";

// ** Core Imports
import { isSidebarIconOnly } from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useSidebar } from "@/Components/Sidebar/composables/useSidebar";
import type { SidebarListProps } from "@/Components/Sidebar/sidebar.types";
import { SIDEBAR_LIST_INJECTION_KEY } from "@/Components/Sidebar/sidebarListInjectionKey";

/**
 * Binds icon-rail mode and applies nav chrome.
 */
export function useSidebarList(
  props: Pick<SidebarListProps, "nested" | "iconOnly">,
) {
  const sidebar = useSidebar();
  const instance = getCurrentInstance();
  const parent = inject(SIDEBAR_LIST_INJECTION_KEY, null);

  const iconOnly = computed(() => {
    const vnodeProps = instance?.vnode.props ?? {};

    if ("iconOnly" in vnodeProps || "icon-only" in vnodeProps) {
      return props.iconOnly === true;
    }

    if (parent) {
      return parent.value.iconOnly;
    }

    return isSidebarIconOnly({
      state: sidebar.value.state,
      isMobile: sidebar.value.isMobile,
      collapsible: sidebar.value.collapsible,
    });
  });

  provide(
    SIDEBAR_LIST_INJECTION_KEY,
    computed(() => {
      return { iconOnly: iconOnly.value };
    }),
  );

  const rootClassName = computed(() => {
    return cn({
      "flex flex-col gap-1": true,
      "px-2": props.nested !== true,
      "ml-3.5 translate-x-px border-l border-dark-200 py-0.5 pl-2.5 dark:border-dark-700":
        props.nested === true,
      hidden: props.nested === true && iconOnly.value,
    });
  });

  return { iconOnly, rootClassName };
}
