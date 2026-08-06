// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

// ** Core Imports
import type {
  CalendarColor,
  CalendarColorItem,
  CalendarDay,
  CalendarRounded,
  DateRangeValue,
  DisableDatesInput,
  MergeHtmlProps,
  MergeProps,
  StartOfWeek,
} from "@bridge-ui/core";

// ** Local Imports
import type { ButtonOwnProps } from "@/Components/Button";
import type { CalendarDateSlots } from "@/Components/CalendarDate";
import type { CalendarRangeOrientation } from "@/Components/CalendarRange";

export interface DateRangePickerColorOverrides {}
export interface DateRangePickerRoundedOverrides {}

/**
 * Props accepted by the footer buttons, pinned to the native `button` element.
 */
type DateRangePickerFooterButtonProps = Partial<
  MergeHtmlProps<
    Omit<ButtonOwnProps, "as">,
    ButtonHTMLAttributes<HTMLButtonElement>
  >
>;

export interface DateRangePickerClasses {
  /**
   * Classes for the footer.
   */
  footer?: string;

  /**
   * Classes for the root element.
   */
  root?: string;
}

export interface DateRangePickerCustomProps {
  /**
   * Props forwarded to the Apply button.
   *
   * @default undefined
   */
  applyButton?: DateRangePickerFooterButtonProps;

  /**
   * Props forwarded to the Cancel button.
   *
   * @default undefined
   */
  cancelButton?: DateRangePickerFooterButtonProps;

  /**
   * Props forwarded to the footer.
   *
   * @default undefined
   */
  footer?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLDivElement>;
}

export interface DateRangePickerCallbacks {
  /**
   * Called when Cancel is pressed.
   */
  onCancel?: () => void;

  /**
   * Called when Apply is pressed (`showFooter`) or when the value commits.
   */
  onChange?: (value: null | DateRangeValue) => void;
}

export interface DateRangePickerTokens {
  /**
   * Nested calendar token overrides.
   */
  calendar?: {
    color?: Record<string, Partial<CalendarColorItem>>;
    day?: Partial<CalendarDay>;
    rounded?: Record<string, string>;
  };

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

export interface DateRangePickerOwnProps {
  /**
   * Classes for picker regions.
   *
   * @default undefined
   */
  classes?: DateRangePickerClasses;

  /**
   * Accent color.
   *
   * @default "primary"
   */
  color?: MergeProps<CalendarColor, DateRangePickerColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: DateRangePickerCustomProps;

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
   * Border radius of calendar tiles and chrome.
   *
   * @default "md"
   */
  rounded?: MergeProps<CalendarRounded, DateRangePickerRoundedOverrides>;

  /**
   * Shows Cancel / Apply footer. Selection is draft until Apply.
   *
   * @default false
   */
  showFooter?: boolean;

  /**
   * Named slots forwarded to `CalendarRange` (`day`).
   *
   * @default undefined
   */
  slots?: Pick<CalendarDateSlots, "day">;

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
  tokens?: DateRangePickerTokens;

  /**
   * Controlled value.
   *
   * @default undefined
   */
  value?: null | DateRangeValue;
}

export type DateRangePickerProps = MergeHtmlProps<
  DateRangePickerOwnProps & DateRangePickerCallbacks,
  HTMLAttributes<HTMLDivElement>
>;
