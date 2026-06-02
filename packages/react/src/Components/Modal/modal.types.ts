// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { MergeHtmlProps, MergeProps, ModalSize } from "@bridge-ui/core";

export interface ModalSizeOverrides {}

export interface ModalClasses {
  /**
   * The classes to apply to the overlay.
   */
  overlay?: string;

  /**
   * The classes to apply to the dialog panel (max-width wrapper).
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

export interface ModalPartsProps {
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
   * Called when the modal requests to close (overlay, escape).
   * Sugar for `onShowChange(false)`.
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
   * Props forwarded to each modal part.
   *
   * @default undefined
   */
  partsProps?: ModalPartsProps;

  /**
   * When true, escape and overlay clicks do not close the modal.
   *
   * @default false
   */
  persistent?: boolean;

  /**
   * Whether the modal is visible.
   *
   * @default false
   */
  show?: boolean;

  /**
   * The max width of the dialog panel.
   *
   * @default "md"
   */
  size?: MergeProps<ModalSize, ModalSizeOverrides>;

  /**
   * Where to portal the modal. Pass `false` to render in place.
   *
   * @default "body"
   */
  teleportTo?: string | false;
}

export type ModalProps = MergeHtmlProps<
  ModalOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
