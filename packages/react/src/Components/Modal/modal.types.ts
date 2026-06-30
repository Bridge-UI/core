// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  ModalAlign,
  ModalBlur,
  ModalScroll,
  ModalSize,
  ModalTransition,
} from "@bridge-ui/core";

export interface ModalBlurOverrides {}
export interface ModalSizeOverrides {}
export interface ModalAlignOverrides {}
export interface ModalScrollOverrides {}
export interface ModalTransitionOverrides {}

export interface ModalClasses {
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
   * The classes to apply to the centering wrapper.
   */
  wrapper?: string;
}

export interface ModalCustomProps {
  /**
   * Props forwarded to the overlay.
   */
  overlay?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the dialog panel.
   */
  panel?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the root portal container.
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the centering wrapper.
   */
  wrapper?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Modal shell (overlay, portal, backdrop). Put `Card` or any content as `children`.
 * Control visibility with `show` and `onShowChange`.
 */
export interface ModalOwnProps {
  /**
   * Panel position from the `sm` breakpoint up (`{row}-{column}` grid).
   * Mobile always uses bottom sheet (`bottom-center`).
   *
   * @default "middle-center"
   */
  align?: MergeProps<ModalAlign, ModalAlignOverrides>;

  /**
   * When true, focuses the first focusable element inside the dialog on open.
   *
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Backdrop blur on the overlay.
   *
   * @default "none"
   */
  blur?: MergeProps<ModalBlur, ModalBlurOverrides>;

  /**
   * The children to render inside the dialog panel.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * The classes to apply to the modal.
   *
   * @default undefined
   */
  classes?: ModalClasses;

  /**
   * Whether the modal closes on escape key press.
   *
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Whether the modal closes on overlay click.
   *
   * @default true
   */
  closeOnOverlay?: boolean;

  /**
   * Props forwarded to each modal part.
   *
   * @default undefined
   */
  customProps?: ModalCustomProps;

  /**
   * When true, focus is not trapped inside the modal while open.
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
   * When true, body scroll is not locked while the modal is open.
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
   * When true, the modal stays mounted in the DOM after closing (hidden).
   *
   * @default false
   */
  keepMounted?: boolean;

  /**
   * Called when the user dismisses the modal (overlay click or Escape).
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
   * When true, escape and overlay clicks do not close the modal.
   *
   * @default false
   */
  persistent?: boolean;

  /**
   * Where scroll happens: the page (`body`) or the dialog panel (`paper`).
   *
   * @default "body"
   */
  scroll?: MergeProps<ModalScroll, ModalScrollOverrides>;

  /**
   * Whether the modal is visible.
   *
   * @default false
   */
  show?: boolean;

  /**
   * Max width of the dialog from the `sm` breakpoint up (`sm:max-w-*`).
   *
   * @default "md"
   */
  size?: MergeProps<ModalSize, ModalSizeOverrides>;

  /**
   * Stack id assigned when the modal opens. Set by BridgeModalHost; do not set in app code.
   *
   * @internal
   */
  stackId?: string;

  /**
   * Where to portal the modal. Pass `false` to render in place.
   *
   * @default "body"
   */
  teleportTo?: false | string;

  /**
   * Enter/leave animation for overlay and panel.
   *
   * @default "fade"
   */
  transition?: MergeProps<ModalTransition, ModalTransitionOverrides>;
}

export type ModalProps = MergeHtmlProps<
  ModalOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
