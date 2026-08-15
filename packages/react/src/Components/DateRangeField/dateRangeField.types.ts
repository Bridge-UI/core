// ** External Imports
import type { InputHTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  DateRangeValue,
  DisableDatesInput,
  FieldOverlayMode,
  StartOfWeek,
} from "@bridge-ui/core/Domain";
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { CalendarRangeOrientation } from "@/Components/CalendarRange";
import type {
  DateRangePickerCustomProps,
  DateRangePickerSlots,
} from "@/Components/DateRangePicker";
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

export interface DateRangeFieldClasses extends FormFieldClasses {
  /**
   * Classes merged onto the clear control.
   */
  clear?: string;
}

export interface DateRangeFieldCustomProps extends FormFieldCustomProps {
  /**
   * Props forwarded to the clear `Icon` (`icon` is set by `DateRangeField`).
   *
   * @default undefined
   */
  clearIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the nested `DateRangePicker`.
   *
   * @default undefined
   */
  dateRangePicker?: DateRangePickerCustomProps;

  /**
   * Props forwarded to the nested `Drawer` when overlay resolves to drawer.
   *
   * @default undefined
   */
  drawer?: Partial<Omit<DrawerOwnProps, "show" | "children" | "onShowChange">>;

  /**
   * Props forwarded to the floating `Menu` when overlay resolves to menu.
   *
   * @default undefined
   */
  menu?: Partial<Omit<MenuOwnProps, "show" | "children" | "onShowChange">>;

  /**
   * Props forwarded to the nested `Modal` when overlay resolves to modal.
   *
   * @default undefined
   */
  modal?: Partial<Omit<ModalOwnProps, "show" | "children" | "onShowChange">>;
}

export interface DateRangeFieldCallbacks {
  /**
   * Called when Apply is pressed (`showFooter`).
   */
  onApply?: () => void;

  /**
   * Called when Cancel is pressed (`showFooter`).
   */
  onCancel?: () => void;

  /**
   * Called when the range selection changes.
   */
  onChange?: (value: null | DateRangeValue) => void;

  /**
   * Called when the value is cleared.
   */
  onClear?: () => void;

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
   * Dual calendar arrangement forwarded to `DateRangePicker`.
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
   * Shows Cancel / Apply on the nested picker. When unset, defaults to `true` for dialog
   * shells (`modal` / `drawer`).
   *
   * @default false (`true` for `modal` / `drawer` when unset)
   */
  showFooter?: boolean;

  /**
   * Named slots (`FormField` slots + calendar `day` + footer).
   *
   * @default undefined
   */
  slots?: FormFieldSlots & DateRangePickerSlots;

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
