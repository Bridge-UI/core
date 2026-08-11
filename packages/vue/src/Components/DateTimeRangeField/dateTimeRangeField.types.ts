// ** External Imports
import type { InputHTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  DateRangeValue,
  DisableDatesInput,
  DisableTimesInput,
  FieldOverlayMode,
  MergeHtmlProps,
  StartOfWeek,
} from "@bridge-ui/core";

// ** Local Imports
import type { CalendarDateDayCell } from "@/Components/CalendarDate/calendarDate.types";
import type { CalendarRangeOrientation } from "@/Components/CalendarRange";
import type { DateTimeRangePickerCustomProps } from "@/Components/DateTimeRangePicker/dateTimeRangePicker.types";
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

export interface DateTimeRangeFieldClasses extends FormFieldClasses {
  /**
   * Classes merged onto the clear control.
   */
  clear?: string;
}

export interface DateTimeRangeFieldCustomProps extends FormFieldCustomProps {
  /**
   * Props forwarded to the clear `Icon` (`icon` is set by `DateTimeRangeField`).
   *
   * @default undefined
   */
  clearIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the nested `DateTimeRangePicker`.
   *
   * @default undefined
   */
  dateTimeRangePicker?: DateTimeRangePickerCustomProps;

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

export interface DateTimeRangeFieldEmits {
  /**
   * Emitted when the range selection changes.
   */
  change: [value: null | DateRangeValue];

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

export interface DateTimeRangeFieldOwnProps extends Omit<
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
  classes?: DateTimeRangeFieldClasses;

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
  customProps?: DateTimeRangeFieldCustomProps;

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
   * Minute step between time options.
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
   * Dual calendar arrangement forwarded to `DateTimeRangePicker`.
   * On mobile, `drawer` / `modal` overlays default to `vertical` when unset.
   *
   * @default "horizontal"
   */
  orientation?: CalendarRangeOrientation;

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

export interface DateTimeRangeFieldSlots extends FormFieldSlots {
  /**
   * Custom content inside each day button on the nested calendar.
   *
   * @default undefined
   */
  day?: Slot<CalendarDateDayCell>;
}

export type DateTimeRangeFieldProps = MergeHtmlProps<
  DateTimeRangeFieldOwnProps,
  InputHTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   *
   * @default undefined
   */
  modelValue?: null | DateRangeValue;
};
