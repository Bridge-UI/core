// ** External Imports
import type { Snippet } from "svelte";
import type { HTMLAttributes, HTMLButtonAttributes } from "svelte/elements";

// ** Core Imports
import type { SliderRangeValue, SliderStopInput } from "@bridge-ui/core/Domain";
import type { SliderColor, SliderRounded } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  BaseFieldClasses,
  BaseFieldCustomProps,
  BaseFieldOwnProps,
  BaseFieldSnippets,
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
  bar?: HTMLAttributes<HTMLElement>;

  /**
   * Props forwarded to stop markers.
   */
  stop?: HTMLAttributes<HTMLElement>;

  /**
   * Props forwarded to stop labels.
   */
  stopLabel?: HTMLAttributes<HTMLElement>;

  /**
   * Props forwarded to the row that holds the stop labels.
   */
  stopLabels?: HTMLAttributes<HTMLElement>;

  /**
   * Props forwarded to thumb hit-area buttons.
   */
  thumb?: Partial<HTMLButtonAttributes>;

  /**
   * Props forwarded to the visible thumb knob.
   */
  thumbKnob?: HTMLAttributes<HTMLElement>;

  /**
   * Props forwarded to each value `Tooltip` (`content` is owned by the slider).
   */
  tooltip?: Partial<Omit<TooltipOwnProps, "content" | "anchorEl">>;

  /**
   * Props forwarded to the track element.
   */
  track?: HTMLAttributes<HTMLElement>;
}

export interface SliderOwnProps extends Omit<
  BaseFieldOwnProps,
  "classes" | "customProps"
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
   * Called when the slider value changes.
   *
   * @default undefined
   */
  onChange?: (value: number | SliderRangeValue) => void;

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

export interface SliderSnippets extends Omit<BaseFieldSnippets, "children"> {
  /**
   * Optional custom thumb content (replaces the default knob).
   */
  thumb?: Snippet;
}

export type SliderProps = MergeHtmlProps<
  SliderOwnProps &
    SliderSnippets & {
      /**
       * Current value. Bindable (`bind:value`); omit for uncontrolled use with
       * `defaultValue`.
       *
       * @default undefined
       */
      value?: number | SliderRangeValue;
    },
  Omit<HTMLAttributes<HTMLDivElement>, "color" | "defaultValue">
>;
