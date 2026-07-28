// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

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
  root?: HTMLAttributes;
}

/**
 * Container for `Tab` triggers (`role="tablist"`). Must be used inside `Tabs`.
 */
export interface TabListOwnProps {
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

export interface TabListSlots {
  /**
   * The tab triggers to render.
   */
  default?: Slot<undefined>;
}

export type TabListProps = MergeHtmlProps<TabListOwnProps, HTMLAttributes>;
