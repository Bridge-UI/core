// ** External Imports
import type { HTMLAttributes } from "vue";

// ** Core Imports
import type {
  CalendarColor,
  CalendarColorItem,
  CalendarDay,
  DatePickerModel,
  DisableDatesInput,
  MergeHtmlProps,
  MergeProps,
  StartOfWeek,
} from "@bridge-ui/core";

// ** Local Imports
import type { ButtonProps } from "@/Components/Button/button.types";
import type { CalendarView } from "@/Components/Calendar/calendar.types";

export interface DatePickerColorOverrides {}

export interface DatePickerClasses {
  /**
   * Classes for the footer.
   */
  footer?: string;

  /**
   * Classes for the root element.
   */
  root?: string;
}

export interface DatePickerCustomProps {
  /**
   * Props forwarded to the Apply button.
   *
   * @default undefined
   */
  applyButton?: Partial<ButtonProps>;

  /**
   * Props forwarded to the Cancel button.
   *
   * @default undefined
   */
  cancelButton?: Partial<ButtonProps>;

  /**
   * Props forwarded to the footer.
   *
   * @default undefined
   */
  footer?: HTMLAttributes;

  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

export interface DatePickerEmits {
  /**
   * Emitted when Cancel is pressed.
   */
  cancel: [];

  /**
   * Emitted when Apply is pressed (`showFooter`) or when the value commits.
   */
  change: [value: DatePickerModel];
}

export interface DatePickerTokens {
  /**
   * Nested calendar token overrides.
   */
  calendar?: {
    color?: Record<string, Partial<CalendarColorItem>>;
    day?: Partial<CalendarDay>;
  };

  /**
   * Color token map overrides.
   */
  color?: Record<string, Partial<CalendarColorItem>>;

  /**
   * Day chrome overrides.
   */
  day?: Partial<CalendarDay>;
}

export interface DatePickerOwnProps {
  /**
   * Classes for picker regions.
   *
   * @default undefined
   */
  classes?: DatePickerClasses;

  /**
   * Accent color.
   *
   * @default "primary"
   */
  color?: MergeProps<CalendarColor, DatePickerColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: DatePickerCustomProps;

  /**
   * Uncontrolled initial value.
   *
   * @default null
   */
  defaultValue?: DatePickerModel;

  /**
   * Initial calendar panel view.
   *
   * @default "date"
   */
  defaultView?: CalendarView;

  /**
   * Disables the picker.
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
   * Hides month navigation / panel.
   *
   * @default false
   */
  hideMonths?: boolean;

  /**
   * Hides weekday labels.
   *
   * @default false
   */
  hideWeekdays?: boolean;

  /**
   * Hides year navigation / panel.
   *
   * @default false
   */
  hideYears?: boolean;

  /**
   * Locale for labels.
   *
   * @default undefined
   */
  locale?: string;

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
   * Prevents selection.
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Shows Cancel / Apply footer. Selection is draft until Apply.
   *
   * @default false
   */
  showFooter?: boolean;

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
  tokens?: DatePickerTokens;

  /**
   * Controlled value.
   *
   * @default undefined
   */
  value?: DatePickerModel;
}

export type DatePickerProps = MergeHtmlProps<
  DatePickerOwnProps,
  HTMLAttributes
>;
