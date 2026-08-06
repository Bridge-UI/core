// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type {
  DisableTimesInput,
  MergeHtmlProps,
  TimeRangeValue,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldCustomProps,
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";
import type { MenuOwnProps } from "@/Components/Menu/menu.types";
import type { TimeRangePickerCustomProps } from "@/Components/TimeRangePicker/timeRangePicker.types";

export interface TimeRangeFieldClasses extends FormFieldClasses {}

export interface TimeRangeFieldCustomProps extends FormFieldCustomProps {
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
   * Shows Cancel / Apply on the nested picker.
   *
   * @default false
   */
  showFooter?: boolean;

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
