// ** External Imports
import { createContext, useContext, type ReactNode } from "react";

// ** Core Imports
import type { TabsActivation } from "@bridge-ui/core";

// ** Local Imports
import type { IconSource } from "@/Icons";

/**
 * Declarative tab + panel registered by `TabItem`.
 */
export type TabsItemEntry = {
  /**
   * Whether the tab is disabled.
   */
  disabled?: boolean;

  /**
   * Optional trailing Icon on the tab trigger.
   */
  endIcon?: IconSource;

  /**
   * When set, overrides `Tabs` `keepMounted` for this panel.
   */
  keepMounted?: boolean;

  /**
   * Trigger label content.
   */
  label: ReactNode;

  /**
   * Panel content.
   */
  panel: ReactNode;

  /**
   * Custom start / end adornments for the tab trigger.
   */
  slots?: {
    end?: ReactNode;
    start?: ReactNode;
  };

  /**
   * Optional leading Icon on the tab trigger.
   */
  startIcon?: IconSource;

  /**
   * Stable value matching the tab / panel pair.
   */
  value: string;
};

/**
 * Shared tabs state for `TabList` / `Tab` / `TabPanel` / `TabItem` children.
 */
export type TabsContextValue = {
  /**
   * Keyboard activation mode.
   */
  activation: TabsActivation;

  /**
   * Disabled tab values.
   */
  disabledValues: string[];

  /**
   * Focus a tab by value (roving tabindex).
   */
  focusTab: (value: string) => void;

  /**
   * Stable id prefix for tab / panel pairing.
   */
  id: string;

  /**
   * Whether panels stay mounted when inactive.
   */
  keepMounted: boolean;

  /**
   * Orientation of the tab list.
   */
  orientation: "vertical" | "horizontal";

  /**
   * Registers a tab trigger and returns unregister.
   */
  registerTab: (value: string, disabled?: boolean) => () => void;

  /**
   * Registers a declarative `TabItem` (label + panel) and returns unregister.
   */
  registerTabItem: (entry: TabsItemEntry) => () => void;

  /**
   * Currently selected tab value.
   */
  selected: string;

  /**
   * Selects a tab by value.
   */
  setSelected: (value: string) => void;

  /**
   * Declarative items from `TabItem` children (mount order).
   */
  tabItems: TabsItemEntry[];

  /**
   * Ordered tab values (mount order).
   */
  tabValues: string[];

  /**
   * Merged token classes for triggers / list / panel.
   */
  tokenClasses: {
    colorSelected?: string;
    colorSelectedSoft?: string;
    iconGap?: string;
    iconSize?: string;
    listOrientation?: string;
    listSize?: string;
    listVariant?: string;
    panelOrientation?: string;
    panelSize?: string;
    rootOrientation?: string;
    softFill?: boolean;
    tabOrientation?: string;
    tabSize?: string;
    tabVariant?: string;
    tabVariantSelected?: string;
  };
};

export const TabsContext = createContext<null | TabsContextValue>(null);

/**
 * Reads the nearest `Tabs` context. Throws when used outside `Tabs`.
 */
export function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("Tab components must be used within a Tabs provider");
  }

  return context;
}
