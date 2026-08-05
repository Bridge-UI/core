/**
 * Non-interactive calendar chrome and day modifiers.
 * Interactive tile states live on {@link CalendarColorItem} (`base` / `hover` /
 * `selected` / `disabled`).
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
  "outside": "opacity-50",
  "today": "font-semibold text-primary-600 dark:text-primary-400",
  "weekday": "text-xs font-medium uppercase text-gray-400 dark:text-gray-500",
};
