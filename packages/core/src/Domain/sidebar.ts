/**
 * Desktop visual state derived from `open` and `collapsible`.
 */
export type SidebarState = "expanded" | "collapsed";

/**
 * CSS custom property for the expanded desktop rail width.
 */
export const SIDEBAR_WIDTH_VAR = "--bridge-sidebar-width";

/**
 * CSS custom property for the collapsed icon-rail width.
 */
export const SIDEBAR_WIDTH_ICON_VAR = "--bridge-sidebar-width-icon";

/**
 * CSS custom property for the mobile drawer panel width.
 */
export const SIDEBAR_WIDTH_MOBILE_VAR = "--bridge-sidebar-width-mobile";

/**
 * Collapsible modes accepted by {@link resolveSidebarState}.
 */
export type SidebarCollapsibleMode = "icon" | "none" | "offcanvas";

/**
 * Resolves `expanded` vs `collapsed` for desktop chrome.
 * `none` is always expanded. Mobile overlay is independent (`openMobile`).
 */
export function resolveSidebarState(
  open: boolean,
  collapsible: SidebarCollapsibleMode,
): SidebarState {
  if (collapsible === "none") {
    return "expanded";
  }

  return open ? "expanded" : "collapsed";
}

/**
 * Whether the sidebar should mount its mobile `Drawer` overlay.
 * Desktop chrome stays mounted and is hidden with CSS (`md:`).
 */
export function shouldRenderSidebarAsDrawer(isMobile: boolean): boolean {
  return isMobile;
}

/**
 * Next boolean for a sidebar open flag (desktop `open` or mobile `openMobile`).
 */
export function toggleSidebarOpen(open: boolean): boolean {
  return !open;
}

/**
 * `data-collapsible` value: the mode when collapsed, empty when expanded.
 */
export function resolveSidebarCollapsibleData(
  state: SidebarState,
  collapsible: SidebarCollapsibleMode,
): "" | SidebarCollapsibleMode {
  if (state === "expanded" || collapsible === "none") {
    return "";
  }

  return collapsible;
}

/**
 * Stable DOM id for the sidebar panel (`aria-controls` on the trigger).
 */
export function getSidebarPanelId(sidebarId: string): string {
  return `${sidebarId}-panel`;
}

/**
 * Whether desktop toggle should change `open`. `none` is a no-op on desktop.
 */
export function shouldToggleDesktopSidebar(
  collapsible: SidebarCollapsibleMode,
): boolean {
  return collapsible !== "none";
}
