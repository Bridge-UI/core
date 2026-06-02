// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

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
   * Props forwarded to the centering wrapper.
   */
  wrapper?: HTMLAttributes;
}

/**
 * Modal shell (overlay, portal, backdrop). Put `Card` or any content in the default slot.
 * Visibility is controlled with `v-model:show` (not listed here — use the model binding).
 */
export interface ModalOwnProps {
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
  partsProps?: ModalPartsProps;

  /**
   * When true, escape and overlay clicks do not close the modal.
   *
   * @default false
   */
  persistent?: boolean;

  /**
   * The max width of the dialog panel.
   *
   * @default "md"
   */
  size?: MergeProps<ModalSize, ModalSizeOverrides>;

  /**
   * Where to teleport the modal. Pass `false` to render in place.
   *
   * @default "body"
   */
  teleportTo?: string | false;
}

export type ModalProps = MergeHtmlProps<ModalOwnProps, HTMLAttributes>;

export interface ModalSlots {
  /**
   * Modal content (e.g. a `Card` component).
   */
  default?: Slot<undefined>;
}
