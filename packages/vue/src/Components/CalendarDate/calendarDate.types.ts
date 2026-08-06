// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  CalendarColor,
  CalendarColorItem,
  CalendarDay,
  CalendarDayInteractionState,
  CalendarRounded,
  DatePickerModel,
  DisableDatesInput,
  MergeHtmlProps,
  MergeProps,
  StartOfWeek,
} from "@bridge-ui/core";

export interface CalendarDateColorOverrides {}
export interface CalendarDateRoundedOverrides {}

export interface CalendarDateClasses {
  /**
   * Classes for each day button.
   */
  day?: string;

  /**
   * Classes for the days grid.
   */
  grid?: string;

  /**
   * Classes for the root element.
   */
  root?: string;

  /**
   * Classes for each weekday label.
   */
  weekday?: string;
}

export interface CalendarDateCustomProps {
  /**
   * Props forwarded to each day button.
   *
   * @default undefined
   */
  day?: ButtonHTMLAttributes;

  /**
   * Props forwarded to the days grid.
   *
   * @default undefined
   */
  grid?: HTMLAttributes;

  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to each weekday label.
   *
   * @default undefined
   */
  weekday?: HTMLAttributes;
}

/**
 * Context passed to the `day` slot for each calendar cell.
 */
export interface CalendarDateDayCell {
  /**
   * Calendar date for this cell.
   */
  date: Date;

  /**
   * Whether the cell cannot be selected.
   */
  disabled: boolean;

  /**
   * Visible day-of-month label.
   */
  label: string;

  /**
   * Whether the cell is outside the displayed month.
   */
  outside: boolean;

  /**
   * Whether the cell is in an incomplete range preview.
   */
  preview: boolean;

  /**
   * Whether the cell is part of the selection model.
   */
  selected: boolean;

  /**
   * Resolved interactive visual state.
   */
  state: CalendarDayInteractionState;

  /**
   * Whether the cell is today.
   */
  today: boolean;
}

export interface CalendarDateEmits {
  /**
   * Emitted when the selection model changes.
   */
  change: [value: DatePickerModel];

  /**
   * Emitted when the range-preview hover date changes.
   */
  previewDateChange: [date: Date | null];

  /**
   * Emitted when the displayed month should change (outside-day click).
   */
  viewDateChange: [date: Date];
}

export interface CalendarDateSlots {
  /**
   * Custom content inside each day button. The button chrome stays managed.
   *
   * @default undefined
   */
  day?: Slot<CalendarDateDayCell>;
}

export interface CalendarDateTokens {
  /**
   * Color token map overrides (`base` / `hover` / `selected` / `disabled`).
   */
  color?: Record<string, Partial<CalendarColorItem>>;

  /**
   * Day chrome overrides (`outside` / `today` / `weekday`).
   */
  day?: Partial<CalendarDay>;

  /**
   * Border radius token map overrides.
   */
  rounded?: Record<string, string>;
}

export interface CalendarDateOwnProps {
  /**
   * Classes for calendar regions.
   *
   * @default undefined
   */
  classes?: CalendarDateClasses;

  /**
   * Accent color for day tiles.
   *
   * @default "primary"
   */
  color?: MergeProps<CalendarColor, CalendarDateColorOverrides>;

  /**
   * Extra props for internal parts (`root`, `grid`, `day`, `weekday`).
   *
   * @default undefined
   */
  customProps?: CalendarDateCustomProps;

  /**
   * Uncontrolled initial value.
   *
   * @default null
   */
  defaultValue?: DatePickerModel;

  /**
   * Disables the entire calendar (no selection).
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
   * Month indexes (`0`–`11`) that cannot be selected.
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
   * Hides the weekday header row.
   *
   * @default false
   */
  hideWeekdays?: boolean;

  /**
   * Latest selectable date (inclusive).
   *
   * @default undefined
   */
  maxDate?: Date;

  /**
   * Earliest selectable date (inclusive).
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
   * Hovered date used for incomplete-range preview.
   *
   * @default undefined
   */
  previewDate?: Date | null;

  /**
   * Selects a start/end range instead of a single date.
   * Wins over `multiple` when both are set.
   *
   * @default false
   */
  range?: boolean;

  /**
   * Prevents selection while keeping tiles visible (uses disabled styles).
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Border radius of day tiles.
   *
   * @default "md"
   */
  rounded?: MergeProps<CalendarRounded, CalendarDateRoundedOverrides>;

  /**
   * First day of the week (`0` = Sunday … `6` = Saturday).
   *
   * @default 0
   */
  startOfWeek?: number | StartOfWeek;

  /**
   * IANA time zone (falls back to Bridge `global.timeZone`).
   *
   * @default undefined
   */
  timeZone?: string;

  /**
   * Token overrides (usually passed from `DatePicker` / `DateInput` registry).
   *
   * @default undefined
   */
  tokens?: CalendarDateTokens;

  /**
   * Controlled selection model.
   *
   * @default undefined
   */
  value?: DatePickerModel;

  /**
   * Month currently displayed in the grid.
   *
   * @default start of month for `value` / today
   */
  viewDate?: Date;
}

export type CalendarDateProps = MergeHtmlProps<
  CalendarDateOwnProps,
  HTMLAttributes
>;
