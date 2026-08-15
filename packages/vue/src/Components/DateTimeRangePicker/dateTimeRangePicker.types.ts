// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  DateRangeValue,
  DisableDatesInput,
  DisableTimesInput,
  StartOfWeek,
} from "@bridge-ui/core/Domain";
import type {
  CalendarColor,
  CalendarColorItem,
  CalendarDay,
  CalendarRounded,
  TimeColorItem,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ButtonProps } from "@/Components/Button/button.types";
import type { CalendarDateDayCell } from "@/Components/CalendarDate/calendarDate.types";
import type { CalendarRangeOrientation } from "@/Components/CalendarRange";

export interface DateTimeRangePickerColorOverrides {}
export interface DateTimeRangePickerRoundedOverrides {}

export interface DateTimeRangePickerClasses {
  /**
   * Classes for the calendar region.
   */
  calendar?: string;

  /**
   * Classes for the footer.
   */
  footer?: string;

  /**
   * Classes for the root element.
   */
  root?: string;

  /**
   * Classes for the time panels region.
   */
  time?: string;
}

export interface DateTimeRangePickerCustomProps {
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

export interface DateTimeRangePickerEmits {
  /**
   * Emitted when Cancel is pressed.
   */
  cancel: [];

  /**
   * Emitted when Apply is pressed (`showFooter`) or when the value commits.
   */
  change: [value: null | DateRangeValue];
}

export interface DateTimeRangePickerSlots {
  /**
   * Custom content inside each day button on the nested calendar.
   *
   * @default undefined
   */
  day?: Slot<CalendarDateDayCell>;
}

export interface DateTimeRangePickerTokens {
  /**
   * Nested calendar token overrides.
   */
  calendar?: {
    color?: Record<string, Partial<CalendarColorItem>>;
    day?: Partial<CalendarDay>;
    rounded?: Record<string, string>;
  };

  /**
   * Color token map overrides for the calendar (and time when `time` is unset).
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

  /**
   * Nested time panel token overrides.
   */
  time?: {
    color?: Record<string, Partial<TimeColorItem>>;
    rounded?: Record<string, string>;
  };
}

export interface DateTimeRangePickerOwnProps {
  /**
   * Uses a 12-hour clock with an AM/PM column.
   *
   * @default false
   */
  ampm?: boolean;

  /**
   * Classes for picker regions.
   *
   * @default undefined
   */
  classes?: DateTimeRangePickerClasses;

  /**
   * Accent color for calendar and time tiles.
   *
   * @default "primary"
   */
  color?: MergeProps<CalendarColor, DateTimeRangePickerColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: DateTimeRangePickerCustomProps;

  /**
   * Uncontrolled initial value.
   *
   * @default null
   */
  defaultValue?: null | DateRangeValue;

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
   * Times that cannot be selected.
   *
   * @default undefined
   */
  disableTimes?: DisableTimesInput;

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
   * Hides days that fall outside the displayed month.
   *
   * @default false
   */
  hideOutsideDays?: boolean;

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
   * Minute step between options.
   *
   * @default 1
   */
  interval?: number;

  /**
   * Latest selectable date.
   *
   * @default undefined
   */
  maxDate?: Date;

  /**
   * Latest selectable time.
   *
   * @default undefined
   */
  maxTime?: Date;

  /**
   * Earliest selectable date.
   *
   * @default undefined
   */
  minDate?: Date;

  /**
   * Earliest selectable time.
   *
   * @default undefined
   */
  minTime?: Date;

  /**
   * Dual calendar arrangement forwarded to `CalendarRange`.
   *
   * @default "horizontal"
   */
  orientation?: CalendarRangeOrientation;

  /**
   * Prevents selection.
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Border radius of calendar / time tiles and chrome.
   *
   * `DateTimeRangeField` always forwards its own `rounded` here so the picker
   * matches the field, independent of `DateTimeRangePicker.defaultProps`.
   *
   * @default "md"
   */
  rounded?: MergeProps<CalendarRounded, DateTimeRangePickerRoundedOverrides>;

  /**
   * Shows Cancel / Apply footer. Selection is draft until Apply.
   *
   * @default false
   */
  showFooter?: boolean;

  /**
   * Shows seconds in the panel and formatted value.
   *
   * @default false
   */
  showSeconds?: boolean;

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
  tokens?: DateTimeRangePickerTokens;

  /**
   * Controlled value.
   *
   * @default undefined
   */
  value?: null | DateRangeValue;
}

export type DateTimeRangePickerProps = MergeHtmlProps<
  DateTimeRangePickerOwnProps,
  HTMLAttributes
>;
