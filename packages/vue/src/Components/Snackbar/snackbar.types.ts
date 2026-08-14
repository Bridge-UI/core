// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  SnackbarColor,
  SnackbarPadding,
  SnackbarPosition,
  SnackbarRounded,
  SnackbarTransition,
} from "@bridge-ui/core/Tokens/Snackbar";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type { IconProps } from "@/Components/Icon";

export interface SnackbarColorOverrides {}
export interface SnackbarPaddingOverrides {}
export interface SnackbarRoundedOverrides {}
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

  /**
   * Emitted after the leave transition when `v-model` is already `false`.
   *
   * @internal Used by `BridgeSnackbarHost` to remove registry entries.
   * Listen with `@leave-complete` / `v-on:leave-complete`.
   */
  "leave-complete": [];

  /**
   * Emitted when `v-model` visibility should change (controlled state).
   * Listen with `@show-change` / `v-on:show-change`.
   */
  "show-change": [show: boolean];
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
  duration?: false | number;

  /**
   * The icon to display. Use `null` to hide the icon.
   */
  icon?: null | IconSource;

  /**
   * Avatar image URL (shown instead of icon when set).
   */
  img?: string;

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
   * The roundedness of the snackbar panel.
   *
   * @default "lg"
   */
  rounded?: MergeProps<SnackbarRounded, SnackbarRoundedOverrides>;

  /**
   * Pre-assigned stack id (BridgeSnackbarHost).
   */
  stackId?: string;

  /**
   * Portal target. `false` renders inline without layer stack.
   *
   * @default "body"
   */
  teleportTo?: false | string;

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
  actions?: Slot<undefined>;

  /**
   * Content below the title/description.
   */
  default?: Slot<undefined>;

  /**
   * Custom description markup.
   */
  description?: Slot<undefined>;

  /**
   * Custom icon markup.
   */
  icon?: Slot<undefined>;

  /**
   * Vertical action column on the right edge.
   */
  right?: Slot<undefined>;

  /**
   * Custom title markup.
   */
  title?: Slot<undefined>;

  /**
   * Content before the close button (e.g. compact accept action with `padding="small"`).
   */
  trailing?: Slot<undefined>;
}

export type SnackbarProps = MergeHtmlProps<SnackbarOwnProps, HTMLAttributes>;
