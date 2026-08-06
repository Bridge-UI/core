// ** External Imports
import type { InputHTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  DateRangeValue,
  DisableDatesInput,
  MergeHtmlProps,
  StartOfWeek,
} from "@bridge-ui/core";

// ** Local Imports
import type { CalendarDateDayCell } from "@/Components/CalendarDate/calendarDate.types";
import type { DateRangePickerCustomProps } from "@/Components/DateRangePicker/dateRangePicker.types";
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

export interface DateRangeFieldEmits {
  /**
   * Emitted when the range selection changes.
   */
  change: [value: null | DateRangeValue];

  /**
   * Emitted when the menu closes.
   */
  close: [];

  /**
   * Emitted when the menu opens.
   */
  open: [];
}

export interface DateRangeFieldOwnProps extends Omit<
  FormFieldOwnProps,
  "field" | "classes" | "customProps"
> {
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
   * Shows Cancel / Apply on the nested picker.
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
}

export interface DateRangeFieldSlots extends FormFieldSlots {
  /**
   * Custom content inside each day button on the nested calendars.
   *
   * @default undefined
   */
  day?: Slot<CalendarDateDayCell>;
}

export type DateRangeFieldProps = MergeHtmlProps<
  DateRangeFieldOwnProps,
  InputHTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   *
   * @default undefined
   */
  modelValue?: null | DateRangeValue;
};
