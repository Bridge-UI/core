// ** External Imports
import { toMerged } from "es-toolkit/object";
import { useMemo } from "react";

// ** Core Imports
import {
  resolveFieldOverlay,
  type ResolvedFieldOverlay,
} from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { DrawerOwnProps } from "@/Components/Drawer/drawer.types";
import type {
  FieldOverlayOwnProps,
  FieldOverlayProps,
} from "@/Components/FieldOverlay/fieldOverlay.types";
import type { MenuOwnProps } from "@/Components/Menu/menu.types";
import type { ModalOwnProps } from "@/Components/Modal/modal.types";
import { derived, mergePartBind } from "@/Utils";
import { useBreakpoint } from "@/Utils/useBreakpoint";

function withDialogPanelClasses<
  T extends {
    customProps?: {
      panel?: { className?: string };
    };
  },
>(props: T, panelClass: string): T {
  const panel = props.customProps?.panel;

  return toMerged(props, {
    customProps: {
      panel: {
        ...panel,
        className: cn(panelClass, panel?.className),
      },
    },
  }) as T;
}

/**
 * Resolves the field overlay shell and builds Menu / Modal / Drawer props.
 */
export function useFieldOverlay(props: FieldOverlayProps) {
  const { overlay, children, customProps, show = false, onShowChange } = props;

  const breakpoint = useBreakpoint();

  const resolvedOverlay: ResolvedFieldOverlay = useMemo(() => {
    return resolveFieldOverlay(overlay, breakpoint.mobile);
  }, [overlay, breakpoint.mobile]);

  const menuProps = useMemo((): Omit<MenuOwnProps, "children"> => {
    const menuFromProps = customProps?.menu;

    return {
      show,
      onShowChange,
      closeOnClickAway: true,
      placement: "bottom-start",
      ...menuFromProps,
      classes: {
        ...menuFromProps?.classes,
        content: cn({
          [menuFromProps?.classes?.content ?? ""]: true,
          // Nested picker / listbox paints the surface, like modal / drawer.
          "overflow-visible rounded-none bg-transparent shadow-none ring-0 dark:bg-transparent": true,
        }),
      },
    };
  }, [show, onShowChange, customProps?.menu]);

  const modalProps = useMemo((): Omit<ModalOwnProps, "children"> => {
    return withDialogPanelClasses(
      {
        show,
        size: "md",
        onShowChange,
        scroll: "paper",
        closeOnOverlay: true,
        align: "middle-center",
        disableRestoreFocus: true,
        ...customProps?.modal,
      },
      "flex w-fit max-w-full sm:max-w-full flex-col items-stretch p-0",
    );
  }, [show, onShowChange, customProps?.modal]);

  const drawerProps = useMemo((): Omit<DrawerOwnProps, "children"> => {
    return withDialogPanelClasses(
      {
        show,
        size: "md",
        onShowChange,
        scroll: "paper",
        placement: "bottom",
        closeOnOverlay: true,
        disableRestoreFocus: true,
        ...customProps?.drawer,
      },
      "flex h-auto max-h-[90dvh] w-full flex-col items-stretch p-0",
    );
  }, [show, onShowChange, customProps?.drawer]);

  const drawerScrollerBind = derived(() => {
    return mergePartBind(
      customProps?.drawerScroller,
      {},
      cn({
        "flex min-w-0 w-full flex-col overflow-x-auto overflow-y-hidden bridge-scroll-fade-x bridge-hide-scrollbar": true,
      }),
    );
  });

  return {
    children,
    menuProps,
    modalProps,
    drawerProps,
    resolvedOverlay,
    drawerScrollerBind,
  };
}

export type FieldOverlayOptions = FieldOverlayOwnProps;
