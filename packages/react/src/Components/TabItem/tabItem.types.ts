// ** External Imports
import type { ReactNode } from "react";

export interface TabItemClasses {
  /**
   * Unused on the registration-only root; reserved for overrides.
   */
  root?: string;
}

/**
 * Ergonomic shortcut: registers a `Tab` label + `TabPanel` content with `Tabs`.
 * Renders nothing; `Tabs` builds the list and panels from registered items.
 */
export interface TabItemOwnProps {
  /**
   * Panel content for this tab.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes reserved for registry overrides.
   *
   * @default undefined
   */
  classes?: TabItemClasses;

  /**
   * Whether the tab is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * When set, overrides `Tabs` `keepMounted` for this panel.
   *
   * @default undefined
   */
  keepMounted?: boolean;

  /**
   * Label shown on the tab trigger.
   */
  label: ReactNode;

  /**
   * Stable value for the tab / panel pair.
   */
  value: string;
}

export type TabItemProps = TabItemOwnProps;
