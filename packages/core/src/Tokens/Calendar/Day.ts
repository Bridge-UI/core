/**
 * Non-interactive calendar chrome and day modifiers.
 * Interactive tile states live on {@link CalendarColorItem} (`base` / `hover` /
 * `selected` / `disabled` / `soft`).
 *
 * Spacing and type scale follow WireUI's datetime-picker calendar.
 */
export interface CalendarDay {
  /**
   * Day outside the visible month (still uses color states underneath).
   */
  "outside": string;

  /**
   * Today indicator when not selected.
   */
  "today": string;

  /**
   * Weekday header label.
   */
  "weekday": string;
}

export const dayProps: CalendarDay = {
  "outside": "text-dark-400 dark:text-dark-500",
  "today": "font-medium text-primary-600 dark:text-primary-400",
  "weekday":
    "pointer-events-none text-center text-[0.65rem] font-medium uppercase text-dark-400 dark:text-dark-500",
};
