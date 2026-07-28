// ** External Imports
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
   * Label content when not using the `label` prop.
   */
  label?: Slot<undefined>;
}

export type TabItemProps = TabItemOwnProps;
