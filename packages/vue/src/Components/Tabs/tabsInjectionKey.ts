// ** External Imports
import type { LucideIcon } from "@lucide/vue";
import type { ComputedRef, InjectionKey, VNodeChild } from "vue";

// ** Core Imports
import type { TabsActivation } from "@bridge-ui/core";

/**
 * Merged token classes for triggers / list / panel.
 */
export type TabsTokenClasses = {
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

/**
 * Declarative tab + panel registered by `TabItem`.
 */
export type TabsItemEntry = {
  /**
   * Whether the tab is disabled.
   */
  disabled?: boolean;

  /**
   * Optional trailing Lucide icon on the tab trigger.
   */
  endIcon?: LucideIcon;

  /**
   * When set, overrides `Tabs` `keepMounted` for this panel.
   */
  keepMounted?: boolean;

  /**
   * Trigger label content (string or render function).
   */
  label: string | (() => VNodeChild);

  /**
   * Panel content render function.
   */
  panel: () => VNodeChild;

  /**
   * Custom start / end adornment render functions for the tab trigger.
   */
  slots?: {
    end?: () => VNodeChild;
    start?: () => VNodeChild;
  };

  /**
   * Optional leading Lucide icon on the tab trigger.
   */
  startIcon?: LucideIcon;

  /**
   * Stable value matching the tab / panel pair.
   */
  value: string;
};

/**
 * Shared tabs state for `TabList` / `Tab` / `TabPanel` / `TabItem` descendants.
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
  tokenClasses: TabsTokenClasses;
};

export const TABS_INJECTION_KEY = Symbol("bridge-tabs") as InjectionKey<
  ComputedRef<TabsContextValue>
>;
