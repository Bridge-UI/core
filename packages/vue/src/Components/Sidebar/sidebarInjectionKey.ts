// ** External Imports
import type { ComputedRef, InjectionKey } from "vue";

// ** Core Imports
import type { SidebarState } from "@bridge-ui/core/Domain";
import type {
  SidebarCollapsible,
  SidebarSide,
  SidebarVariant,
} from "@bridge-ui/core/Tokens";

/**
 * Layout fields registered by `Sidebar` for inset / trigger consumers.
 */
export type SidebarLayout = {
  /**
   * Desktop collapse mode.
   */
  collapsible: keyof SidebarCollapsible;

  /**
   * Id of the visible panel (`aria-controls`).
   */
  panelId: string;

  /**
   * Dock edge.
   */
  side: keyof SidebarSide;

  /**
   * Visual variant.
   */
  variant: keyof SidebarVariant;
};

/**
 * Shared sidebar state for `Sidebar`, `SidebarInset`, and `SidebarTrigger`.
 */
export type SidebarContextValue = {
  /**
   * Desktop collapse mode from the nearest `Sidebar`.
   */
  collapsible: keyof SidebarCollapsible;

  /**
   * Whether the viewport is below the mobile breakpoint.
   */
  isMobile: boolean;

  /**
   * Desktop expanded state.
   */
  open: boolean;

  /**
   * Mobile drawer visibility.
   */
  openMobile: boolean;

  /**
   * Id of the visible panel for `aria-controls`.
   */
  panelId: string;

  /**
   * Sets layout fields from the `Sidebar` panel.
   *
   * @internal
   */
  setLayout: (layout: Partial<SidebarLayout>) => void;

  /**
   * Sets the desktop expanded state.
   */
  setOpen: (open: boolean) => void;

  /**
   * Sets the mobile drawer visibility.
   */
  setOpenMobile: (open: boolean) => void;

  /**
   * Dock edge from the nearest `Sidebar`.
   */
  side: keyof SidebarSide;

  /**
   * Desktop visual state (`expanded` / `collapsed`).
   */
  state: SidebarState;

  /**
   * Toggles desktop `open` or mobile `openMobile` based on viewport.
   */
  toggleSidebar: () => void;

  /**
   * Visual variant from the nearest `Sidebar`.
   */
  variant: keyof SidebarVariant;
};

export const SIDEBAR_INJECTION_KEY = Symbol("bridge-sidebar") as InjectionKey<
  ComputedRef<SidebarContextValue>
>;
