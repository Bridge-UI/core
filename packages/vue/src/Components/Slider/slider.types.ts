// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { SliderRangeValue, SliderStopInput } from "@bridge-ui/core/Domain";
import type { SliderColor, SliderRounded } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  BaseFieldClasses,
  BaseFieldCustomProps,
  BaseFieldOwnProps,
  BaseFieldSlots,
} from "@/Components/BaseField/baseField.types";
import type { TooltipOwnProps } from "@/Components/Tooltip/tooltip.types";

export type {
  SliderRangeValue,
  SliderStop,
  SliderStopInput,
} from "@bridge-ui/core/Domain";

export interface SliderSizeOverrides {}
export interface SliderColorOverrides {}
export interface SliderRoundedOverrides {}

export interface SliderClasses extends BaseFieldClasses {
  /**
   * Classes for the filled bar.
   */
  bar?: string;

  /**
   * Classes for stop markers.
   */
  stop?: string;

  /**
   * Classes for stop labels.
   */
  stopLabel?: string;

  /**
   * Classes for the row that holds the stop labels.
   */
  stopLabels?: string;

  /**
   * Classes for thumb hit-area wrappers.
   */
  thumb?: string;

  /**
   * Classes for the visible thumb knob.
   */
  thumbKnob?: string;

  /**
   * Classes for the track.
   */
  track?: string;
}

export interface SliderCustomProps extends BaseFieldCustomProps {
  /**
   * Props forwarded to the filled bar.
   */
  bar?: HTMLAttributes;

  /**
   * Props forwarded to stop markers.
   */
  stop?: HTMLAttributes;

  /**
   * Props forwarded to stop labels.
   */
  stopLabel?: HTMLAttributes;

  /**
   * Props forwarded to the row that holds the stop labels.
   */
  stopLabels?: HTMLAttributes;

  /**
   * Props forwarded to thumb hit-area buttons.
   */
  thumb?: Partial<ButtonHTMLAttributes>;

  /**
   * Props forwarded to the visible thumb knob.
   */
  thumbKnob?: HTMLAttributes;

  /**
   * Props forwarded to each value `Tooltip` (`content` is owned by the slider).
   */
  tooltip?: Partial<
    Omit<TooltipOwnProps, "slots" | "content" | "anchorEl" | "modelValue">
  >;

  /**
   * Props forwarded to the track element.
   */
  track?: HTMLAttributes;
}

export interface SliderEmits {
  /**
   * Emitted when the slider value changes.
   * Listen with `@change` / `v-on:change`.
   */
  change: [value: number | SliderRangeValue];

  /**
   * Emitted when `v-model` should update.
   */
  "update:modelValue": [value: number | SliderRangeValue];
}

export interface SliderOwnProps extends Omit<
  BaseFieldOwnProps,
  "field" | "slots" | "classes" | "children" | "customProps"
> {
  /**
   * Classes for the field chrome and the slider control.
   *
   * @default undefined
   */
  classes?: SliderClasses;

  /**
   * The color to apply to the slider bar and thumbs.
   *
   * @default "primary"
   */
  color?: MergeProps<SliderColor, SliderColorOverrides>;

  /**
   * Extra props for internal parts (`track`, `thumb`, `tooltip`, …).
   *
   * @default undefined
   */
  customProps?: SliderCustomProps;

  /**
   * Uncontrolled initial value. Use a tuple when `range` is enabled.
   *
   * @default min (or `[min, min]` when `range`)
   */
  defaultValue?: number | SliderRangeValue;

  /**
   * Maximum value of the slider.
   *
   * @default 100
   */
  max?: number;

  /**
   * Minimum value of the slider.
   *
   * @default 0
   */
  min?: number;

  /**
   * When `true`, the slider selects a range with two thumbs.
   *
   * @default false
   */
  range?: boolean;

  /**
   * The roundedness of the track and bar.
   *
   * @default "full"
   */
  rounded?: MergeProps<SliderRounded, SliderRoundedOverrides>;

  /**
   * When `true`, renders stop marks (from `stops`, or every `step` when
   * `stops` is empty).
   *
   * @default false
   */
  showStops?: boolean;

  /**
   * When `true`, shows a Tooltip with the current value on each thumb.
   *
   * @default true
   */
  showTooltip?: boolean;

  /**
   * Step increment between values.
   *
   * @default 1
   */
  step?: number;

  /**
   * Custom stop marks. Numbers are treated as `{ value }`.
   *
   * @default undefined
   */
  stops?: readonly SliderStopInput[];
}

export interface SliderSlots extends BaseFieldSlots {
  /**
   * Optional custom thumb content (replaces the default knob).
   */
  thumb?: Slot;
}

export type SliderProps = MergeHtmlProps<
  SliderOwnProps,
  Omit<HTMLAttributes, "color" | "defaultValue">
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   */
  modelValue?: number | SliderRangeValue;
};
