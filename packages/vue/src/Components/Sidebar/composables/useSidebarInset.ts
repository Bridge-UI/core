// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

// ** Core Imports
import { sidebarVariantProps as variantProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useSidebar } from "@/Components/Sidebar/composables/useSidebar";
import type {
  SidebarInsetOwnProps,
  SidebarInsetProps,
} from "@/Components/Sidebar/sidebar.types";
import { mergePartBind, useBridgeUIComponent } from "@/Utils";

const sidebarInsetBridgeKeys = [
  "classes",
  "customProps",
] as const satisfies readonly (keyof SidebarInsetOwnProps)[];

export function useSidebarInset(props: SidebarInsetOwnProps) {
  const sidebar = useSidebar();
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<
      SidebarInsetProps,
      typeof sidebarInsetBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: sidebarInsetBridgeKeys,
    });
  });

  const { merged, entry: bridgeSidebar } = useBridgeUIComponent<
    SidebarInsetOwnProps,
    "Sidebar"
  >({
    componentName: "Sidebar",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps as SidebarInsetOwnProps["customProps"];
  });

  const variantItem = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeSidebar.value?.tokens?.variant,
    );

    return get(classes, sidebar.value.variant);
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, []);
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, rootInheritedAttrs.value, {
      class: cn({
        [get(variantItem.value, "inset") ?? ""]: true,
        [get(merged.value.classes, "root") ?? ""]: true,
      }),
    });
  });

  return {
    merged,
    rootBind,
  };
}
