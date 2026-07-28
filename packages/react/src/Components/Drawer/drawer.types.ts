// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  DrawerBlur,
  DrawerPlacement,
  DrawerScroll,
  DrawerSize,
  DrawerTransition,
  MergeHtmlProps,
  MergeProps,
} from "@bridge-ui/core";

export interface DrawerBlurOverrides {}
export interface DrawerSizeOverrides {}
export interface DrawerScrollOverrides {}
export interface DrawerPlacementOverrides {}
export interface DrawerTransitionOverrides {}

export interface DrawerClasses {
  /**
   * The classes to apply to the overlay.
   */
  overlay?: string;

  /**
   * The classes to apply to the drawer panel.
   */
  panel?: string;

  /**
   * The classes to apply to the root portal container.
   */
  root?: string;

  /**
   * The classes to apply to the placement wrapper.
   */
  wrapper?: string;
}

export interface DrawerCustomProps {
  /**
   * Props forwarded to the overlay.
   */
  overlay?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the drawer panel.
   */
  panel?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the root portal container.
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the placement wrapper.
   */
  wrapper?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Drawer shell (overlay, portal, backdrop, edge-docked panel). Put `Card` or
 * any content as `children`. Control visibility with `show` and `onShowChange`.
 */
export interface DrawerOwnProps {
  /**
   * Accessible name for the dialog panel (`aria-label`).
   *
   * @default undefined
   */
  ariaLabel?: string;

  /**
   * Id of the element that labels the dialog (`aria-labelledby`). Prefer over `ariaLabel` when a visible title exists.
   *
   * @default undefined
   */
  ariaLabelledBy?: string;

  /**
   * When true, focuses the first focusable element inside the drawer on open.
   *
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Backdrop blur on the overlay.
   *
   * @default "none"
   */
  blur?: MergeProps<DrawerBlur, DrawerBlurOverrides>;

  /**
   * The children to render inside the drawer panel.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * The classes to apply to the drawer.
   *
   * @default undefined
   */
  classes?: DrawerClasses;

  /**
   * Whether the drawer closes on escape key press.
   *
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Whether the drawer closes on overlay click.
   *
   * @default true
   */
  closeOnOverlay?: boolean;

  /**
   * Props forwarded to each drawer part.
   *
   * @default undefined
   */
  customProps?: DrawerCustomProps;

  /**
   * When true, focus is not trapped inside the drawer while open.
   *
   * @default false
   */
  disableEnforceFocus?: boolean;

  /**
   * When true, focus is not restored to the previously focused element on close.
   *
   * @default false
   */
  disableRestoreFocus?: boolean;

  /**
   * When true, body scroll is not locked while the drawer is open.
   *
   * @default false
   */
  disableScrollLock?: boolean;

  /**
   * When true, the backdrop overlay is not rendered.
   *
   * @default false
   */
  hideBackdrop?: boolean;

  /**
   * When true, the drawer stays mounted in the DOM after closing (hidden).
   *
   * @default false
   */
  keepMounted?: boolean;

  /**
   * Called when the user dismisses the drawer (overlay click or Escape).
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
   * When true, escape and overlay clicks do not close the drawer.
   *
   * @default false
   */
  persistent?: boolean;

  /**
   * Which edge the panel docks to.
   *
   * @default "left"
   */
  placement?: MergeProps<DrawerPlacement, DrawerPlacementOverrides>;

  /**
   * Where scroll happens: the page (`body`) or the drawer panel (`paper`).
   *
   * @default "paper"
   */
  scroll?: MergeProps<DrawerScroll, DrawerScrollOverrides>;

  /**
   * Whether the drawer is visible.
   *
   * @default false
   */
  show?: boolean;

  /**
   * Panel size along the placement axis (width for `left`/`right`, height for `top`/`bottom`).
   *
   * @default "md"
   */
  size?: MergeProps<DrawerSize, DrawerSizeOverrides>;

  /**
   * Stack id assigned when the drawer opens. Set by BridgeDrawerHost; do not set in app code.
   *
   * @internal
   */
  stackId?: string;

  /**
   * Where to portal the drawer. Pass `false` to render in place.
   *
   * @default "body"
   */
  teleportTo?: false | string;

  /**
   * Enter/leave animation for overlay and panel.
   *
   * @default "slide"
   */
  transition?: MergeProps<DrawerTransition, DrawerTransitionOverrides>;
}

export type DrawerProps = MergeHtmlProps<
  DrawerOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
