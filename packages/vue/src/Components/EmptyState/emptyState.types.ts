// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { EmptyStateAlign, EmptyStateSize } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type { IconProps } from "@/Components/Icon";

export interface EmptyStateSizeOverrides {}
export interface EmptyStateAlignOverrides {}

export interface EmptyStateClasses {
  /**
   * The classes to apply to the actions row.
   */
  actions?: string;

  /**
   * The classes to apply to the description.
   */
  description?: string;

  /**
   * The classes to apply to the default `Icon`.
   */
  icon?: string;

  /**
   * The classes to apply to the media wrapper.
   */
  media?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the title.
   */
  title?: string;
}

export interface EmptyStateCustomProps {
  /**
   * Props forwarded to the actions row.
   */
  actions?: HTMLAttributes;

  /**
   * Props forwarded to the description container.
   */
  description?: HTMLAttributes;

  /**
   * Props forwarded to the default `Icon` (`icon` is set by the empty state).
   */
  icon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the media wrapper.
   */
  media?: HTMLAttributes;

  /**
   * Props forwarded to the root container.
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the title element.
   */
  title?: HTMLAttributes;
}

/**
 * Placeholder when a list, table, or view has no data.
 * Does not set `role` by default — pass `role="status"` when the empty
 * state is a live update.
 */
export interface EmptyStateOwnProps {
  /**
   * Horizontal alignment of the stack.
   *
   * @default "center"
   */
  align?: MergeProps<EmptyStateAlign, EmptyStateAlignOverrides>;

  /**
   * The classes to apply to the empty state.
   *
   * @default undefined
   */
  classes?: EmptyStateClasses;

  /**
   * Extra props for internal parts (`media`, `title`, `description`, etc.).
   * Root HTML attributes stay on the component top level.
   *
   * @default undefined
   */
  customProps?: EmptyStateCustomProps;

  /**
   * Supporting copy below the title.
   *
   * @default undefined
   */
  description?: string;

  /**
   * Default media icon. Use the `media` slot to replace it with custom markup.
   *
   * @default undefined
   */
  icon?: IconSource;

  /**
   * When true, the media wrapper is hidden from assistive tech (`aria-hidden`).
   *
   * @default true
   */
  mediaDecorative?: boolean;

  /**
   * Spacing and typography scale.
   *
   * @default "md"
   */
  size?: MergeProps<EmptyStateSize, EmptyStateSizeOverrides>;

  /**
   * Primary heading copy.
   *
   * @default undefined
   */
  title?: string;

  /**
   * Element used to render `title`. Use a heading when the page outline needs it.
   *
   * @default "p"
   */
  titleAs?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
}

export interface EmptyStateSlots {
  /**
   * Action row (e.g. one or more `Button`s).
   */
  action?: Slot<undefined>;

  /**
   * Replaces the default description copy.
   */
  description?: Slot<undefined>;

  /**
   * Illustration or icon above the title. Replaces the `icon` prop.
   */
  media?: Slot<undefined>;

  /**
   * Replaces the default title copy.
   */
  title?: Slot<undefined>;
}

export type EmptyStateProps = MergeHtmlProps<
  EmptyStateOwnProps,
  HTMLAttributes
>;
