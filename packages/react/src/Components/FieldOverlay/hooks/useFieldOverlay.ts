// ** External Imports
import { toMerged } from "es-toolkit/object";
import { useMemo } from "react";

// ** Core Imports
import {
  cn,
  resolveFieldOverlay,
  type ResolvedFieldOverlay,
} from "@bridge-ui/core";

// ** Local Imports
import type { DrawerOwnProps } from "@/Components/Drawer/drawer.types";
import type {
  FieldOverlayOwnProps,
  FieldOverlayProps,
} from "@/Components/FieldOverlay/fieldOverlay.types";
import type { MenuOwnProps } from "@/Components/Menu/menu.types";
import type { ModalOwnProps } from "@/Components/Modal/modal.types";
import { useBreakpoint } from "@/Utils/useBreakpoint";

const PANEL_PADDING_CLASS = "p-2";

function withDialogPanelPadding<
  T extends {
    customProps?: {
      panel?: { className?: string };
    };
  },
>(props: T): T {
  const panel = props.customProps?.panel;
  const className = cn(PANEL_PADDING_CLASS, panel?.className);

  return toMerged(props, {
    customProps: {
      panel: {
        ...panel,
        className,
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
    return {
      show,
      onShowChange,
      closeOnClickAway: true,
      placement: "bottom-start",
      ...customProps?.menu,
    };
  }, [show, onShowChange, customProps?.menu]);

  const modalProps = useMemo((): Omit<ModalOwnProps, "children"> => {
    return withDialogPanelPadding({
      show,
      size: "md",
      onShowChange,
      align: "middle-center",
      ...customProps?.modal,
    });
  }, [show, onShowChange, customProps?.modal]);

  const drawerProps = useMemo((): Omit<DrawerOwnProps, "children"> => {
    return withDialogPanelPadding({
      show,
      size: "md",
      onShowChange,
      placement: "bottom",
      ...customProps?.drawer,
    });
  }, [show, onShowChange, customProps?.drawer]);

  return {
    children,
    menuProps,
    modalProps,
    drawerProps,
    resolvedOverlay,
  };
}

export type FieldOverlayOptions = FieldOverlayOwnProps;
