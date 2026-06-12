// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { ListPadding, MergeHtmlProps, MergeProps } from "@bridge-ui/core";

export interface ListPaddingOverrides {}

export interface ListClasses {
  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface ListCustomProps {
  /**
   * Props forwarded to the root element.
   */
  root?: HTMLAttributes<HTMLUListElement>;
}

/**
 * Vertical list container (MUI `List`-like). Use with `ListItem` and `ListSection`.
 * Set `role="menu"` on the root when composing a menu; pass `role="menuitem"` on items.
 */
export interface ListOwnProps {
  /**
   * The element to render as.
   *
   * @default "ul"
   */
  as?: "nav" | "ol" | "ul";

  /**
   * The children to render.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * The classes to apply to the list.
   *
   * @default undefined
   */
  classes?: ListClasses;

  /**
   * Props forwarded to each list part.
   *
   * @default undefined
   */
  customProps?: ListCustomProps;

  /**
   * Compact vertical spacing on items (`ListItem` / `ListSection`), not the list root.
   *
   * @default false
   */
  dense?: boolean;

  /**
   * When true, indents the list for nested navigation/submenus.
   *
   * @default false
   */
  nested?: boolean;

  /**
   * Root padding preset. Use `"none"` inside menus/cards (MUI `disablePadding`).
   *
   * @default "normal"
   */
  padding?: MergeProps<ListPadding, ListPaddingOverrides>;
}

export type ListProps = MergeHtmlProps<
  ListOwnProps,
  HTMLAttributes<HTMLUListElement>
>;
