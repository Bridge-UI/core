// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  DisableTimesInput,
  FieldOverlayFooterSlotProps,
  TimeValue,
} from "@bridge-ui/core/Domain";
import type { TimeColor, TimeRounded } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ButtonOwnProps } from "@/Components/Button";

export interface TimePickerColorOverrides {}
export interface TimePickerRoundedOverrides {}

/**
 * Props accepted by the footer buttons, pinned to the native `button` element.
 */
type TimePickerFooterButtonProps = Partial<
  MergeHtmlProps<
    Omit<ButtonOwnProps, "as">,
    ButtonHTMLAttributes<HTMLButtonElement>
  >
>;

export interface TimePickerClasses {
  /**
   * Classes for the footer.
   */
  footer?: string;

  /**
   * Classes for the root element.
   */
  root?: string;
}

export interface TimePickerCallbacks {
  /**
   * Called when Apply is pressed (`showFooter`).
   */
  onApply?: () => void;

  /**
   * Called when Cancel is pressed.
   */
  onCancel?: () => void;

  /**
   * Called when Apply is pressed (`showFooter`) or when the value commits.
   */
  onChange?: (value: null | TimeValue) => void;
}

export interface TimePickerCustomProps {
  /**
   * Props forwarded to the Apply button.
   *
   * @default undefined
   */
  applyButton?: TimePickerFooterButtonProps;

  /**
   * Props forwarded to the Cancel button.
   *
   * @default undefined
   */
  cancelButton?: TimePickerFooterButtonProps;

  /**
   * Props forwarded to the footer.
   *
   * @default undefined
   */
  footer?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLDivElement>;
}

export interface TimePickerOwnProps {
  /**
   * Uses a 12-hour clock with an AM/PM column.
   *
   * @default false
   */
  ampm?: boolean;

  /**
   * Classes for picker regions.
   *
   * @default undefined
   */
  classes?: TimePickerClasses;

  /**
   * Accent color.
   *
   * @default "primary"
   */
  color?: MergeProps<TimeColor, TimePickerColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: TimePickerCustomProps;

  /**
   * Uncontrolled initial value.
   *
   * @default null
   */
  defaultValue?: null | TimeValue;

  /**
   * Disables the picker.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Times that cannot be selected.
   *
   * @default undefined
   */
  disableTimes?: DisableTimesInput;

  /**
   * When `true`, applies the error color palette to tiles.
   *
   * @default false
   */
  error?: boolean;

  /**
   * When `true`, fills the container width.
   * When `false` or unset, stays at the minimum width.
   *
   * @default false
   */
  fill?: boolean;

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
   * Prevents selection.
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Border radius of the picker shell, time tiles, and chrome.
   *
   * The shell uses the Menu panel scale (`full` caps at `rounded-panel-full`).
   * Time tiles keep a true pill when `rounded` is `full`.
   *
   * `TimeField` always forwards its own `rounded` here so the picker matches the
   * field, independent of `TimePicker.defaultProps`.
   *
   * @default "md"
   */
  rounded?: MergeProps<TimeRounded, TimePickerRoundedOverrides>;

  /**
   * Shows Cancel / Apply footer. Selection is draft until Apply.
   * Nested fields forward their own `showFooter` (dialog overlays default to `true`).
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
   * Named slots (`footer` for Cancel / Apply).
   *
   * @default undefined
   */
  slots?: TimePickerSlots;

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
  value?: null | TimeValue;
}

export interface TimePickerSlots {
  /**
   * Custom footer. Replaces Cancel / Apply. Call `apply()` to commit and close
   * the overlay, or `cancel()` to discard and close.
   *
   * @default undefined
   */
  footer?: (ctx: FieldOverlayFooterSlotProps) => ReactNode;
}

export type TimePickerProps = MergeHtmlProps<
  TimePickerOwnProps & TimePickerCallbacks,
  HTMLAttributes<HTMLDivElement>
>;
