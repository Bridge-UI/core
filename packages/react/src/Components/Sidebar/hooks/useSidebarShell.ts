// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { toMerged } from "es-toolkit/object";
import { useId, useLayoutEffect, useMemo } from "react";

// ** Core Imports
import {
  getSidebarPanelId,
  resolveSidebarCollapsibleData,
  shouldRenderSidebarAsDrawer,
} from "@bridge-ui/core/Domain";
import {
  sidebarCollapsibleProps as collapsibleProps,
  sidebarSideProps as sideProps,
  sidebarVariantProps as variantProps,
  sidebarWidthProps as widthProps,
  type SidebarWidth,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  SidebarOwnProps,
  SidebarProps,
} from "@/Components/Sidebar/sidebar.types";
import { useSidebar } from "@/Components/Sidebar/SidebarContext";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const sidebarBridgeKeys = [
  "side",
  "slots",
  "classes",
  "variant",
  "ariaLabel",
  "collapsible",
  "customProps",
] as const satisfies readonly (keyof SidebarOwnProps)[];

type SidebarLibDefaults = LibDefaultsShape<
  SidebarOwnProps,
  "side" | "variant" | "ariaLabel" | "collapsible"
>;

type SidebarMerged = MergeLibDefaults<SidebarOwnProps, SidebarLibDefaults>;

export function useSidebarShell(
  props: SidebarProps,
  libDefaults: SidebarLibDefaults,
) {
  const reactId = useId();
  const panelId = getSidebarPanelId(`bridge-sidebar${reactId}`);
  const sidebar = useSidebar();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    SidebarProps,
    typeof sidebarBridgeKeys
  >({
    props,
    bridgeKeys: sidebarBridgeKeys,
  });

  const { merged, entry: bridgeSidebar } = useBridgeUIComponent<
    SidebarMerged,
    "Sidebar"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Sidebar",
  });

  useLayoutEffect(() => {
    sidebar.setLayout({
      panelId,
      side: merged.side,
      variant: merged.variant,
      collapsible: merged.collapsible,
    });
  }, [
    panelId,
    merged.side,
    merged.variant,
    sidebar.setLayout,
    merged.collapsible,
  ]);

  const slots = derived(() => {
    return props.slots;
  });

  const children = derived(() => {
    return props.children;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "children"]);
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeSidebar,
    props: componentProps,
  });

  const variantItem = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeSidebar?.tokens?.variant,
    );

    return get(classes, merged.variant);
  }, [merged.variant, bridgeSidebar?.tokens?.variant]);

  const collapsibleItem = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      collapsibleProps,
      bridgeSidebar?.tokens?.collapsible,
    );

    return get(classes, merged.collapsible);
  }, [merged.collapsible, bridgeSidebar?.tokens?.collapsible]);

  const sideClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sideProps,
      bridgeSidebar?.tokens?.side,
    );

    return get(classes, merged.side);
  }, [merged.side, bridgeSidebar?.tokens?.side]);

  const collapsibleData = derived(() => {
    return resolveSidebarCollapsibleData(sidebar.state, merged.collapsible);
  });

  const showAsDrawer = derived(() => {
    return shouldRenderSidebarAsDrawer(sidebar.isMobile) && sidebar.openMobile;
  });

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      "data-side": merged.side,
      "data-state": sidebar.state,
      "data-variant": merged.variant,
      "data-collapsible": collapsibleData,
      "data-mobile": sidebar.isMobile ? "true" : "false",
      className: cn({
        "group peer hidden text-dark-900 md:block dark:text-dark-100": true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const gapBind = derived(() => {
    return mergePartBind(
      customProps?.gap,
      {},
      cn({
        [get(variantItem, "gap") ?? ""]: true,
        [get(collapsibleItem, "gap") ?? ""]: true,
        [get(mergedClasses, "gap") ?? ""]: true,
      }),
    );
  });

  const asideBind = derived(() => {
    const offcanvasCollapsed = collapsibleData === "offcanvas";

    return mergePartBind(
      {},
      {},
      {
        "data-side": merged.side,
        "aria-label": merged.ariaLabel,
        id: showAsDrawer ? undefined : panelId,
        inert: offcanvasCollapsed ? true : undefined,
        className: cn({
          "fixed inset-y-0 z-10 hidden h-full w-[var(--bridge-sidebar-width)] overflow-hidden transition-[left,right,width] duration-200 ease-linear md:flex": true,
          [sideClass ?? ""]: true,
          [get(collapsibleItem, "panel") ?? ""]: true,
        }),
      },
    );
  });

  const panelBind = derived(() => {
    return mergePartBind(
      customProps?.panel,
      {},
      cn({
        "flex h-full w-full flex-col overflow-hidden": true,
        [get(variantItem, "panel") ?? ""]: true,
        [get(mergedClasses, "panel") ?? ""]: true,
      }),
    );
  });

  const headerBind = derived(() => {
    return mergePartBind(
      customProps?.header,
      {},
      cn({
        "flex shrink-0 flex-col gap-2 px-2 py-2.5": true,
        [get(mergedClasses, "header") ?? ""]: true,
      }),
    );
  });

  const contentBind = derived(() => {
    return mergePartBind(
      customProps?.content,
      {},
      cn({
        "bridge-scroll-fade-y flex min-h-0 flex-1 flex-col overflow-y-auto": true,
        [get(mergedClasses, "content") ?? ""]: true,
      }),
    );
  });

  const footerBind = derived(() => {
    return mergePartBind(
      customProps?.footer,
      {},
      cn({
        "flex shrink-0 flex-col gap-2 px-2 py-2.5": true,
        [get(mergedClasses, "footer") ?? ""]: true,
      }),
    );
  });

  const mobileWidth = derived(() => {
    const widthItem = toMerged(
      widthProps,
      bridgeSidebar?.tokens?.width ?? {},
    ) as SidebarWidth;

    return widthItem.mobile;
  });

  return {
    slots,
    merged,
    panelId,
    gapBind,
    children,
    rootBind,
    asideBind,
    panelBind,
    headerBind,
    footerBind,
    contentBind,
    mobileWidth,
    showAsDrawer,
    isMobile: sidebar.isMobile,
    openMobile: sidebar.openMobile,
    setOpenMobile: sidebar.setOpenMobile,
  };
}
