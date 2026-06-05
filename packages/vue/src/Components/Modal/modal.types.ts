// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  ModalAlign,
  ModalBlur,
  ModalSize,
  ModalTransition,
} from "@bridge-ui/core";

export interface ModalBlurOverrides {}
export interface ModalSizeOverrides {}
export interface ModalAlignOverrides {}
export interface ModalTransitionOverrides {}

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

export interface ModalEmits {
  /**
   * Emitted when the user dismisses the modal (overlay or Escape).
   * Not emitted when the parent sets `v-model` to `false` directly.
   */
  close: [];
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
 * Visibility is controlled with `v-model` (not listed here — `defineModel` handles it).
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
   * Backdrop blur on the overlay.
   *
   * @default "none"
   */
  blur?: MergeProps<ModalBlur, ModalBlurOverrides>;

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
   * Where to teleport the modal. Pass `false` to render in place.
   *
   * @default "body"
   */
  teleportTo?: string | false;

  /**
   * Enter/leave animation for overlay and panel.
   *
   * @default "fade"
   */
  transition?: MergeProps<ModalTransition, ModalTransitionOverrides>;
}

export type ModalProps = MergeHtmlProps<ModalOwnProps, HTMLAttributes>;

export interface ModalSlots {
  /**
   * Modal content (e.g. a `Card` component).
   */
  default?: Slot<undefined>;
}
