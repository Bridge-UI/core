// ** External Imports
import type { LucideIcon } from "@lucide/vue";
import type { Slot } from "vue";

export interface TabItemClasses {
  /**
   * Unused on the registration-only root; reserved for overrides.
   */
  root?: string;
}

/**
 * Ergonomic shortcut: registers a `Tab` label + `TabPanel` content with `Tabs`.
 */
export interface TabItemOwnProps {
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
  endIcon?: LucideIcon;

  /**
   * When set, overrides `Tabs` `keepMounted` for this panel.
   *
   * @default undefined
   */
  keepMounted?: boolean;

  /**
   * Label shown on the tab trigger (or use the `label` slot).
   *
   * @default undefined
   */
  label?: string;

  /**
   * Icon at the **inline start** on the tab trigger.
   *
   * @default undefined
   */
  startIcon?: LucideIcon;

  /**
   * Stable value for the tab / panel pair.
   */
  value: string;
}

export interface TabItemSlots {
  /**
   * Panel content for this tab.
   */
  default?: Slot<undefined>;

  /**
   * Trailing custom content on the tab trigger (ignored when `endIcon` is set).
   */
  end?: Slot<undefined>;

  /**
   * Label content when not using the `label` prop.
   */
  label?: Slot<undefined>;

  /**
   * Leading custom content on the tab trigger (ignored when `startIcon` is set).
   */
  start?: Slot<undefined>;
}

export type TabItemProps = TabItemOwnProps;
