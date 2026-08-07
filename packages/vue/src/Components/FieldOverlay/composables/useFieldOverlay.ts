// ** External Imports
import { toMerged } from "es-toolkit/object";
import { computed } from "vue";

// ** Core Imports
import {
  cn,
  resolveFieldOverlay,
  type ResolvedFieldOverlay,
} from "@bridge-ui/core";

// ** Local Imports
import type { DrawerOwnProps } from "@/Components/Drawer/drawer.types";
import type { FieldOverlayOwnProps } from "@/Components/FieldOverlay/fieldOverlay.types";
import type { MenuOwnProps } from "@/Components/Menu/menu.types";
import type { ModalOwnProps } from "@/Components/Modal/modal.types";
import { useBreakpoint } from "@/Utils/useBreakpoint";

const PANEL_PADDING_CLASS = "p-2";

function withDialogPanelPadding<T extends ModalOwnProps | DrawerOwnProps>(
  props: T,
): T {
  const panel = props.customProps?.panel;
  const className = cn(PANEL_PADDING_CLASS, panel?.class);

  return toMerged(props, {
    customProps: {
      panel: {
        ...panel,
        class: className,
      },
    },
  }) as T;
}

/**
 * Resolves the field overlay shell and builds Menu / Modal / Drawer binds.
 */
export function useFieldOverlay(props: FieldOverlayOwnProps) {
  const breakpoint = useBreakpoint();

  const resolvedOverlay = computed((): ResolvedFieldOverlay => {
    return resolveFieldOverlay(props.overlay, breakpoint.mobile);
  });

  const menuBind = computed((): MenuOwnProps => {
    return {
      closeOnClickAway: true,
      placement: "bottom-start",
      ...props.customProps?.menu,
    };
  });

  const modalBind = computed((): ModalOwnProps => {
    return withDialogPanelPadding({
      size: "md",
      align: "middle-center",
      ...props.customProps?.modal,
    });
  });

  const drawerBind = computed((): DrawerOwnProps => {
    return withDialogPanelPadding({
      size: "md",
      placement: "bottom",
      ...props.customProps?.drawer,
    });
  });

  return {
    menuBind,
    modalBind,
    drawerBind,
    resolvedOverlay,
  };
}

export type FieldOverlayOptions = FieldOverlayOwnProps;
