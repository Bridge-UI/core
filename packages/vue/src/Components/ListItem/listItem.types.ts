// ** External Imports
import type { HTMLAttributes, Slot, VNode } from "vue";

// ** Core Imports
import type {
  ListItemAlign,
  MergeHtmlProps,
  MergeProps,
} from "@bridge-ui/core";

export interface ListItemAlignOverrides {}

export interface ListItemClasses {
  /**
   * The classes to apply to the main content column.
   */
  content?: string;

  /**
   * The classes to apply to the trailing slot.
   */
  end?: string;

  /**
   * The classes to apply to the interactive wrapper.
   */
  interactive?: string;

  /**
   * The classes to apply to the primary text.
   */
  primary?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the secondary text.
   */
  secondary?: string;

  /**
   * The classes to apply to the leading slot.
   */
  start?: string;
}

export interface ListItemCustomProps {
  /**
   * Props forwarded to the main content column.
   */
  content?: HTMLAttributes;

  /**
   * Props forwarded to the trailing slot wrapper.
   */
  end?: HTMLAttributes;

  /**
   * Props forwarded to the interactive wrapper.
   */
  interactive?: HTMLAttributes;

  /**
   * Props forwarded to the primary text.
   */
  primary?: HTMLAttributes;

  /**
   * Props forwarded to the root element.
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the secondary text.
   */
  secondary?: HTMLAttributes;

  /**
   * Props forwarded to the leading slot wrapper.
   */
  start?: HTMLAttributes;
}

/**
 * List row (MUI `ListItem` / `ListItemButton`-like).
 */
export interface ListItemOwnProps {
  /**
   * Vertical alignment of start/content/end slots.
   *
   * @default "center"
   */
  align?: MergeProps<ListItemAlign, ListItemAlignOverrides>;

  /**
   * The element to render as.
   *
   * @default "li"
   */
  as?: "div" | "li";

  /**
   * The classes to apply to the item.
   *
   * @default undefined
   */
  classes?: ListItemClasses;

  /**
   * Props forwarded to each item part.
   *
   * @default undefined
   */
  customProps?: ListItemCustomProps;

  /**
   * Compact vertical padding. Inherits `dense` from parent `List` when omitted.
   *
   * @default undefined
   */
  dense?: boolean;

  /**
   * When true, the item is not interactive and appears muted.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * When true, renders a bottom divider on the item.
   *
   * @default false
   */
  divider?: boolean;

  /**
   * When true, applies hover/focus styles and `tabIndex={0}` on the inner wrapper.
   *
   * @default false
   */
  interactive?: boolean;

  /**
   * Primary label text.
   *
   * @default undefined
   */
  primary?: string;

  /**
   * ARIA role for the interactive wrapper.
   *
   * @default "button"
   */
  role?: "button" | "menuitem" | "option";

  /**
   * Secondary/description text below the primary line.
   *
   * @default undefined
   */
  secondary?: string;

  /**
   * When true, highlights the item as selected.
   *
   * @default false
   */
  selected?: boolean;
}

export interface ListItemSlots {
  /**
   * Default slot — used as primary content when `primary` is not set.
   */
  default?: Slot<undefined>;

  /**
   * Trailing content.
   */
  end?: Slot<undefined>;

  /**
   * Primary label markup.
   */
  primary?: Slot<undefined>;

  /**
   * Secondary/description markup.
   */
  secondary?: Slot<undefined>;

  /**
   * Leading content.
   */
  start?: Slot<undefined>;
}

export type ListItemProps = MergeHtmlProps<ListItemOwnProps, HTMLAttributes>;

export type ListItemPrimaryContent = string | VNode | VNode[] | undefined;
