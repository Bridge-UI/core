// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  DateRangeValue,
  DisableDatesInput,
  FieldOverlayFooterSlotProps,
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
import type { ButtonProps } from "@/Components/Button/button.types";
import type { CalendarDateDayCell } from "@/Components/CalendarDate/calendarDate.types";
import type { CalendarRangeOrientation } from "@/Components/CalendarRange";

export interface DateRangePickerColorOverrides {}
export interface DateRangePickerRoundedOverrides {}

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

export interface DateRangePickerEmits {
  /**
   * Emitted when Apply is pressed (`showFooter`).
   */
  apply: [];

  /**
   * Emitted when Cancel is pressed.
   */
  cancel: [];

  /**
   * Emitted when Apply is pressed (`showFooter`) or when the value commits.
   */
  change: [value: null | DateRangeValue];
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
   * Border radius of the picker shell, calendar tiles, and chrome.
   *
   * The shell uses the Menu panel scale (`full` caps at `rounded-panel-full`).
   * Calendar tiles keep a true pill when `rounded` is `full`.
   *
   * @default "md"
   */
  rounded?: MergeProps<CalendarRounded, DateRangePickerRoundedOverrides>;

  /**
   * Shows Cancel / Apply footer. Selection is draft until Apply.
   * Nested fields forward their own `showFooter` (dialog overlays default to `true`).
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
  tokens?: DateRangePickerTokens;

  /**
   * Controlled value.
   *
   * @default undefined
   */
  value?: null | DateRangeValue;
}

export interface DateRangePickerSlots {
  /**
   * Custom content inside each day button on the nested calendars.
   *
   * @default undefined
   */
  day?: Slot<CalendarDateDayCell>;

  /**
   * Custom footer. Replaces Cancel / Apply. Call `apply()` to commit and close
   * the overlay, or `cancel()` to discard and close.
   *
   * @default undefined
   */
  footer?: Slot<FieldOverlayFooterSlotProps>;
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

export type DateRangePickerProps = MergeHtmlProps<
  DateRangePickerOwnProps,
  HTMLAttributes
>;
