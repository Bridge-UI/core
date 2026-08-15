// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  DrawerBlur,
  DrawerPlacement,
  DrawerScroll,
  DrawerSize,
  DrawerTransition,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

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
   * The classes to apply to the dialog panel.
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
  overlay?: HTMLAttributes;

  /**
   * Props forwarded to the dialog panel.
   */
  panel?: HTMLAttributes;

  /**
   * Props forwarded to the root portal container.
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the placement wrapper.
   */
  wrapper?: HTMLAttributes;
}

export interface DrawerEmits {
  /**
   * Emitted when the user dismisses the drawer (overlay or Escape).
   * Not emitted when the parent sets `v-model` to `false` directly.
   */
  close: [];

  /**
   * Emitted when `show` should change (controlled state).
   * Listen with `@show-change` / `v-on:show-change`.
   */
  "show-change": [show: boolean];
}

/**
 * Drawer shell (overlay, portal, backdrop). Put any content in the default slot.
 * Visibility is controlled with `v-model` (not listed here — `defineModel` handles it).
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
   * When true, escape and overlay clicks do not close the drawer.
   *
   * @default false
   */
  persistent?: boolean;

  /**
   * Edge the panel docks to.
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
   * Where to teleport the drawer. Pass `false` to render in place.
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

export interface DrawerSlots {
  /**
   * Drawer content.
   */
  default?: Slot<undefined>;
}

export type DrawerProps = MergeHtmlProps<DrawerOwnProps, HTMLAttributes>;
