// ** External Imports
import type { InputHTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  DatePickerModel,
  DisableDatesInput,
  MergeHtmlProps,
  StartOfWeek,
} from "@bridge-ui/core";

// ** Local Imports
import type { CalendarView } from "@/Components/Calendar";
import type { DatePickerCustomProps } from "@/Components/DatePicker";
import type {
  FormFieldClasses,
  FormFieldCustomProps,
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";
import type { MenuOwnProps } from "@/Components/Menu/menu.types";

export interface DateInputClasses extends FormFieldClasses {}

export interface DateInputCustomProps extends FormFieldCustomProps {
  /**
   * Props forwarded to the nested `DatePicker`.
   *
   * @default undefined
   */
  datePicker?: DatePickerCustomProps;

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

export interface DateInputCallbacks {
  /**
   * Called when the selection model changes.
   */
  onChange?: (value: DatePickerModel) => void;

  /**
   * Called when the menu closes.
   */
  onClose?: () => void;

  /**
   * Called when the menu opens.
   */
  onOpen?: () => void;
}

export interface DateInputOwnProps extends Omit<
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
  classes?: DateInputClasses;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: DateInputCustomProps;

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
   * Locale for formatting / labels.
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
   * Shows Cancel / Apply on the nested picker.
   *
   * @default false
   */
  showFooter?: boolean;

  /**
   * Named slots (FormField slots).
   *
   * @default undefined
   */
  slots?: FormFieldSlots;

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
  value?: DatePickerModel;
}

export type DateInputProps = MergeHtmlProps<
  DateInputOwnProps & DateInputCallbacks,
  InputHTMLAttributes<HTMLInputElement>
>;
