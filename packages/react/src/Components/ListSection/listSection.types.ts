// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

export interface ListSectionClasses {
  /**
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the section label.
   */
  title?: string;
}

export interface ListSectionPartsProps {
  /**
   * Props forwarded to the root element.
   */
  root?: HTMLAttributes<HTMLLIElement>;

  /**
   * Props forwarded to the section label.
   */
  title?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Section heading inside a `List` (MUI `ListSubheader`-like).
 */
export interface ListSectionOwnProps {
  /**
   * The element to render as.
   *
   * @default "li"
   */
  as?: "div" | "li";

  /**
   * The children to render. Use `title` for plain text.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * The classes to apply to the section.
   *
   * @default undefined
   */
  classes?: ListSectionClasses;

  /**
   * When true, adds left padding to align with items that have leading icons.
   *
   * @default false
   */
  inset?: boolean;

  /**
   * Props forwarded to each section part.
   *
   * @default undefined
   */
  partsProps?: ListSectionPartsProps;

  /**
   * When true, sticks the heading while scrolling long lists.
   *
   * @default false
   */
  sticky?: boolean;

  /**
   * Section label text.
   *
   * @default undefined
   */
  title?: ReactNode;
}

export type ListSectionProps = MergeHtmlProps<
  ListSectionOwnProps,
  HTMLAttributes<HTMLLIElement>
>;
