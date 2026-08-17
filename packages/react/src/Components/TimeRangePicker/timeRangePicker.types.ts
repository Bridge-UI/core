// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  DisableTimesInput,
  FieldOverlayFooterSlotProps,
  RangePickerOrientation,
  TimeRangeValue,
} from "@bridge-ui/core/Domain";
import type {
  TimeColor,
  TimeColorItem,
  TimeRounded,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { ButtonOwnProps } from "@/Components/Button";

export interface TimeRangePickerColorOverrides {}
export interface TimeRangePickerRoundedOverrides {}

/**
 * Props accepted by the footer buttons, pinned to the native `button` element.
 */
type TimeRangePickerFooterButtonProps = Partial<
  MergeHtmlProps<
    Omit<ButtonOwnProps, "as">,
    ButtonHTMLAttributes<HTMLButtonElement>
  >
>;

export interface TimeRangePickerCallbacks {
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
  onChange?: (value: null | TimeRangeValue) => void;
}

export interface TimeRangePickerClasses {
  /**
   * Classes for the end time panel wrapper.
   */
  end?: string;

  /**
   * Classes for the end panel title.
   */
  endTitle?: string;

  /**
   * Classes for the footer.
   */
  footer?: string;

  /**
   * Classes for the panels row.
   */
  panels?: string;

  /**
   * Classes for the root element.
   */
  root?: string;

  /**
   * Classes for the start time panel wrapper.
   */
  start?: string;

  /**
   * Classes for the start panel title.
   */
  startTitle?: string;
}

export interface TimeRangePickerCustomProps {
  /**
   * Props forwarded to the Apply button.
   *
   * @default undefined
   */
  applyButton?: TimeRangePickerFooterButtonProps;

  /**
   * Props forwarded to the Cancel button.
   *
   * @default undefined
   */
  cancelButton?: TimeRangePickerFooterButtonProps;

  /**
   * Props forwarded to the end time panel wrapper.
   *
   * @default undefined
   */
  end?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the footer.
   *
   * @default undefined
   */
  footer?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the panels row.
   *
   * @default undefined
   */
  panels?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the start time panel wrapper.
   *
   * @default undefined
   */
  start?: HTMLAttributes<HTMLDivElement>;
}

export interface TimeRangePickerOwnProps {
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
  classes?: TimeRangePickerClasses;

  /**
   * Accent color.
   *
   * @default "primary"
   */
  color?: MergeProps<TimeColor, TimeRangePickerColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: TimeRangePickerCustomProps;

  /**
   * Uncontrolled initial value.
   *
   * @default null
   */
  defaultValue?: null | TimeRangeValue;

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
   * Label above the end time panel.
   *
   * @default "End time"
   */
  endTitle?: string;

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
   * Layout of start / end time panels.
   *
   * @default "horizontal"
   */
  orientation?: RangePickerOrientation;

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
   * `TimeRangeField` always forwards its own `rounded` here so the picker matches
   * the field, independent of `TimeRangePicker.defaultProps`.
   *
   * @default "md"
   */
  rounded?: MergeProps<TimeRounded, TimeRangePickerRoundedOverrides>;

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
  slots?: TimeRangePickerSlots;

  /**
   * Label above the start time panel.
   *
   * @default "Start time"
   */
  startTitle?: string;

  /**
   * IANA time zone.
   *
   * @default undefined
   */
  timeZone?: string;

  /**
   * Token overrides.
   *
   * @default undefined
   */
  tokens?: TimeRangePickerTokens;

  /**
   * Controlled value.
   *
   * @default undefined
   */
  value?: null | TimeRangeValue;
}

export interface TimeRangePickerSlots {
  /**
   * Custom footer. Replaces Cancel / Apply. Call `apply()` to commit and close
   * the overlay, or `cancel()` to discard and close.
   *
   * @default undefined
   */
  footer?: (ctx: FieldOverlayFooterSlotProps) => ReactNode;
}

export interface TimeRangePickerTokens {
  /**
   * Color token map overrides.
   */
  color?: Record<string, Partial<TimeColorItem>>;

  /**
   * Border radius token map overrides.
   */
  rounded?: Record<string, string>;

  /**
   * Nested time panel token overrides.
   */
  time?: {
    color?: Record<string, Partial<TimeColorItem>>;
    rounded?: Record<string, string>;
  };
}

export type TimeRangePickerProps = MergeHtmlProps<
  TimeRangePickerOwnProps & TimeRangePickerCallbacks,
  HTMLAttributes<HTMLDivElement>
>;
