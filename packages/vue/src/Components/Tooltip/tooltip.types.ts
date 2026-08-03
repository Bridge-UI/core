// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  PositionPlacement,
  PositionStrategy,
  TooltipColor,
  TooltipRounded,
  TooltipSize,
} from "@bridge-ui/core";

export interface TooltipSizeOverrides {}
export interface TooltipColorOverrides {}
export interface TooltipRoundedOverrides {}

export interface TooltipClasses {
  /**
   * The classes to apply to the arrow.
   */
  arrow?: string;

  /**
   * The classes to apply to the content.
   */
  content?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the trigger.
   */
  trigger?: string;
}

export interface TooltipCustomProps {
  /**
   * Props forwarded to the arrow element.
   */
  arrow?: HTMLAttributes;

  /**
   * Props forwarded to the floating tooltip panel.
   */
  content?: HTMLAttributes;

  /**
   * Props forwarded to the root wrapper (contains the trigger).
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the trigger wrapper.
   */
  trigger?: HTMLAttributes;
}

export interface TooltipEmits {
  /**
   * Emitted when `show` should change (controlled state without `v-model`).
   */
  "show-change": [show: boolean];
}

/**
 * Anchored tooltip. Visibility uses `v-model` (omit for uncontrolled hover/focus
 * when using the `trigger` slot). Anchor with `anchorEl` or put the opener in
 * the `trigger` slot. Use `content` for plain text, or the default slot for
 * custom panel body (default slot wins when both are set).
 */
export interface TooltipOwnProps {
  /**
   * Element that anchors the tooltip panel. When set, it is used
   * for positioning instead of the `trigger` slot wrapper.
   * Prefer this when the opener lives outside the `Tooltip` or is controlled manually.
   * Not merged into Bridge defaults (DOM nodes must not be deep-merged).
   *
   * @default undefined
   */
  anchorEl?: null | HTMLElement;

  /**
   * Whether the tooltip shows an arrow pointing at the trigger.
   *
   * @default true
   */
  arrow?: boolean;

  /**
   * The classes to apply to the tooltip.
   *
   * @default undefined
   */
  classes?: TooltipClasses;

  /**
   * Delay in ms before closing after pointer leave / blur.
   *
   * @default 0
   */
  closeDelay?: number;

  /**
   * The color of the tooltip.
   *
   * @default "dark"
   */
  color?: MergeProps<TooltipColor, TooltipColorOverrides>;

  /**
   * Plain text for the tooltip panel. Prefer the default slot for custom markup.
   *
   * @default undefined
   */
  content?: string;

  /**
   * Extra props for internal parts (`root`, `trigger`, `content`, `arrow`).
   * Root HTML attributes stay on the component top level.
   *
   * @default undefined
   */
  customProps?: TooltipCustomProps;

  /**
   * When true, the tooltip does not open on hover or focus.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Gap between the trigger and the tooltip panel (px).
   *
   * @default 8
   */
  offset?: number;

  /**
   * Called when `show` should change (controlled state without `v-model`).
   *
   * @default undefined
   */
  onShowChange?: (show: boolean) => void;

  /**
   * Delay in ms before opening after pointer enter / focus.
   *
   * @default 200
   */
  openDelay?: number;

  /**
   * Preferred placement of the tooltip relative to the anchor (Floating UI).
   *
   * @default "top"
   */
  placement?: PositionPlacement;

  /**
   * The roundedness of the tooltip panel.
   *
   * @default "md"
   */
  rounded?: MergeProps<TooltipRounded, TooltipRoundedOverrides>;

  /**
   * The size of the tooltip.
   *
   * @default "md"
   */
  size?: MergeProps<TooltipSize, TooltipSizeOverrides>;

  /**
   * CSS position strategy for the floating panel.
   *
   * @default "fixed"
   */
  strategy?: PositionStrategy;

  /**
   * Where to portal the tooltip panel. Pass `false` to render in place.
   *
   * @default "body"
   */
  teleportTo?: false | string;
}

export interface TooltipSlots {
  /**
   * Custom panel body. Wins over the `content` prop when both are set.
   */
  default?: Slot<undefined>;

  /**
   * The trigger element that opens the tooltip.
   */
  trigger?: Slot<undefined>;
}

export type TooltipProps = MergeHtmlProps<TooltipOwnProps, HTMLAttributes>;
