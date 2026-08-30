/**
 * Per-token alignment for empty-state root.
 */
export interface EmptyStateAlign {
  /**
   * Center the stack and copy.
   */
  "center": string;

  /**
   * Align the stack and copy to the inline end.
   */
  "end": string;

  /**
   * Align the stack and copy to the inline start.
   */
  "start": string;
}

/**
 * Default empty-state alignment classes.
 */
export const alignProps: EmptyStateAlign = {
  "start": "items-start text-start",
  "end": "ms-auto items-end text-end",
  "center": "mx-auto items-center text-center",
};
