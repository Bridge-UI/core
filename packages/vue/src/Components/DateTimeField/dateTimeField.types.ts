// ** External Imports
import type { InputHTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  DisableDatesInput,
  DisableTimesInput,
  FieldOverlayMode,
  StartOfWeek,
} from "@bridge-ui/core/Domain";
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { CalendarView } from "@/Components/Calendar/calendar.types";
import type { CalendarDateDayCell } from "@/Components/CalendarDate/calendarDate.types";
import type { DateTimePickerCustomProps } from "@/Components/DateTimePicker/dateTimePicker.types";
import type { DrawerOwnProps } from "@/Components/Drawer/drawer.types";
import type {
  FormFieldClasses,
  FormFieldCustomProps,
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";
import type { IconProps } from "@/Components/Icon";
import type { MenuOwnProps } from "@/Components/Menu/menu.types";
import type { ModalOwnProps } from "@/Components/Modal/modal.types";

export interface DateTimeFieldClasses extends FormFieldClasses {
  /**
   * Classes merged onto the clear control.
   */
  clear?: string;
}

export interface DateTimeFieldCustomProps extends FormFieldCustomProps {
  /**
   * Props forwarded to the clear `Icon` (`icon` is set by `DateTimeField`).
   *
   * @default undefined
   */
  clearIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the nested `DateTimePicker`.
   *
   * @default undefined
   */
  dateTimePicker?: DateTimePickerCustomProps;

  /**
   * Props forwarded to the nested `Drawer` when overlay resolves to drawer.
   *
   * @default undefined
   */
  drawer?: Partial<DrawerOwnProps>;

  /**
   * Props forwarded to the floating `Menu` when overlay resolves to menu.
   *
   * @default undefined
   */
  menu?: Partial<MenuOwnProps>;

  /**
   * Props forwarded to the nested `Modal` when overlay resolves to modal.
   *
   * @default undefined
   */
  modal?: Partial<ModalOwnProps>;
}

export interface DateTimeFieldEmits {
  /**
   * Emitted when the selected date-time changes.
   */
  change: [value: Date | null];

  /**
   * Emitted when the value is cleared.
   */
  clear: [];

  /**
   * Emitted when the menu closes.
   */
  close: [];

  /**
   * Emitted when the menu opens.
   */
  open: [];
}

export interface DateTimeFieldOwnProps extends Omit<
  FormFieldOwnProps,
  "field" | "classes" | "customProps"
> {
  /**
   * Uses a 12-hour clock with an AM/PM column.
   *
   * @default false
   */
  ampm?: boolean;

  /**
   * Classes for field / input regions.
   *
   * @default undefined
   */
  classes?: DateTimeFieldClasses;

  /**
   * Whether the value can be cleared.
   *
   * @default true
   */
  clearable?: boolean;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: DateTimeFieldCustomProps;

  /**
   * Uncontrolled initial value.
   *
   * @default null
   */
  defaultValue?: Date | null;

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
   * Which overlay shell opens the picker. `auto` uses `menu` on desktop and
   * `drawer` (bottom) on mobile.
   *
   * @default "auto"
   */
  overlay?: FieldOverlayMode;

  /**
   * Shows Cancel / Apply on the nested picker. When unset, defaults to `true`
   * on mobile.
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
}

export interface DateTimeFieldSlots extends FormFieldSlots {
  /**
   * Custom content inside each day button on the nested calendar.
   *
   * @default undefined
   */
  day?: Slot<CalendarDateDayCell>;
}

export type DateTimeFieldProps = MergeHtmlProps<
  DateTimeFieldOwnProps,
  InputHTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   *
   * @default undefined
   */
  modelValue?: Date | null;
};
