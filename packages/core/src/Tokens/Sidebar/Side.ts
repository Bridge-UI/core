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
 * Logical-property placement for the fixed desktop panel.
 */
export const sideProps: SidebarSide = {
  "left": "data-[side=left]:inset-inline-start-0",
  "right": "data-[side=right]:inset-inline-end-0",
};
