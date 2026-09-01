/**
 * Per-orientation layout classes for the button group root.
 */
export interface ButtonGroupOrientationItem {
  /**
   * Overlap join when `separator` is false (shared adjacent border).
   */
  "join": string;

  /**
   * Classes for the group root (direction, stretch, nested gap).
   */
  "root": string;

  /**
   * Hairline geometry when `separator` is true.
   */
  "separator": string;
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
      "inline-flex w-fit flex-col items-stretch isolate [&>*]:w-full [&>*]:hover:relative [&>*]:hover:z-10 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2",
    "join":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:-mt-px [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:border-t-0 [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:rounded-t-none [&:not(:has(>[data-slot=button-group]))>:not(:last-child)]:rounded-b-none",
    "separator":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:relative [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:rounded-t-none [&:not(:has(>[data-slot=button-group]))>:not(:last-child)]:rounded-b-none [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:border-t-0 [&:not(:has(>[data-slot=button-group]))>:not(:last-child)]:border-b-0 [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:pointer-events-none [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:absolute [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:inset-x-1.5 [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:top-0 [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:h-px [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:content-['']",
  },
  "horizontal": {
    "root":
      "inline-flex w-fit flex-row items-stretch isolate [&>*]:h-full [&>*]:hover:relative [&>*]:hover:z-10 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2",
    "join":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:-ms-px [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:border-s-0 [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:rounded-s-none [&:not(:has(>[data-slot=button-group]))>:not(:last-child)]:rounded-e-none",
    "separator":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:relative [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:rounded-s-none [&:not(:has(>[data-slot=button-group]))>:not(:last-child)]:rounded-e-none [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:border-s-0 [&:not(:has(>[data-slot=button-group]))>:not(:last-child)]:border-e-0 [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:pointer-events-none [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:absolute [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:inset-y-1.5 [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:start-0 [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:w-px [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:content-['']",
  },
};
