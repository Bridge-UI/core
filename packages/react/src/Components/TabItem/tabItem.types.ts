// ** External Imports
import type { ReactNode } from "react";

// ** Local Imports
import type { TabSlots } from "@/Components/Tab/tab.types";
import type { IconSource } from "@/Icons";

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
   * Icon at the **inline end** on the tab trigger.
   *
   * @default undefined
   */
  endIcon?: IconSource;

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
   * Custom start / end adornments for the tab trigger (when not using icon props).
   *
   * @default undefined
   */
  slots?: Pick<TabSlots, "end" | "start">;

  /**
   * Icon at the **inline start** on the tab trigger.
   *
   * @default undefined
   */
  startIcon?: IconSource;

  /**
   * Stable value for the tab / panel pair.
   */
  value: string;
}

export type TabItemProps = TabItemOwnProps;
