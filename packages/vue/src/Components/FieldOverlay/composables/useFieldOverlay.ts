// ** External Imports
import { toMerged } from "es-toolkit/object";
import { computed } from "vue";

// ** Core Imports
import {
  resolveFieldOverlay,
  type ResolvedFieldOverlay,
} from "@bridge-ui/core/Domain";
import { cn } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { DrawerOwnProps } from "@/Components/Drawer/drawer.types";
import type { FieldOverlayOwnProps } from "@/Components/FieldOverlay/fieldOverlay.types";
import type { MenuOwnProps } from "@/Components/Menu/menu.types";
import type { ModalOwnProps } from "@/Components/Modal/modal.types";
import { useBreakpoint } from "@/Utils/useBreakpoint";

function withDialogPanelClasses<T extends ModalOwnProps | DrawerOwnProps>(
  props: T,
  panelClass: string,
): T {
  const panel = props.customProps?.panel;

  return toMerged(props, {
    customProps: {
      panel: {
        ...panel,
        class: cn(panelClass, panel?.class),
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
    return withDialogPanelClasses(
      {
        size: "md",
        scroll: "paper",
        align: "middle-center",
        ...props.customProps?.modal,
      },
      "flex flex-col items-stretch p-0",
    );
  });

  const drawerBind = computed((): DrawerOwnProps => {
    return withDialogPanelClasses(
      {
        size: "md",
        placement: "bottom",
        ...props.customProps?.drawer,
      },
      "flex h-auto max-h-[90dvh] flex-col items-stretch p-0",
    );
  });

  return {
    menuBind,
    modalBind,
    drawerBind,
    resolvedOverlay,
  };
}

export type FieldOverlayOptions = FieldOverlayOwnProps;
