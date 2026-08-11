// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type {
  DisableTimesInput,
  FieldOverlayMode,
  MergeHtmlProps,
  TimeRangeValue,
} from "@bridge-ui/core";

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
import type { TimeRangePickerCustomProps } from "@/Components/TimeRangePicker/timeRangePicker.types";

export interface TimeRangeFieldClasses extends FormFieldClasses {
  /**
   * Classes merged onto the clear control.
   */
  clear?: string;
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

  /**
   * Props forwarded to the nested `TimeRangePicker`.
   *
   * @default undefined
   */
  timeRangePicker?: TimeRangePickerCustomProps;
}

export interface TimeRangeFieldEmits {
  /**
   * Emitted when the selected range changes.
   */
  change: [value: null | TimeRangeValue];

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

export interface TimeRangeFieldOwnProps extends Omit<
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
   * IANA time zone.
   *
   * @default undefined
   */
  timeZone?: string;
}

export interface TimeRangeFieldSlots extends FormFieldSlots {}

export type TimeRangeFieldProps = MergeHtmlProps<
  TimeRangeFieldOwnProps,
  InputHTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   *
   * @default undefined
   */
  modelValue?: null | TimeRangeValue;
};
