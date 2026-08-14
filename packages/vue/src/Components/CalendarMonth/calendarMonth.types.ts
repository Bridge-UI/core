// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes } from "vue";

// ** Core Imports
import type {
  CalendarColor,
  CalendarColorItem,
  CalendarRounded,
} from "@bridge-ui/core/Tokens/Calendar";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

export interface CalendarMonthColorOverrides {}
export interface CalendarMonthRoundedOverrides {}

export interface CalendarMonthClasses {
  /**
   * Classes for the months grid.
   */
  grid?: string;

  /**
   * Classes for each month button.
   */
  month?: string;

  /**
   * Classes for the root element.
   */
  root?: string;
}

export interface CalendarMonthCustomProps {
  /**
   * Props forwarded to the months grid.
   *
   * @default undefined
   */
  grid?: HTMLAttributes;

  /**
   * Props forwarded to each month button.
   *
   * @default undefined
   */
  month?: ButtonHTMLAttributes;

  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

export interface CalendarMonthEmits {
  /**
   * Emitted when a month is selected (`0`–`11`).
   */
  change: [month: number];
}

export interface CalendarMonthTokens {
  /**
   * Color token map overrides.
   */
  color?: Record<string, Partial<CalendarColorItem>>;

  /**
   * Border radius token map overrides.
   */
  rounded?: Record<string, string>;
}

export interface CalendarMonthOwnProps {
  /**
   * Classes for calendar regions.
   *
   * @default undefined
   */
  classes?: CalendarMonthClasses;

  /**
   * Accent color for month tiles.
   *
   * @default "primary"
   */
  color?: MergeProps<CalendarColor, CalendarMonthColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: CalendarMonthCustomProps;

  /**
   * Disables the entire month grid.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Month indexes (`0`–`11`) that cannot be selected.
   *
   * @default undefined
   */
  disableMonths?: number[];

  /**
   * Latest selectable date (bounds month availability for `year`).
   *
   * @default undefined
   */
  maxDate?: Date;

  /**
   * Earliest selectable date (bounds month availability for `year`).
   *
   * @default undefined
   */
  minDate?: Date;

  /**
   * Prevents selection while keeping tiles visible.
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Border radius of month tiles.
   *
   * @default "md"
   */
  rounded?: MergeProps<CalendarRounded, CalendarMonthRoundedOverrides>;

  /**
   * IANA time zone.
   *
   * @default undefined
   */
  timeZone?: string;

  /**
   * Token overrides.
   *
   * @default undefined
   */
  tokens?: CalendarMonthTokens;

  /**
   * Selected month (`0`–`11`).
   *
   * @default undefined
   */
  value?: number;

  /**
   * Year context for min/max month disabling.
   *
   * @default current year
   */
  year?: number;
}

export type CalendarMonthProps = MergeHtmlProps<
  CalendarMonthOwnProps,
  HTMLAttributes
>;
