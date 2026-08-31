/**
 * CSS length values for sidebar rails (set as `--bridge-sidebar-*` on the provider).
 */
export interface SidebarWidth {
  /**
   * Expanded desktop rail width.
   */
  "default": string;

  /**
   * Collapsed icon-rail width.
   */
  "icon": string;

  /**
   * Mobile drawer panel width.
   */
  "mobile": string;
}

/**
 * Default sidebar width CSS lengths.
 */
export const widthProps: SidebarWidth = {
  "icon": "3rem",
  "mobile": "18rem",
  "default": "16rem",
};
