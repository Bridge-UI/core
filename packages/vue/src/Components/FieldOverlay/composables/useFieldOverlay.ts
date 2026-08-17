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
        closeOnOverlay: true,
        align: "middle-center",
        disableRestoreFocus: true,
        ...props.customProps?.modal,
      },
      // `!w-fit` / `!max-w-full` beat Modal `w-full` and `size` tokens
      // (`sm:max-w-md`, …) so the dialog hugs the picker instead of stretching
      // to the viewport, while dual calendars still fit past `size: "md"`.
      "flex !w-fit !max-w-full flex-col items-stretch p-0",
    );
  });

  const drawerBind = computed((): DrawerOwnProps => {
    return withDialogPanelClasses(
      {
        size: "md",
        placement: "bottom",
        closeOnOverlay: true,
        disableRestoreFocus: true,
        ...props.customProps?.drawer,
      },
      // `!h-auto` / `!max-h-[90dvh]` beat Drawer `size: "md"` (`h-64`) so the
      // sheet grows with the picker instead of flattening the calendar.
      "flex w-full !h-auto !max-h-[90dvh] flex-col items-stretch p-0",
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
