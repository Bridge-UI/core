/**
 * Per-mode gap and panel classes for desktop collapse.
 */
export interface SidebarCollapsibleItem {
  /**
   * Classes merged onto the in-flow gap spacer.
   */
  "gap": string;

  /**
   * Classes merged onto the fixed desktop panel.
   */
  "panel": string;
}

/**
 * How the desktop sidebar hides.
 *
 * `offcanvas` slides out of the layout. `icon` shrinks to the icon rail.
 * `none` stays expanded.
 */
export interface SidebarCollapsible {
  /**
   * Collapse to icons. Labels hide via `List` `iconOnly`.
   */
  "icon": SidebarCollapsibleItem;

  /**
   * Always expanded. Trigger is a no-op on desktop.
   */
  "none": SidebarCollapsibleItem;

  /**
   * Slide the rail off-canvas (gap width goes to 0).
   */
  "offcanvas": SidebarCollapsibleItem;
}

/**
 * Default sidebar collapsible class maps.
 */
export const collapsibleProps: SidebarCollapsible = {
  "none": {
    "gap": "",
    "panel": "",
  },
  "icon": {
    "gap": "group-data-[collapsible=icon]:w-[var(--bridge-sidebar-width-icon)]",
    "panel":
      "group-data-[collapsible=icon]:w-[var(--bridge-sidebar-width-icon)]",
  },
  "offcanvas": {
    "gap": "group-data-[collapsible=offcanvas]:w-0",
    "panel":
      "group-data-[collapsible=offcanvas]:data-[side=left]:inset-inline-start-[calc(var(--bridge-sidebar-width)*-1)] group-data-[collapsible=offcanvas]:data-[side=right]:inset-inline-end-[calc(var(--bridge-sidebar-width)*-1)]",
  },
};
