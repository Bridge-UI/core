// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

export interface TabListClasses {
  /**
   * Classes merged onto the tab list root.
   */
  root?: string;
}

export interface TabListCustomProps {
  /**
   * Props forwarded to the tab list root.
   */
  root?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Container for `Tab` triggers (`role="tablist"`).
 */
export interface TabListOwnProps {
  /**
   * The tab triggers to render.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for tab list parts.
   *
   * @default undefined
   */
  classes?: TabListClasses;

  /**
   * Props forwarded to each tab list part.
   *
   * @default undefined
   */
  customProps?: TabListCustomProps;
}

export type TabListProps = MergeHtmlProps<
  TabListOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
