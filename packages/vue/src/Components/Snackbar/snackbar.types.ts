// ** External Imports
import type { LucideIcon } from "lucide-vue-next";
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  SnackbarColor,
  SnackbarPadding,
  SnackbarPosition,
  SnackbarTransition,
} from "@bridge-ui/core";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";

export interface SnackbarColorOverrides {}
export interface SnackbarPaddingOverrides {}
export interface SnackbarPositionOverrides {}
export interface SnackbarTransitionOverrides {}

export interface SnackbarClasses {
  /**
   * The classes to apply to the inline actions slot wrapper.
   */
  actions?: string;

  /**
   * The classes to apply to the main content wrapper.
   */
  content?: string;

  /**
   * The classes to apply to the description.
   */
  description?: string;

  /**
   * The classes to apply to the icon.
   */
  icon?: string;

  /**
   * The classes to apply to the fixed portal layer (standalone snackbar only).
   */
  portal?: string;

  /**
   * The classes to apply to the progress bar.
   */
  progress?: string;

  /**
   * The classes to apply to the right actions slot wrapper.
   */
  right?: string;

  /**
   * The classes to apply to the root panel.
   */
  root?: string;

  /**
   * The classes to apply to the title.
   */
  title?: string;
}

export interface SnackbarCustomProps {
  /**
   * Props forwarded to the main content wrapper.
   */
  content?: HTMLAttributes;

  /**
   * Props forwarded to the description element.
   */
  description?: HTMLAttributes;

  /**
   * Props forwarded to the default `Icon` (`icon` is set by the snackbar).
   */
  icon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the fixed portal layer (standalone snackbar only).
   */
  portal?: HTMLAttributes;

  /**
   * Props forwarded to the progress bar track.
   */
  progress?: HTMLAttributes;

  /**
   * Props forwarded to the root panel.
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the title element.
   */
  title?: HTMLAttributes;
}

export interface SnackbarEmits {
  /**
   * Emitted when the snackbar requests to close.
   */
  close: [];
}

/**
 * Toast / notification panel. Sets `role="status"` and `aria-live="polite"` by default.
 * Use the `actions` and `right` slots for custom actions; imperative presets live in `useSnackbarAction`.
 */
export interface SnackbarOwnProps {
  /**
   * The classes to apply to the snackbar.
   */
  classes?: SnackbarClasses;

  /**
   * Whether to show the close button.
   *
   * @default true
   */
  closeButton?: boolean;

  /**
   * Tint color for the default icon.
   *
   * @default "primary"
   */
  color?: MergeProps<SnackbarColor, SnackbarColorOverrides>;

  /**
   * Extra props for internal parts (`icon`, `title`, `description`, etc.).
   */
  customProps?: SnackbarCustomProps;

  /**
   * Body text below the title.
   */
  description?: string;

  /**
   * Auto-dismiss delay in ms. `false` disables the timer.
   *
   * @default 5000
   */
  duration?: number | false;

  /**
   * The icon to display. Use `null` to hide the icon.
   */
  icon?: LucideIcon | null;

  /**
   * Avatar image URL (shown instead of icon when set).
   */
  img?: string;

  /**
   * Called when `v-model` visibility should change (controlled state).
   */
  onShowChange?: (show: boolean) => void;

  /**
   * Padding for the content area.
   *
   * @default "medium"
   */
  padding?: MergeProps<SnackbarPadding, SnackbarPaddingOverrides>;

  /**
   * Viewport anchor when portaled (standalone). Ignored when `teleportTo={false}`.
   *
   * @default "bottom-center"
   */
  position?: MergeProps<SnackbarPosition, SnackbarPositionOverrides>;

  /**
   * Whether to show the countdown progress bar when `duration` is set.
   *
   * @default true
   */
  progressbar?: boolean;

  /**
   * Pre-assigned stack id (BridgeSnackbarHost).
   */
  stackId?: string;

  /**
   * Portal target. `false` renders inline without layer stack.
   *
   * @default "body"
   */
  teleportTo?: string | false;

  /**
   * Headline text.
   */
  title?: string;

  /**
   * Enter/leave animation preset.
   *
   * @default "slide"
   */
  transition?: MergeProps<SnackbarTransition, SnackbarTransitionOverrides>;
}

export interface SnackbarSlots {
  /**
   * Inline actions below the description.
   */
  actions?: Slot;

  /**
   * Content below the title/description.
   */
  default?: Slot;

  /**
   * Custom description markup.
   */
  description?: Slot;

  /**
   * Custom icon markup.
   */
  icon?: Slot;

  /**
   * Vertical action column on the right edge (WireUI `rightButtons` layout).
   */
  right?: Slot;

  /**
   * Custom title markup.
   */
  title?: Slot;

  /**
   * Content before the close button (e.g. compact accept action with `padding="small"`).
   */
  trailing?: Slot;
}

export type SnackbarProps = MergeHtmlProps<SnackbarOwnProps, HTMLAttributes>;
