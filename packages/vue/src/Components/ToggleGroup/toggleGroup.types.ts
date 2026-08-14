// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  ToggleGroupColor,
  ToggleGroupOrientation,
  ToggleGroupRounded,
  ToggleGroupSize,
  ToggleGroupVariant,
} from "@bridge-ui/core";

export interface ToggleGroupSizeOverrides {}
export interface ToggleGroupColorOverrides {}
export interface ToggleGroupRoundedOverrides {}
export interface ToggleGroupVariantOverrides {}
export interface ToggleGroupOrientationOverrides {}

export interface ToggleGroupClasses {
  /**
   * Classes merged onto the root track.
   */
  root?: string;
}

export interface ToggleGroupCustomProps {
  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

export interface ToggleGroupEmits {
  /**
   * Emitted when the selected value changes.
   */
  change: [value: string];

  /**
   * Emitted when `v-model` should update.
   */
  "update:modelValue": [value: string];
}

/**
 * Segmented control root. Compose with `ToggleItem` children.
 */
export interface ToggleGroupOwnProps {
  /**
   * Classes for toggle group parts.
   *
   * @default undefined
   */
  classes?: ToggleGroupClasses;

  /**
   * Accent color for the selected segment.
   *
   * @default "primary"
   */
  color?: MergeProps<ToggleGroupColor, ToggleGroupColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: ToggleGroupCustomProps;

  /**
   * Disable the entire group.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Stretch the track to the container width.
   *
   * @default false
   */
  full?: boolean;

  /**
   * Layout orientation of the track.
   *
   * @default "horizontal"
   */
  orientation?: MergeProps<
    ToggleGroupOrientation,
    ToggleGroupOrientationOverrides
  >;

  /**
   * Track and segment roundness.
   *
   * @default "full"
   */
  rounded?: MergeProps<ToggleGroupRounded, ToggleGroupRoundedOverrides>;

  /**
   * Size of the track and segments.
   *
   * @default "md"
   */
  size?: MergeProps<ToggleGroupSize, ToggleGroupSizeOverrides>;

  /**
   * Visual style of the selected segment.
   *
   * @default "solid"
   */
  variant?: MergeProps<ToggleGroupVariant, ToggleGroupVariantOverrides>;
}

export interface ToggleGroupSlots {
  /**
   * The children to render (`ToggleItem` segments).
   */
  default?: Slot<undefined>;
}

export type ToggleGroupProps = MergeHtmlProps<
  ToggleGroupOwnProps,
  HTMLAttributes
> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   */
  modelValue?: string;
};
