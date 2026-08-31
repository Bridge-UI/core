// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

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
 * Vertical list container. Use with `ListItem` and `ListSection`.
 * Set `role="menu"` on the root when composing a menu; pass `role="menuitem"` on items.
 */
export interface ListOwnProps {
  /**
   * The element to render as.
   *
   * @default "ul"
   */
  as?: "ol" | "ul" | "nav";

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
   * Hide section labels and clip item text so only leading icons remain.
   * Nested `List` is hidden.
   *
   * @default false
   */
  iconOnly?: boolean;

  /**
   * When true, indents the list and draws a start-edge guide line
   * for nested navigation.
   *
   * @default false
   */
  nested?: boolean;
}

export type ListProps = MergeHtmlProps<
  ListOwnProps,
  HTMLAttributes<HTMLUListElement>
>;
