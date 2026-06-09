// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  MenuRounded,
  MenuShadow,
  MergeHtmlProps,
  MergeProps,
  PositionPlacement,
  PositionStrategy,
} from "@bridge-ui/core";

export interface MenuShadowOverrides {}
export interface MenuRoundedOverrides {}

export interface MenuClasses {
  /**
   * The classes to apply to the content.
   */
  content?: string;

  /**
   * The classes to apply to the group.
   */
  group?: string;

  /**
   * The classes to apply to the item.
   */
  item?: string;

  /**
   * The classes to apply to the label.
   */
  label?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the separator.
   */
  separator?: string;

  /**
   * The classes to apply to the trigger.
   */
  trigger?: string;
}

export interface MenuPartsProps {
  /**
   * Props forwarded to the floating menu panel.
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

/**
 * Anchored menu panel (MUI `Menu`-like). Control visibility with `show` and `onShowChange`.
 * Anchor with `anchorEl` (MUI style) or put the opener in `slots.trigger`; menu items go in `children`.
 */
export interface MenuOwnProps {
  /**
   * Element that anchors the menu panel (MUI `anchorEl`). When set, it is used
   * for positioning and click-away instead of the `trigger` slot wrapper.
   * Prefer this when the opener lives outside the `Menu` or is controlled manually.
   * Not merged into Bridge defaults (DOM nodes must not be deep-merged).
   *
   * @default undefined
   */
  anchorEl?: HTMLElement | null;

  /**
   * The children to render inside the menu panel.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * The classes to apply to the menu.
   *
   * @default undefined
   */
  classes?: MenuClasses;

  /**
   * Whether the menu closes when clicking outside the trigger and panel.
   *
   * @default true
   */
  closeOnClickAway?: boolean;

  /**
   * Whether the menu closes on escape key press.
   *
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * When true, the menu does not auto-focus the first focusable item on open.
   *
   * @default false
   */
  disableAutoFocus?: boolean;

  /**
   * When true, body scroll is not locked while the menu is open.
   *
   * @default true
   */
  disableScrollLock?: boolean;

  /**
   * When true, the menu stays mounted in the DOM after closing (hidden).
   *
   * @default false
   */
  keepMounted?: boolean;

  /**
   * Gap between the trigger and the menu panel (px).
   *
   * @default 4
   */
  offset?: number;

  /**
   * Called when the user dismisses the menu (Escape or click-away).
   * Not fired when the parent sets `show={false}` directly — use `onShowChange` for that.
   * Sugar for `onShowChange(false)` on user dismiss.
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
   * Props forwarded to each menu part.
   *
   * @default undefined
   */
  partsProps?: MenuPartsProps;

  /**
   * When true, escape and click-away do not close the menu.
   *
   * @default false
   */
  persistent?: boolean;

  /**
   * Preferred placement of the menu relative to the anchor (Floating UI).
   *
   * @default "bottom-start"
   */
  placement?: PositionPlacement;

  /**
   * The roundedness of the menu panel.
   *
   * @default "md"
   */
  rounded?: MergeProps<MenuRounded, MenuRoundedOverrides>;

  /**
   * The shadow to apply to the menu panel.
   *
   * @default "md"
   */
  shadow?: MergeProps<MenuShadow, MenuShadowOverrides>;

  /**
   * Whether the menu is visible.
   *
   * @default false
   */
  show?: boolean;

  /**
   * The slots to apply to the menu.
   *
   * @default undefined
   */
  slots?: MenuSlots;

  /**
   * CSS position strategy for the floating panel.
   *
   * @default "fixed"
   */
  strategy?: PositionStrategy;

  /**
   * Where to portal the menu panel. Pass `false` to render in place.
   *
   * @default "body"
   */
  teleportTo?: string | false;
}

export interface MenuSlots {
  /**
   * The slot for the trigger element.
   */
  trigger?: ReactNode;
}

export type MenuProps = MergeHtmlProps<
  MenuOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
