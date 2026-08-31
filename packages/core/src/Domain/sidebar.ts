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
 * Tailwind breakpoint at which the desktop rail is shown (`md:` on the shell).
 * The overlay `Drawer` is used below this width, not the global `sm` mobile flag,
 * so the rail is not blank between `sm` and `md`.
 */
export const SIDEBAR_DESKTOP_BREAKPOINT = "md";

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

/**
 * Whether rail lists should collapse to icons.
 * False below the desktop breakpoint so the overlay drawer keeps labels.
 */
export function isSidebarIconOnly(
  isMobile: boolean,
  collapsible: SidebarCollapsibleMode,
  state: SidebarState,
): boolean {
  return !isMobile && collapsible === "icon" && state === "collapsed";
}

/**
 * Tooltip placement for collapsed icon-rail items. Opposite the dock edge.
 */
export function resolveSidebarListTooltipPlacement(
  side: "left" | "right",
): "left" | "right" {
  return side === "right" ? "left" : "right";
}
