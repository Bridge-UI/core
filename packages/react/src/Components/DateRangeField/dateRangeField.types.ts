// ** External Imports
import type { InputHTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  DateRangeValue,
  DisableDatesInput,
  MergeHtmlProps,
  StartOfWeek,
} from "@bridge-ui/core";

// ** Local Imports
import type { CalendarDateSlots } from "@/Components/CalendarDate";
import type { CalendarRangeOrientation } from "@/Components/CalendarRange";
import type { DateRangePickerCustomProps } from "@/Components/DateRangePicker";
import type {
  FormFieldClasses,
  FormFieldCustomProps,
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";
import type { MenuOwnProps } from "@/Components/Menu/menu.types";

export interface DateRangeFieldClasses extends FormFieldClasses {}

export interface DateRangeFieldCustomProps extends FormFieldCustomProps {
  /**
   * Props forwarded to the nested `DateRangePicker`.
   *
   * @default undefined
   */
  dateRangePicker?: DateRangePickerCustomProps;

  /**
   * Props forwarded to the floating `Menu`.
   *
   * @default undefined
   */
  menu?: Partial<
    Pick<
      MenuOwnProps,
      "shadow" | "classes" | "rounded" | "placement" | "customProps"
    >
  >;
}

export interface DateRangeFieldCallbacks {
  /**
   * Called when the range selection changes.
   */
  onChange?: (value: null | DateRangeValue) => void;

  /**
   * Called when the menu closes.
   */
  onClose?: () => void;

  /**
   * Called when the menu opens.
   */
  onOpen?: () => void;
}

export interface DateRangeFieldOwnProps extends Omit<
  FormFieldOwnProps,
  "field" | "slots" | "classes" | "customProps"
> {
  /**
   * Children (unused; prefer slots).
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for field / input regions.
   *
   * @default undefined
   */
  classes?: DateRangeFieldClasses;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: DateRangeFieldCustomProps;

  /**
   * Uncontrolled initial value.
   *
   * @default null
   */
  defaultValue?: null | DateRangeValue;

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
   * Dual calendar arrangement forwarded to `DateRangePicker`.
   *
   * @default "horizontal"
   */
  orientation?: CalendarRangeOrientation;

  /**
   * Shows Cancel / Apply on the nested picker.
   *
   * @default false
   */
  showFooter?: boolean;

  /**
   * Named slots (`FormField` slots + calendar `day`).
   *
   * @default undefined
   */
  slots?: FormFieldSlots & Pick<CalendarDateSlots, "day">;

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
   * Controlled value.
   *
   * @default undefined
   */
  value?: null | DateRangeValue;
}

export type DateRangeFieldProps = MergeHtmlProps<
  DateRangeFieldOwnProps & DateRangeFieldCallbacks,
  InputHTMLAttributes<HTMLInputElement>
>;
