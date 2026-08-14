// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes } from "vue";

// ** Core Imports
import type { DisableTimesInput, TimeValue } from "@bridge-ui/core/Domain";
import type {
  TimeColor,
  TimeColorItem,
  TimeRounded,
} from "@bridge-ui/core/Tokens/Time";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

export interface TimePanelColorOverrides {}
export interface TimePanelRoundedOverrides {}

export interface TimePanelClasses {
  /**
   * Classes for each scrollable column.
   */
  column?: string;

  /**
   * Classes for each time tile button.
   */
  item?: string;

  /**
   * Classes for the root element.
   */
  root?: string;
}

export interface TimePanelCustomProps {
  /**
   * Props forwarded to each scrollable column.
   *
   * @default undefined
   */
  column?: HTMLAttributes;

  /**
   * Props forwarded to each time tile button.
   *
   * @default undefined
   */
  item?: ButtonHTMLAttributes;

  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

export interface TimePanelEmits {
  /**
   * Emitted when the selected time changes.
   */
  change: [value: Date | null];
}

export interface TimePanelTokens {
  /**
   * Color token map overrides.
   */
  color?: Record<string, Partial<TimeColorItem>>;

  /**
   * Border radius token map overrides.
   */
  rounded?: Record<string, string>;
}

export interface TimePanelOwnProps {
  /**
   * Uses a 12-hour clock with an AM/PM column.
   *
   * @default false
   */
  ampm?: boolean;

  /**
   * Classes for panel regions.
   *
   * @default undefined
   */
  classes?: TimePanelClasses;

  /**
   * Accent color for time tiles.
   *
   * @default "primary"
   */
  color?: MergeProps<TimeColor, TimePanelColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: TimePanelCustomProps;

  /**
   * Disables the entire panel.
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
   * Prevents selection while keeping tiles visible.
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Border radius of time tiles.
   *
   * @default "md"
   */
  rounded?: MergeProps<TimeRounded, TimePanelRoundedOverrides>;

  /**
   * Shows a seconds column and includes seconds in the selected value.
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

  /**
   * Token overrides.
   *
   * @default undefined
   */
  tokens?: TimePanelTokens;

  /**
   * Selected time (`Date` wall clock).
   *
   * @default undefined
   */
  value?: null | TimeValue;
}

export type TimePanelProps = MergeHtmlProps<TimePanelOwnProps, HTMLAttributes>;
