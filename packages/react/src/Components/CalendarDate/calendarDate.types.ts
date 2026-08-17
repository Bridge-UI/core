// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  CalendarDayInteractionState,
  DatePickerModel,
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
  day?: ButtonHTMLAttributes<HTMLButtonElement>;

  /**
   * Props forwarded to the days grid.
   *
   * @default undefined
   */
  grid?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to each weekday label.
   *
   * @default undefined
   */
  weekday?: HTMLAttributes<HTMLSpanElement>;
}

export interface CalendarDateCallbacks {
  /**
   * Called when the selection model changes.
   */
  onChange?: (value: DatePickerModel) => void;

  /**
   * Called when the range-preview hover date changes.
   */
  onPreviewDateChange?: (date: Date | null) => void;

  /**
   * Called when the displayed month should change.
   */
  onViewDateChange?: (date: Date) => void;
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

export interface CalendarDateSlots {
  /**
   * Custom content inside each day button. The button chrome stays managed.
   *
   * @default undefined
   */
  day?: (ctx: CalendarDateDayCell) => ReactNode;
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
   * Hides days that fall outside the displayed month.
   *
   * @default false
   */
  hideOutsideDays?: boolean;

  /**
   * Hides the weekday header row.
   *
   * @default false
   */
  hideWeekdays?: boolean;

  /**
   * When `true`, applies invalidated (error) tile colors.
   *
   * @default false
   */
  invalidated?: boolean;

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
   * Named slots (`day`).
   *
   * @default undefined
   */
  slots?: CalendarDateSlots;

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
   * Token overrides (usually passed from `DatePicker` / `DateField` registry).
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
  CalendarDateOwnProps & CalendarDateCallbacks,
  HTMLAttributes<HTMLDivElement>
>;
