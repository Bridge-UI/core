// ** External Imports
import type { InputHTMLAttributes } from "vue";

// ** Core Imports
import type {
  DisableTimesInput,
  MergeHtmlProps,
  TimeValue,
} from "@bridge-ui/core";

// ** Local Imports
import type {
  FormFieldClasses,
  FormFieldCustomProps,
  FormFieldOwnProps,
  FormFieldSlots,
} from "@/Components/FormField/formField.types";
import type { MenuOwnProps } from "@/Components/Menu/menu.types";
import type { TimePickerCustomProps } from "@/Components/TimePicker/timePicker.types";

export interface TimeFieldClasses extends FormFieldClasses {}

export interface TimeFieldCustomProps extends FormFieldCustomProps {
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
   * Props forwarded to the nested `TimePicker`.
   *
   * @default undefined
   */
  timePicker?: TimePickerCustomProps;
}

export interface TimeFieldEmits {
  /**
   * Emitted when the selected time changes.
   */
  change: [value: null | TimeValue];

  /**
   * Emitted when the menu closes.
   */
  close: [];

  /**
   * Emitted when the menu opens.
   */
  open: [];
}

export interface TimeFieldOwnProps extends Omit<
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
  classes?: TimeFieldClasses;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: TimeFieldCustomProps;

  /**
   * Uncontrolled initial value.
   *
   * @default null
   */
  defaultValue?: null | TimeValue;

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

export interface TimeFieldSlots extends FormFieldSlots {}

export type TimeFieldProps = MergeHtmlProps<
  TimeFieldOwnProps,
  InputHTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   *
   * @default undefined
   */
  modelValue?: null | TimeValue;
};
