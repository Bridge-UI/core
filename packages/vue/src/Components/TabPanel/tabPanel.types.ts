// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

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
  root?: HTMLAttributes;
}

/**
 * Tab panel (`role="tabpanel"`). Visibility follows the matching `Tab` `value`.
 */
export interface TabPanelOwnProps {
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

export interface TabPanelSlots {
  /**
   * The panel content.
   */
  default?: Slot<undefined>;
}

export type TabPanelProps = MergeHtmlProps<TabPanelOwnProps, HTMLAttributes>;
