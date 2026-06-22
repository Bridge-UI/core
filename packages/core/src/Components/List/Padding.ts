export interface ListPadding {
  /**
   * No padding.
   */
  none: string;

  /**
   * Normal list padding.
   */
  normal: string;
}

export const paddingProps: ListPadding = {
  none: "p-0",
  normal: "py-2",
};
