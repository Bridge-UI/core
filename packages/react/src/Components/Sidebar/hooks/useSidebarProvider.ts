// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { toMerged } from "es-toolkit/object";
import { useCallback, useMemo, useState, type CSSProperties } from "react";

// ** Core Imports
import {
  resolveSidebarState,
  shouldToggleDesktopSidebar,
  SIDEBAR_DESKTOP_BREAKPOINT,
  SIDEBAR_WIDTH_ICON_VAR,
  SIDEBAR_WIDTH_MOBILE_VAR,
  SIDEBAR_WIDTH_VAR,
  toggleSidebarOpen,
} from "@bridge-ui/core/Domain";
import {
  sidebarWidthProps as widthProps,
  type SidebarWidth,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  SidebarContextValue,
  SidebarLayout,
} from "@/Components/Sidebar/SidebarContext";
import type {
  SidebarProviderOwnProps,
  SidebarProviderProps,
} from "@/Components/Sidebar/sidebar.types";
import {
  derived,
  mergePartBind,
  useBreakpoint,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const sidebarProviderBridgeKeys = [
  "open",
  "classes",
  "customProps",
  "defaultOpen",
  "onOpenChange",
] as const satisfies readonly (keyof (SidebarProviderOwnProps & {
  onOpenChange?: (open: boolean) => void;
}))[];

type SidebarProviderLibDefaults = LibDefaultsShape<
  SidebarProviderOwnProps,
  "defaultOpen"
>;

type SidebarProviderMerged = MergeLibDefaults<
  SidebarProviderOwnProps,
  SidebarProviderLibDefaults
>;

const defaultLayout: SidebarLayout = {
  panelId: "",
  side: "left",
  variant: "sidebar",
  collapsible: "offcanvas",
};

export function useSidebarProvider(
  props: SidebarProviderProps,
  libDefaults: SidebarProviderLibDefaults,
) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    SidebarProviderProps,
    typeof sidebarProviderBridgeKeys
  >({
    props,
    bridgeKeys: sidebarProviderBridgeKeys,
  });

  const { merged, entry: bridgeSidebar } = useBridgeUIComponent<
    SidebarProviderMerged,
    "Sidebar"
  >({
    libDefaults,
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
    return merged.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeSidebar,
    props: componentProps,
  });

  const breakpoint = useBreakpoint();
  const isMobile = breakpoint.lessThan(SIDEBAR_DESKTOP_BREAKPOINT);

  const isOpenControlled = props.open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(
    () => merged.defaultOpen,
  );
  const open = isOpenControlled ? Boolean(props.open) : uncontrolledOpen;

  const [openMobile, setOpenMobile] = useState(false);
  const [layout, setLayoutState] = useState<SidebarLayout>(defaultLayout);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isOpenControlled) {
        setUncontrolledOpen(next);
      }

      props.onOpenChange?.(next);
    },
    [isOpenControlled, props.onOpenChange],
  );

  const setLayout = useCallback((next: Partial<SidebarLayout>) => {
    setLayoutState((current) => {
      const mergedLayout = { ...current, ...next };

      if (
        current.side === mergedLayout.side &&
        current.panelId === mergedLayout.panelId &&
        current.variant === mergedLayout.variant &&
        current.collapsible === mergedLayout.collapsible
      ) {
        return current;
      }

      return mergedLayout;
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((current) => toggleSidebarOpen(current));
      return;
    }

    if (!shouldToggleDesktopSidebar(layout.collapsible)) {
      return;
    }

    setOpen(toggleSidebarOpen(open));
  }, [isMobile, layout.collapsible, open, setOpen]);

  const state = resolveSidebarState(open, layout.collapsible);

  const widthItem = useMemo((): SidebarWidth => {
    return toMerged(widthProps, bridgeSidebar?.tokens?.width ?? {});
  }, [bridgeSidebar?.tokens?.width]);

  const contextValue = derived((): SidebarContextValue => {
    return {
      open,
      state,
      setOpen,
      isMobile,
      setLayout,
      openMobile,
      toggleSidebar,
      setOpenMobile,
      side: layout.side,
      panelId: layout.panelId,
      variant: layout.variant,
      collapsible: layout.collapsible,
    };
  });

  const rootBind = derived(() => {
    const inheritedStyle = (rootInheritedAttrs as { style?: CSSProperties })
      .style;

    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      "data-side": layout.side,
      className: cn({
        "flex min-h-svh w-full data-[side=right]:flex-row-reverse": true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
      style: {
        ...inheritedStyle,
        [SIDEBAR_WIDTH_VAR]: widthItem.default,
        [SIDEBAR_WIDTH_ICON_VAR]: widthItem.icon,
        [SIDEBAR_WIDTH_MOBILE_VAR]: widthItem.mobile,
      } as CSSProperties,
    });
  });

  return {
    merged,
    children,
    rootBind,
    contextValue,
  };
}
