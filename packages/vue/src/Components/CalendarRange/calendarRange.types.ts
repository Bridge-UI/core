// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  DateRangeValue,
  DisableDatesInput,
  StartOfWeek,
} from "@bridge-ui/core/Domain";
import type {
  CalendarColor,
  CalendarColorItem,
  CalendarDay,
  CalendarRounded,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { CalendarDateDayCell } from "@/Components/CalendarDate/calendarDate.types";
import type { IconProps } from "@/Components/Icon/icon.types";

export interface CalendarRangeColorOverrides {}
export interface CalendarRangeRoundedOverrides {}

export type CalendarRangeView = "date" | "year" | "month";

/**
 * Dual calendar arrangement for date range panels.
 */
export type CalendarRangeOrientation = "vertical" | "horizontal";

export interface CalendarRangeClasses {
  /**
   * Classes for the date / month / year body.
   */
  body?: string;

  /**
   * Classes for the end (right / bottom) date panel wrapper.
   */
  end?: string;

  /**
   * Classes for the end-month header (vertical orientation).
   */
  endHeader?: string;

  /**
   * Classes for the shared header.
   */
  header?: string;

  /**
   * Classes for the centered month selectors group.
   */
  months?: string;

  /**
   * Classes for navigation icon buttons.
   */
  navButton?: string;

  /**
   * Classes for the dual date panels row / column.
   */
  panels?: string;

  /**
   * Classes for the root element.
   */
  root?: string;

  /**
   * Classes for month / year selector buttons.
   */
  selector?: string;

  /**
   * Classes for the start (left / top) date panel wrapper.
   */
  start?: string;
}

export interface CalendarRangeCustomProps {
  /**
   * Props forwarded to the body.
   *
   * @default undefined
   */
  body?: HTMLAttributes;

  /**
   * Props forwarded to the end (right / bottom) panel wrapper.
   *
   * @default undefined
   */
  end?: HTMLAttributes;

  /**
   * Props forwarded to the end-month header (vertical orientation).
   *
   * @default undefined
   */
  endHeader?: HTMLAttributes;

  /**
   * Props forwarded to the header.
   *
   * @default undefined
   */
  header?: HTMLAttributes;

  /**
   * Props forwarded to the centered month selectors group.
   *
   * @default undefined
   */
  months?: HTMLAttributes;

  /**
   * Props forwarded to navigation icon buttons.
   *
   * @default undefined
   */
  navButton?: ButtonHTMLAttributes;

  /**
   * Props forwarded to nav `Icon`s.
   *
   * @default undefined
   */
  navIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the next control.
   *
   * @default undefined
   */
  nextButton?: ButtonHTMLAttributes;

  /**
   * Props forwarded to the dual date panels row.
   *
   * @default undefined
   */
  panels?: HTMLAttributes;

  /**
   * Props forwarded to the previous control.
   *
   * @default undefined
   */
  previousButton?: ButtonHTMLAttributes;

  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to month / year selector buttons.
   *
   * @default undefined
   */
  selector?: ButtonHTMLAttributes;

  /**
   * Props forwarded to the start (left / top) panel wrapper.
   *
   * @default undefined
   */
  start?: HTMLAttributes;

  /**
   * Props forwarded to the today control.
   *
   * @default undefined
   */
  todayButton?: ButtonHTMLAttributes;
}

export interface CalendarRangeEmits {
  /**
   * Emitted when the range selection changes.
   */
  change: [value: null | DateRangeValue];

  /**
   * Emitted when the range preview hover date changes.
   */
  previewDateChange: [date: Date | null];

  /**
   * Emitted when the start (left) displayed month changes.
   */
  viewDateChange: [date: Date];
}

export interface CalendarRangeTokens {
  /**
   * Color token map overrides.
   */
  color?: Record<string, Partial<CalendarColorItem>>;

  /**
   * Day chrome overrides.
   */
  day?: Partial<CalendarDay>;

  /**
   * Border radius token map overrides.
   */
  rounded?: Record<string, string>;
}

export interface CalendarRangeOwnProps {
  /**
   * Classes for calendar range regions.
   *
   * @default undefined
   */
  classes?: CalendarRangeClasses;

  /**
   * Accent color for tiles.
   *
   * @default "primary"
   */
  color?: MergeProps<CalendarColor, CalendarRangeColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: CalendarRangeCustomProps;

  /**
   * Uncontrolled initial value.
   *
   * @default null
   */
  defaultValue?: null | DateRangeValue;

  /**
   * Disables the calendar range.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Dates that cannot be selected.
   *
   * @default undefined
   */
  disableDates?: DisableDatesInput;

  /**
   * Month indexes that cannot be selected.
   *
   * @default undefined
   */
  disableMonths?: number[];

  /**
   * Years that cannot be selected.
   *
   * @default undefined
   */
  disableYears?: number[];

  /**
   * When `true`, applies invalidated (error) tile colors.
   *
   * @default false
   */
  error?: boolean;

  /**
   * Hides the shared month selector and month panel.
   *
   * @default false
   */
  hideMonths?: boolean;

  /**
   * Hides days that fall outside the displayed month.
   *
   * @default false
   */
  hideOutsideDays?: boolean;

  /**
   * Hides weekday labels on both date panels.
   *
   * @default false
   */
  hideWeekdays?: boolean;

  /**
   * Hides the shared year selector and year panel.
   *
   * @default false
   */
  hideYears?: boolean;

  /**
   * Latest selectable date.
   *
   * @default undefined
   */
  maxDate?: Date;

  /**
   * Earliest selectable date.
   *
   * @default undefined
   */
  minDate?: Date;

  /**
   * Dual calendar arrangement.
   *
   * - `horizontal`: shared header with year, both months, and nav; panels side by side
   * - `vertical`: top header with year, start month, and nav; end month header above the bottom panel
   *
   * @default "horizontal"
   */
  orientation?: CalendarRangeOrientation;

  /**
   * Controlled range-preview hover date shared across both panels.
   *
   * @default undefined
   */
  previewDate?: Date | null;

  /**
   * Prevents selection (disabled tile styles).
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Border radius of tiles and chrome controls.
   *
   * @default "md"
   */
  rounded?: MergeProps<CalendarRounded, CalendarRangeRoundedOverrides>;

  /**
   * First day of the week.
   *
   * @default 0
   */
  startOfWeek?: number | StartOfWeek;

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
  tokens?: CalendarRangeTokens;

  /**
   * Controlled range value.
   *
   * @default undefined
   */
  value?: null | DateRangeValue;

  /**
   * Controlled start (left) displayed month. Pair with `viewDateChange` /
   * `v-model:viewDate`. Without a change listener, the prop is used as the
   * initial month only.
   *
   * @default undefined
   */
  viewDate?: Date;
}

export interface CalendarRangeSlots {
  /**
   * Custom content inside each day button on both date panels.
   *
   * @default undefined
   */
  day?: Slot<CalendarDateDayCell>;

  /**
   * Content rendered beside the end (right / bottom) date panel.
   *
   * @default undefined
   */
  endAside?: Slot;

  /**
   * Content rendered beside the start (left / top) date panel.
   *
   * @default undefined
   */
  startAside?: Slot;
}

export type CalendarRangeProps = MergeHtmlProps<
  CalendarRangeOwnProps,
  HTMLAttributes
>;
