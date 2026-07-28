/**
 * Where scroll is applied for the drawer shell.
 */
export interface DrawerScroll {
  /**
   * Scroll on the page / root (body).
   */
  body: "body";

  /**
   * Scroll inside the drawer panel (paper).
   */
  paper: "paper";
}

/**
 * Drawer scroll mode identity tokens.
 */
export const scrollProps: DrawerScroll = {
  body: "body",
  paper: "paper",
};
