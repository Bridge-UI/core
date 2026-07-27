// ** External Imports
import type { HTMLAttributes } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

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
  root?: HTMLAttributes;
}

/**
 * Vertical list container (MUI `List`-like). Use with `ListItem` and `ListSection`.
 */
export interface ListOwnProps {
  /**
   * The element to render as.
   *
   * @default "ul"
   */
  as?: "ol" | "ul" | "nav";

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
}

export type ListProps = MergeHtmlProps<ListOwnProps, HTMLAttributes>;
