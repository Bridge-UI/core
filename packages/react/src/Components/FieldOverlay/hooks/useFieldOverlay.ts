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
    return {
      show,
      onShowChange,
      closeOnClickAway: true,
      placement: "bottom-start",
      ...customProps?.menu,
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
      // `!w-fit` / `!max-w-full` beat Modal `w-full` and `size` tokens
      // (`sm:max-w-md`, …) so the dialog hugs the picker instead of stretching
      // to the viewport, while dual calendars still fit past `size: "md"`.
      "flex !w-fit !max-w-full flex-col items-stretch p-0",
    );
  }, [show, onShowChange, customProps?.modal]);

  const drawerProps = useMemo((): Omit<DrawerOwnProps, "children"> => {
    return withDialogPanelClasses(
      {
        show,
        size: "md",
        onShowChange,
        placement: "bottom",
        closeOnOverlay: true,
        disableRestoreFocus: true,
        ...customProps?.drawer,
      },
      // `!h-auto` / `!max-h-[90dvh]` beat Drawer `size: "md"` (`h-64`) so the
      // sheet grows with the picker instead of flattening the calendar.
      "flex w-full !h-auto !max-h-[90dvh] flex-col items-stretch p-0",
    );
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
