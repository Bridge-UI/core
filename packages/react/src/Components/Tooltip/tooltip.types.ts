// ** External Imports
import type { HTMLAttributes, ReactNode, RefObject } from "react";

// ** Core Imports
import type {
  PositionPlacement,
  PositionStrategy,
} from "@bridge-ui/core/Runtime";
import type {
  TooltipColor,
  TooltipRounded,
  TooltipSize,
} from "@bridge-ui/core/Tokens/Tooltip";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

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
  arrow?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the floating tooltip panel.
   */
  content?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the root wrapper (contains the trigger).
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the trigger wrapper.
   */
  trigger?: HTMLAttributes<HTMLDivElement>;
}

export interface TooltipSlots {
  /**
   * The trigger element that opens the tooltip.
   */
  trigger?: ReactNode;
}

/**
 * Anchored tooltip. Control visibility with `show` and `onShowChange`
 * (or omit `show` for hover/focus when using `slots.trigger`).
 * Anchor with `anchorEl` or put the opener in `slots.trigger`.
 * Use `content` for plain text, or `children` for custom panel body
 * (`children` wins when both are set).
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
  anchorEl?: null | HTMLElement | RefObject<null | HTMLElement>;

  /**
   * Whether the tooltip shows an arrow pointing at the trigger.
   *
   * @default true
   */
  arrow?: boolean;

  /**
   * Custom panel body. Wins over `content` when both are set.
   *
   * @default undefined
   */
  children?: ReactNode;

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
   * Plain text for the tooltip panel. Prefer `children` for custom markup.
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
   * Called when `show` should change (controlled state).
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
   * Whether the tooltip is visible. Omit for uncontrolled hover/focus behavior
   * when using `slots.trigger`.
   *
   * @default undefined
   */
  show?: boolean;

  /**
   * The size of the tooltip.
   *
   * @default "md"
   */
  size?: MergeProps<TooltipSize, TooltipSizeOverrides>;

  /**
   * The slots to apply to the tooltip.
   *
   * @default undefined
   */
  slots?: TooltipSlots;

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

export type TooltipProps = MergeHtmlProps<
  TooltipOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
