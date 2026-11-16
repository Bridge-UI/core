// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

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
  arrow?: HTMLAttributes;

  /**
   * Props forwarded to the floating content (`role="dialog"`).
   */
  content?: HTMLAttributes;

  /**
   * Props forwarded to the root wrapper (contains the trigger).
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the title element.
   */
  title?: HTMLAttributes;

  /**
   * Props forwarded to the trigger wrapper.
   */
  trigger?: HTMLAttributes;
}

export interface PopoverEmits {
  /**
   * Emitted when the user dismisses the popover (Escape, click-away or focus leaving).
   * Not emitted when the parent sets `v-model` to `false` directly.
   */
  close: [];
}

/**
 * Anchored, non-modal floating panel for free-form content (forms, filters, cards).
 * Visibility is controlled with `v-model` (not listed here — `defineModel` handles it).
 * Anchor with `anchorEl` or put the opener in the `trigger` slot.
 */
export interface PopoverOwnProps {
  /**
   * Element that anchors the popover. When set, it is used
   * for positioning and click-away instead of the `trigger` slot wrapper.
   * Not merged into Bridge defaults (DOM nodes must not be deep-merged).
   *
   * @default undefined
   */
  anchorEl?: null | HTMLElement;

  /**
   * Whether to show an arrow pointing at the anchor.
   *
   * @default false
   */
  arrow?: boolean;

  /**
   * The classes to apply to the popover.
   *
   * @default undefined
   */
  classes?: PopoverClasses;

  /**
   * Whether the popover closes when clicking outside the trigger and content.
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
   * Whether the popover closes when focus moves outside the trigger and
   * content (Tab past the last field, for example).
   *
   * @default true
   */
  closeOnFocusOut?: boolean;

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
   * Called when `show` should change (controlled state without `v-model`).
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
   * The `title` slot takes precedence.
   *
   * @default undefined
   */
  title?: string;
}

export interface PopoverSlots {
  /**
   * The popover content. Receives `close` to dismiss from inside.
   */
  default?: Slot<{ close: () => void }>;

  /**
   * Custom heading content (labels the dialog).
   */
  title?: Slot<undefined>;

  /**
   * The trigger element that opens the popover.
   */
  trigger?: Slot<undefined>;
}

export type PopoverProps = MergeHtmlProps<PopoverOwnProps, HTMLAttributes>;
