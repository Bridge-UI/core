// ** External Imports
import { omit } from "es-toolkit/compat";
import type { MouseEvent } from "react";

// ** Core Imports
import { splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  SidebarTriggerOwnProps,
  SidebarTriggerProps,
} from "@/Components/Sidebar/sidebar.types";
import { useSidebar } from "@/Components/Sidebar/SidebarContext";
import { derived } from "@/Utils";

const sidebarTriggerBridgeKeys = [
  "children",
] as const satisfies readonly (keyof SidebarTriggerOwnProps)[];

export function useSidebarTrigger(props: SidebarTriggerProps) {
  const sidebar = useSidebar();

  const { inheritedAttrs } = splitComponentProps<
    SidebarTriggerProps,
    typeof sidebarTriggerBridgeKeys
  >({
    props,
    bridgeKeys: sidebarTriggerBridgeKeys,
  });

  const children = derived(() => {
    return props.children;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children", "onClick"]);
  });

  const expanded = derived(() => {
    return sidebar.isMobile ? sidebar.openMobile : sidebar.open;
  });

  const handleClick = derived(() => {
    return (event: MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(event);

      if (event.defaultPrevented) {
        return;
      }

      sidebar.toggleSidebar();
    };
  });

  return {
    children,
    expanded,
    handleClick,
    side: sidebar.side,
    rootInheritedAttrs,
    panelId: sidebar.panelId,
  };
}
