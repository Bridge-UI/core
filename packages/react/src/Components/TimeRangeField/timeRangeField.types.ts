// ** External Imports
import type { InputHTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  DisableTimesInput,
  FieldOverlayMode,
  TimeRangeValue,
} from "@bridge-ui/core/Domain";
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

// ** Local Imports
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
import type {
  TimeRangePickerCustomProps,
  TimeRangePickerSlots,
} from "@/Components/TimeRangePicker";

export interface TimeRangeFieldClasses extends FormFieldClasses {
  /**
   * Classes merged onto the clear control.
   */
  clear?: string;
}

export interface TimeRangeFieldCallbacks {
  /**
   * Called when Apply is pressed (`showFooter`).
   */
  onApply?: () => void;

  /**
   * Called when Cancel is pressed (`showFooter`).
   */
  onCancel?: () => void;

  /**
   * Called when the selected range changes.
   */
  onChange?: (value: null | TimeRangeValue) => void;

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

export interface TimeRangeFieldCustomProps extends FormFieldCustomProps {
  /**
   * Props forwarded to the clear `Icon` (`icon` is set by `TimeRangeField`).
   *
   * @default undefined
   */
  clearIcon?: Partial<Omit<IconProps, "icon">>;

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

  /**
   * Props forwarded to the nested `TimeRangePicker`.
   *
   * @default undefined
   */
  timeRangePicker?: TimeRangePickerCustomProps;
}

export interface TimeRangeFieldOwnProps extends Omit<
  FormFieldOwnProps,
  "field" | "slots" | "classes" | "customProps"
> {
  /**
   * Uses a 12-hour clock with an AM/PM column.
   *
   * @default false
   */
  ampm?: boolean;

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
  classes?: TimeRangeFieldClasses;

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
  customProps?: TimeRangeFieldCustomProps;

  /**
   * Uncontrolled initial value.
   *
   * @default null
   */
  defaultValue?: null | TimeRangeValue;

  /**
   * Times that cannot be selected.
   *
   * @default undefined
   */
  disableTimes?: DisableTimesInput;

  /**
   * Minute step between options.
   *
   * @default 1
   */
  interval?: number;

  /**
   * Latest selectable time.
   *
   * @default undefined
   */
  maxTime?: Date;

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
   * Shows Cancel / Apply on the nested picker. When unset, defaults to `true` for dialog
   * shells (`modal` / `drawer`).
   *
   * @default false (`true` for `modal` / `drawer` when unset)
   */
  showFooter?: boolean;

  /**
   * Shows seconds in the panel and formatted value.
   *
   * @default false
   */
  showSeconds?: boolean;

  /**
   * Named slots (`FormField` slots + footer).
   *
   * @default undefined
   */
  slots?: FormFieldSlots & TimeRangePickerSlots;

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
  value?: null | TimeRangeValue;
}

export type TimeRangeFieldProps = MergeHtmlProps<
  TimeRangeFieldOwnProps & TimeRangeFieldCallbacks,
  InputHTMLAttributes<HTMLInputElement>
>;
