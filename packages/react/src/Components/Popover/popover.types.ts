// ** External Imports
import type { HTMLAttributes, ReactNode, RefObject } from "react";

// ** Core Imports
import type {
  PositionPlacement,
  PositionStrategy,
} from "@bridge-ui/core/Runtime";
import type { PopoverRounded, PopoverShadow } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

export interface PopoverShadowOverrides {}
export interface PopoverRoundedOverrides {}

export interface PopoverClasses {
  /**
   * The classes to apply to the arrow.
   */
  arrow?: string;

  /**
   * The classes to apply to the floating content.
   */
  content?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the title.
   */
  title?: string;

  /**
   * The classes to apply to the trigger.
   */
  trigger?: string;
}

export interface PopoverCustomProps {
  /**
   * Props forwarded to the arrow element.
   */
  arrow?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the floating content (`role="dialog"`).
   */
  content?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the root wrapper (contains the trigger).
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the title element.
   */
  title?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the trigger wrapper.
   */
  trigger?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Anchored, non-modal floating panel for free-form content (forms, filters, cards).
 * Control visibility with `show` and `onShowChange`. Anchor with `anchorEl`
 * or put the opener in `slots.trigger`.
 */
export interface PopoverOwnProps {
  /**
   * Element that anchors the popover. When set, it is used
   * for positioning and click-away instead of the `trigger` slot wrapper.
   * Not merged into Bridge defaults (DOM nodes must not be deep-merged).
   *
   * @default undefined
   */
  anchorEl?: null | HTMLElement | RefObject<null | HTMLElement>;

  /**
   * Whether to show an arrow pointing at the anchor.
   *
   * @default false
   */
  arrow?: boolean;

  /**
   * The popover content. Pass a function to receive `close`.
   *
   * @default undefined
   */
  children?: ReactNode | ((props: PopoverRenderProps) => ReactNode);

  /**
   * The classes to apply to the popover.
   *
   * @default undefined
   */
  classes?: PopoverClasses;

  /**
   * Whether the popover closes when clicking outside the trigger and content,
   * or when focus moves outside them.
   *
   * @default true
   */
  closeOnClickAway?: boolean;

  /**
   * Whether the popover closes on escape key press.
   *
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Props forwarded to each popover part.
   *
   * @default undefined
   */
  customProps?: PopoverCustomProps;

  /**
   * When true, the popover does not move focus into the content on open.
   *
   * @default false
   */
  disableAutoFocus?: boolean;

  /**
   * When true, body scroll is not locked while the popover is open.
   *
   * @default true
   */
  disableScrollLock?: boolean;

  /**
   * When true, the popover stays mounted in the DOM after closing (hidden).
   *
   * @default false
   */
  keepMounted?: boolean;

  /**
   * When true, the content width matches the trigger / anchor.
   *
   * @default false
   */
  matchWidth?: boolean;

  /**
   * Gap between the anchor and the content (px).
   *
   * @default 8
   */
  offset?: number;

  /**
   * Called when the user dismisses the popover (Escape, click-away or focus leaving).
   * Not fired when the parent sets `show={false}` directly.
   *
   * @default undefined
   */
  onClose?: () => void;

  /**
   * Called when `show` should change (controlled state).
   *
   * @default undefined
   */
  onShowChange?: (show: boolean) => void;

  /**
   * When true, escape, click-away and focus leaving do not close the popover.
   *
   * @default false
   */
  persistent?: boolean;

  /**
   * Preferred placement of the content relative to the anchor.
   *
   * @default "bottom-start"
   */
  placement?: PositionPlacement;

  /**
   * The roundedness of the content.
   *
   * @default "md"
   */
  rounded?: MergeProps<PopoverRounded, PopoverRoundedOverrides>;

  /**
   * The shadow to apply to the content.
   *
   * @default "md"
   */
  shadow?: MergeProps<PopoverShadow, PopoverShadowOverrides>;

  /**
   * Whether the popover is visible.
   *
   * @default false
   */
  show?: boolean;

  /**
   * The slots to apply to the popover.
   *
   * @default undefined
   */
  slots?: PopoverSlots;

  /**
   * CSS position strategy for the content.
   *
   * @default "fixed"
   */
  strategy?: PositionStrategy;

  /**
   * Where to portal the content. Pass `false` to render in place
   * (keeps the natural Tab order after the trigger).
   *
   * @default "body"
   */
  teleportTo?: false | string;

  /**
   * Heading rendered at the top of the content. Labels the dialog
   * (`aria-labelledby`); without it, pass `aria-label` via `customProps.content`.
   *
   * @default undefined
   */
  title?: ReactNode;
}

export interface PopoverRenderProps {
  /**
   * Closes the popover (also fires `onClose`).
   */
  close: () => void;
}

export interface PopoverSlots {
  /**
   * The slot for the trigger element.
   */
  trigger?: ReactNode;
}

export type PopoverProps = MergeHtmlProps<
  PopoverOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
