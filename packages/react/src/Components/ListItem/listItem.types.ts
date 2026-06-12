// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

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
  content?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the trailing slot wrapper.
   */
  end?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the interactive wrapper.
   */
  interactive?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the primary text.
   */
  primary?: HTMLAttributes<HTMLSpanElement>;

  /**
   * Props forwarded to the root element.
   */
  root?: HTMLAttributes<HTMLLIElement>;

  /**
   * Props forwarded to the secondary text.
   */
  secondary?: HTMLAttributes<HTMLSpanElement>;

  /**
   * Props forwarded to the leading slot wrapper.
   */
  start?: HTMLAttributes<HTMLDivElement>;
}

/**
 * List row (MUI `ListItem` / `ListItemButton`-like). Set `interactive` for
 * clickable rows; use `role="menuitem"` inside menus or `role="option"` in selects.
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
   * The children to render inside the content column when `primary` is not set.
   *
   * @default undefined
   */
  children?: ReactNode;

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
   * Primary label text. Use `children` or `slots.primary` for custom markup.
   *
   * @default undefined
   */
  primary?: ReactNode;

  /**
   * ARIA role for the interactive wrapper. Common values: `menuitem`, `option`, `button`.
   *
   * @default "button"
   */
  role?: "button" | "menuitem" | "option";

  /**
   * Secondary/description text below the primary line.
   *
   * @default undefined
   */
  secondary?: ReactNode;

  /**
   * When true, highlights the item as selected.
   *
   * @default false
   */
  selected?: boolean;

  /**
   * The slots to apply to the item.
   *
   * @default undefined
   */
  slots?: ListItemSlots;
}

export interface ListItemSlots {
  /**
   * Trailing content (icon, shortcut, chevron).
   */
  end?: ReactNode;

  /**
   * Primary label markup.
   */
  primary?: ReactNode;

  /**
   * Secondary/description markup.
   */
  secondary?: ReactNode;

  /**
   * Leading content (icon, avatar).
   */
  start?: ReactNode;
}

export type ListItemProps = MergeHtmlProps<
  ListItemOwnProps,
  HTMLAttributes<HTMLLIElement>
>;
