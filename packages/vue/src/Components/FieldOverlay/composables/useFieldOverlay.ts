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
import { mergePartBind } from "@/Utils";
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
    const menuFromProps = props.customProps?.menu;

    return {
      closeOnClickAway: true,
      placement: "bottom-start",
      ...menuFromProps,
      classes: {
        ...menuFromProps?.classes,
        content: cn(
          menuFromProps?.classes?.content,
          // Nested picker / listbox paints the surface, like modal / drawer.
          "overflow-visible rounded-none bg-transparent shadow-none ring-0 dark:bg-transparent",
        ),
      },
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
      "flex w-fit max-w-full sm:max-w-full flex-col items-stretch p-0",
    );
  });

  const drawerBind = computed((): DrawerOwnProps => {
    return withDialogPanelClasses(
      {
        size: "md",
        scroll: "paper",
        placement: "bottom",
        closeOnOverlay: true,
        disableRestoreFocus: true,
        ...props.customProps?.drawer,
      },
      "flex h-auto max-h-[90dvh] w-full flex-col items-stretch p-0",
    );
  });

  const drawerScrollerBind = computed(() => {
    return mergePartBind(
      props.customProps?.drawerScroller,
      {},
      cn({
        "flex min-w-0 w-full flex-col overflow-x-auto overflow-y-hidden bridge-scroll-fade-x bridge-hide-scrollbar": true,
      }),
    );
  });

  return {
    menuBind,
    modalBind,
    drawerBind,
    resolvedOverlay,
    drawerScrollerBind,
  };
}

export type FieldOverlayOptions = FieldOverlayOwnProps;
