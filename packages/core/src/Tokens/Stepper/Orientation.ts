/**
 * Per-orientation layout classes for the stepper list, items, connectors, and content.
 */
export interface StepperOrientationItem {
  /**
   * Connector line between indicators.
   */
  "connector": string;

  /**
   * Optional body under a vertical step.
   */
  "content": string;

  /**
   * Each step list item.
   */
  "item": string;

  /**
   * Ordered list (flex direction).
   */
  "list": string;

  /**
   * Trigger inner layout (stack vs row).
   */
  "trigger": string;
}

/**
 * Orientation of the stepper track.
 */
export interface StepperOrientation {
  /**
   * Horizontal steps (row).
   */
  "horizontal": StepperOrientationItem;

  /**
   * Vertical steps (column) with optional bodies.
   */
  "vertical": StepperOrientationItem;
}

/**
 * Layout classes for the list / items / connectors by orientation.
 */
export const orientationProps: StepperOrientation = {
  "horizontal": {
    "item": "flex-1",
    "list": "flex-row",
    "content": "hidden",
    "connector": "top-4 left-1/2 h-0.5 w-full",
    "trigger": "flex-col items-center text-center gap-2",
  },
  "vertical": {
    "list": "flex-col",
    "item": "pb-10 last:pb-0",
    "content": "ml-12 min-w-0",
    "trigger": "flex-row items-start text-left gap-4",
    "connector": "top-4 left-4 mt-0.5 -ml-px h-full w-0.5",
  },
};
