// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

// ** Core Imports
import type {
  DatePickerModel,
  DisableDatesInput,
} from "@bridge-ui/core/Domain";
import type { CalendarColor, CalendarRounded } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

export interface CalendarYearColorOverrides {}
export interface CalendarYearRoundedOverrides {}

export interface CalendarYearClasses {
  /**
   * Classes for the years grid.
   */
  grid?: string;

  /**
   * Classes for the root element.
   */
  root?: string;

  /**
   * Classes for each year button.
   */
  year?: string;
}

export interface CalendarYearCustomProps {
  /**
   * Props forwarded to the years grid.
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
   * Props forwarded to each year button.
   *
   * @default undefined
   */
  year?: ButtonHTMLAttributes<HTMLButtonElement>;
}

export interface CalendarYearCallbacks {
  /**
   * Called when a year is selected.
   */
  onChange?: (year: number) => void;

  /**
   * Called when the range preview hover date changes.
   */
  onPreviewDateChange?: (date: Date | null) => void;
}

export interface CalendarYearOwnProps {
  /**
   * Classes for calendar regions.
   *
   * @default undefined
   */
  classes?: CalendarYearClasses;

  /**
   * Accent color for year tiles.
   *
   * @default "primary"
   */
  color?: MergeProps<CalendarColor, CalendarYearColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: CalendarYearCustomProps;

  /**
   * Disables the entire year grid.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Dates that cannot be selected. Compared at year precision when `selection`
   * is set.
   *
   * @default undefined
   */
  disableDates?: DisableDatesInput;

  /**
   * Years that cannot be selected.
   *
   * @default undefined
   */
  disableYears?: number[];

  /**
   * When `true`, applies the error color palette to tiles.
   *
   * @default false
   */
  error?: boolean;

  /**
   * Latest selectable date (bounds year availability).
   *
   * @default undefined
   */
  maxDate?: Date;

  /**
   * Earliest selectable date (bounds year availability).
   *
   * @default undefined
   */
  minDate?: Date;

  /**
   * Allows selecting multiple years when this panel is the commit view.
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * How many years to show per page.
   *
   * @default 15
   */
  pageSize?: number;

  /**
   * Controlled range-preview hover date.
   *
   * @default undefined
   */
  previewDate?: Date | null;

  /**
   * Selects a year range when this panel is the commit view.
   *
   * @default false
   */
  range?: boolean;

  /**
   * Prevents selection while keeping tiles visible.
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Border radius of year tiles.
   *
   * @default "md"
   */
  rounded?: MergeProps<CalendarRounded, CalendarYearRoundedOverrides>;

  /**
   * Date selection model used to highlight tiles when this panel is the commit
   * view. `value` stays the focused year.
   *
   * @default undefined
   */
  selection?: DatePickerModel;

  /**
   * First year of the visible page. Defaults around `value` / current year.
   *
   * @default undefined
   */
  startYear?: number;

  /**
   * IANA time zone.
   *
   * @default undefined
   */
  timeZone?: string;

  /**
   * Selected year.
   *
   * @default undefined
   */
  value?: number;
}

export type CalendarYearProps = MergeHtmlProps<
  CalendarYearOwnProps & CalendarYearCallbacks,
  HTMLAttributes<HTMLDivElement>
>;
