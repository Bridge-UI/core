// ** External Imports
import type { Slot } from "vue";

// ** Core Imports
import type {
  MergeProps,
  ModalRounded,
  ModalShadow,
  ModalSize,
} from "@bridge-ui/core";

export interface ModalSizeOverrides {}
export interface ModalRoundedOverrides {}
export interface ModalShadowOverrides {}

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
   * Whether the modal is open.
   *
   * @default false
   */
  modelValue?: boolean;

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
}

export interface ModalSlots {
  /**
   * Custom close button content.
   */
  close?: Slot<undefined>;

  /**
   * The main content of the modal.
   */
  default?: Slot<undefined>;

  /**
   * The footer content of the modal.
   */
  footer?: Slot<undefined>;

  /**
   * The header content of the modal.
   */
  header?: Slot<undefined>;
}
