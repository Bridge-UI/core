/**
 * Per-orientation layout classes for the button group root.
 */
export interface ButtonGroupOrientationItem {
  /**
   * Seamless join when `separator` is false (no internal divider).
   */
  "join": string;

  /**
   * Classes for the group root (direction, stretch, nested gap).
   */
  "root": string;

  /**
   * Full-height divider geometry when `separator` is true.
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
  "horizontal": {
    "root":
      "inline-flex w-fit flex-row items-stretch isolate [&>*]:hover:relative [&>*]:hover:z-10 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2",
    "join":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:-ms-px [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:border-s-0 [&:not(:has(>[data-slot=button-group]))>:not(:last-child)]:border-e-0 [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:rounded-s-none [&:not(:has(>[data-slot=button-group]))>:not(:last-child)]:rounded-e-none",
    "separator":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:relative [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:rounded-s-none [&:not(:has(>[data-slot=button-group]))>:not(:last-child)]:rounded-e-none [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:border-s-0 [&:not(:has(>[data-slot=button-group]))>:not(:last-child)]:border-e-0 [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:pointer-events-none [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:absolute [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:inset-y-0 [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:start-0 [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:w-px [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:content-['']",
  },
  "vertical": {
    "root":
      "inline-flex w-fit flex-col items-stretch isolate [&>*]:w-full [&>*]:hover:relative [&>*]:hover:z-10 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2",
    "join":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:-mt-px [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:border-t-0 [&:not(:has(>[data-slot=button-group]))>:not(:last-child)]:border-b-0 [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:rounded-t-none [&:not(:has(>[data-slot=button-group]))>:not(:last-child)]:rounded-b-none",
    "separator":
      "[&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:relative [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:rounded-t-none [&:not(:has(>[data-slot=button-group]))>:not(:last-child)]:rounded-b-none [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:border-t-0 [&:not(:has(>[data-slot=button-group]))>:not(:last-child)]:border-b-0 [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:pointer-events-none [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:absolute [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:inset-x-0 [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:top-0 [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:h-px [&:not(:has(>[data-slot=button-group]))>:not(:first-child)]:before:content-['']",
  },
};
