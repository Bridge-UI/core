/**
 * Shared chrome for the stepper track (circles + connectors).
 * Layout that changes with direction lives on orientation tokens.
 */
export interface StepperChrome {
  /**
   * Neutral connector line (completed accent comes from color tokens).
   */
  "connector": string;

  /**
   * Description under the label.
   */
  "description": string;

  /**
   * Circle indicator base.
   */
  "indicator": string;

  /**
   * Each step list item.
   */
  "item": string;

  /**
   * Upcoming label text.
   */
  "label": string;

  /**
   * Completed label (neutral, not the accent).
   */
  "labelCompleted": string;

  /**
   * Ordered list chrome.
   */
  "list": string;

  /**
   * Trigger base (focus ring / hover).
   */
  "trigger": string;

  /**
   * Upcoming indicator border / glyph.
   */
  "upcoming": string;
}

/**
 * Default stepper chrome (single visual: numbered circles + connectors).
 */
export const chromeProps: StepperChrome = {
  "item": "relative",
  "label": "text-dark-500 dark:text-dark-400",
  "list": "flex list-none items-start p-0 m-0",
  "description": "text-dark-500 dark:text-dark-400",
  "labelCompleted": "text-dark-900 dark:text-dark-100",
  "connector": "pointer-events-none absolute bg-dark-200 dark:bg-dark-700",
  "upcoming":
    "border-dark-300 text-dark-500 dark:border-dark-600 dark:text-dark-400",
  "indicator":
    "flex shrink-0 items-center justify-center rounded-full border-2 bg-white dark:bg-dark-900",
  "trigger":
    "group relative z-10 flex w-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40",
};
