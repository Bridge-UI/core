// ** External Imports
import type { ButtonHTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

export interface TabClasses {
  /**
   * Classes merged onto the tab button.
   */
  root?: string;
}

export interface TabCustomProps {
  /**
   * Props forwarded to the tab button.
   */
  root?: ButtonHTMLAttributes;
}

/**
 * Tab trigger (`role="tab"`). Must be used inside `Tabs` / `TabList`.
 */
export interface TabOwnProps {
  /**
   * Classes for tab parts.
   *
   * @default undefined
   */
  classes?: TabClasses;

  /**
   * Props forwarded to each tab part.
   *
   * @default undefined
   */
  customProps?: TabCustomProps;

  /**
   * Whether the tab is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Stable value matching a `TabPanel`.
   */
  value: string;
}

export interface TabSlots {
  /**
   * The label content.
   */
  default?: Slot<undefined>;
}

export type TabProps = MergeHtmlProps<TabOwnProps, ButtonHTMLAttributes>;
