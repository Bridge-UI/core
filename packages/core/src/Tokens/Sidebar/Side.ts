/**
 * Per-side positioning classes for the fixed desktop panel.
 */
export interface SidebarSide {
  /**
   * Dock the rail to the inline start (physical left in `ltr`).
   */
  "left": string;

  /**
   * Dock the rail to the inline end (physical right in `ltr`).
   */
  "right": string;
}

/**
 * Physical left/right docking for the fixed desktop panel (`side` is left/right).
 */
export const sideProps: SidebarSide = {
  "left": "left-0",
  "right": "right-0",
};
