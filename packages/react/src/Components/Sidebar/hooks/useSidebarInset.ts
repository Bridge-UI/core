// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import { sidebarVariantProps as variantProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  SidebarInsetOwnProps,
  SidebarInsetProps,
} from "@/Components/Sidebar/sidebar.types";
import { useSidebar } from "@/Components/Sidebar/SidebarContext";
import { derived, mergePartBind, useBridgeUIComponent } from "@/Utils";

const sidebarInsetBridgeKeys = [
  "classes",
  "customProps",
] as const satisfies readonly (keyof SidebarInsetOwnProps)[];

export function useSidebarInset(props: SidebarInsetProps) {
  const sidebar = useSidebar();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    SidebarInsetProps,
    typeof sidebarInsetBridgeKeys
  >({
    props,
    bridgeKeys: sidebarInsetBridgeKeys,
  });

  const { merged, entry: bridgeSidebar } = useBridgeUIComponent<
    SidebarInsetOwnProps,
    "Sidebar"
  >({
    props: componentProps,
    componentName: "Sidebar",
  });

  const children = derived(() => {
    return props.children;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children"]);
  });

  const customProps = derived(() => {
    return merged.customProps as SidebarInsetOwnProps["customProps"];
  });

  const variantItem = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeSidebar?.tokens?.variant,
    );

    return get(classes, sidebar.variant);
  }, [sidebar.variant, bridgeSidebar?.tokens?.variant]);

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      className: cn({
        [get(variantItem, "inset") ?? ""]: true,
        [get(merged.classes, "root") ?? ""]: true,
      }),
    });
  });

  return {
    merged,
    children,
    rootBind,
  };
}
