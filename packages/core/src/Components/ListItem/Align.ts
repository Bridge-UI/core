export interface ListItemAlign {
  /**
   * Vertically centered alignment.
   */
  center: string;

  /**
   * Top-aligned content.
   */
  start: string;
}

export const alignProps: ListItemAlign = {
  start: "items-start",
  center: "items-center",
};
