// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core/Utils";

export interface TabPanelClasses {
  /**
   * Classes merged onto the panel root.
   */
  root?: string;
}

export interface TabPanelCustomProps {
  /**
   * Props forwarded to the panel root.
   */
  root?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Tab panel (`role="tabpanel"`). Visibility follows the matching `Tab` value.
 */
export interface TabPanelOwnProps {
  /**
   * The panel content.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for panel parts.
   *
   * @default undefined
   */
  classes?: TabPanelClasses;

  /**
   * Props forwarded to each panel part.
   *
   * @default undefined
   */
  customProps?: TabPanelCustomProps;

  /**
   * When set, overrides `Tabs` `keepMounted` for this panel.
   *
   * @default undefined
   */
  keepMounted?: boolean;

  /**
   * Stable value matching a `Tab`.
   */
  value: string;
}

export type TabPanelProps = MergeHtmlProps<
  TabPanelOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
