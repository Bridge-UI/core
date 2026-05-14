// ** External Imports
import type { ReactNode } from "react";

// ** Core Imports
import type {
  MergeProps,
  ModalRounded,
  ModalShadow,
  ModalSize,
} from "@bridge-ui/core";

export interface ModalSizeOverrides {}
export interface ModalShadowOverrides {}
export interface ModalRoundedOverrides {}

export interface ModalClasses {
  /**
   * The classes to apply to the body.
   */
  body?: string;

  /**
   * The classes to apply to the close button.
   */
  close?: string;

  /**
   * The classes to apply to the content.
   */
  content?: string;

  /**
   * The classes to apply to the footer.
   */
  footer?: string;

  /**
   * The classes to apply to the header.
   */
  header?: string;

  /**
   * The classes to apply to the overlay.
   */
  overlay?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface ModalProps {
  /**
   * The children to render.
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
   * Callback when the modal is closed.
   *
   * @default undefined
   */
  onClose?: () => void;

  /**
   * Whether the modal is open.
   *
   * @default false
   */
  open?: boolean;

  /**
   * The roundedness of the modal.
   *
   * @default "md"
   */
  rounded?: MergeProps<ModalRounded, ModalRoundedOverrides>;

  /**
   * The shadow to apply to the modal.
   *
   * @default "lg"
   */
  shadow?: MergeProps<ModalShadow, ModalShadowOverrides>;

  /**
   * The size of the modal.
   *
   * @default "md"
   */
  size?: MergeProps<ModalSize, ModalSizeOverrides>;

  /**
   * The slots to apply to the modal.
   *
   * @default undefined
   */
  slots?: ModalSlots;
}

export interface ModalSlots {
  /**
   * The slot for the close button.
   */
  close?: ReactNode;

  /**
   * The slot for the footer.
   */
  footer?: ReactNode;

  /**
   * The slot for the header.
   */
  header?: ReactNode;
}
