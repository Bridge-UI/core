/**
 * Per-orientation layout classes for the button group root.
 */
export interface ButtonGroupOrientationItem {
  /**
   * Classes for the group root (direction, joining, nested gap).
   */
  "root": string;
}

/**
 * Orientation of the button group.
 */
export interface ButtonGroupOrientation {
  /**
   * Horizontal group (row).
   */
  "horizontal": ButtonGroupOrientationItem;

  /**
   * Vertical group (column).
   */
  "vertical": ButtonGroupOrientationItem;
}

/**
 * Layout classes for the group by orientation.
 */
export const orientationProps: ButtonGroupOrientation = {
  "vertical": {
    "root":
      "inline-flex w-fit flex-col items-stretch gap-px isolate bg-dark-200 dark:bg-dark-600 [&>:not(:first-child)]:rounded-t-none [&>:not(:last-child)]:rounded-b-none [&>:not(:first-child)]:border-t-0 [&>:not(:last-child)]:border-b-0 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[>[data-slot=button-group]]:bg-transparent has-[>[data-slot=button-group]]:dark:bg-transparent",
  },
  "horizontal": {
    "root":
      "inline-flex w-fit flex-row items-stretch gap-px isolate bg-dark-200 dark:bg-dark-600 [&>:not(:first-child)]:rounded-s-none [&>:not(:last-child)]:rounded-e-none [&>:not(:first-child)]:border-s-0 [&>:not(:last-child)]:border-e-0 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[>[data-slot=button-group]]:bg-transparent has-[>[data-slot=button-group]]:dark:bg-transparent",
  },
};
