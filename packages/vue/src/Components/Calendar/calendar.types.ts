// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  CalendarColor,
  CalendarColorItem,
  CalendarDay,
  CalendarRounded,
  DatePickerModel,
  DisableDatesInput,
  MergeHtmlProps,
  MergeProps,
  StartOfWeek,
} from "@bridge-ui/core";

// ** Local Imports
import type { CalendarDateDayCell } from "@/Components/CalendarDate/calendarDate.types";
import type { IconProps } from "@/Components/Icon/icon.types";

export interface CalendarColorOverrides {}
export interface CalendarRoundedOverrides {}

export type CalendarView = "date" | "year" | "month";

export interface CalendarClasses {
  /**
   * Classes for the fixed-height date / month / year panel.
   */
  body?: string;

  /**
   * Classes for the header.
   */
  header?: string;

  /**
   * Classes for navigation icon buttons.
   */
  navButton?: string;

  /**
   * Classes for the root element.
   */
  root?: string;

  /**
   * Classes for the month / year selector buttons.
   */
  selector?: string;
}

export interface CalendarCustomProps {
  /**
   * Props forwarded to the fixed-height panel that hosts date / month / year.
   *
   * @default undefined
   */
  body?: HTMLAttributes;

  /**
   * Props forwarded to the header.
   *
   * @default undefined
   */
  header?: HTMLAttributes;

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
   * Props forwarded to the next-month control.
   *
   * @default undefined
   */
  nextButton?: ButtonHTMLAttributes;

  /**
   * Props forwarded to the previous-month control.
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
   * Props forwarded to the today control.
   *
   * @default undefined
   */
  todayButton?: ButtonHTMLAttributes;
}

export interface CalendarEmits {
  /**
   * Emitted when the selection model changes.
   */
  change: [value: DatePickerModel];

  /**
   * Emitted when the active panel view changes.
   */
  viewChange: [view: CalendarView];

  /**
   * Emitted when the displayed month changes.
   */
  viewDateChange: [date: Date];
}

export interface CalendarSlots {
  /**
   * Custom content inside each day button on the date panel.
   *
   * @default undefined
   */
  day?: Slot<CalendarDateDayCell>;
}

export interface CalendarTokens {
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

export interface CalendarOwnProps {
  /**
   * Classes for calendar regions.
   *
   * @default undefined
   */
  classes?: CalendarClasses;

  /**
   * Accent color for tiles.
   *
   * @default "primary"
   */
  color?: MergeProps<CalendarColor, CalendarColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: CalendarCustomProps;

  /**
   * Uncontrolled initial value.
   *
   * @default null
   */
  defaultValue?: DatePickerModel;

  /**
   * Uncontrolled initial panel view.
   *
   * @default "date"
   */
  defaultView?: CalendarView;

  /**
   * Disables the calendar.
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
   * Hides the month selector and month panel.
   *
   * @default false
   */
  hideMonths?: boolean;

  /**
   * Hides weekday labels on the date panel.
   *
   * @default false
   */
  hideWeekdays?: boolean;

  /**
   * Hides the year selector and year panel.
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
   * Allows selecting multiple dates.
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Selects a date range.
   *
   * @default false
   */
  range?: boolean;

  /**
   * Prevents selection (disabled tile styles).
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Border radius of tiles and header chrome.
   *
   * @default "md"
   */
  rounded?: MergeProps<CalendarRounded, CalendarRoundedOverrides>;

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
  tokens?: CalendarTokens;

  /**
   * Controlled selection model.
   *
   * @default undefined
   */
  value?: DatePickerModel;

  /**
   * Controlled panel view (`date` / `month` / `year`). Pair with `viewChange` /
   * `v-model:view`. Without a change listener, the prop is used as the initial
   * view only.
   *
   * @default undefined
   */
  view?: CalendarView;

  /**
   * Controlled displayed month. Pair with `viewDateChange` / `v-model:viewDate`.
   * Without a change listener, the prop is used as the initial month only.
   *
   * @default undefined
   */
  viewDate?: Date;
}

export type CalendarProps = MergeHtmlProps<CalendarOwnProps, HTMLAttributes>;
