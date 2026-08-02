// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";
import type { IconSource } from "@/Icons";

export interface TabClasses {
  /**
   * Classes merged onto the end icon.
   */
  endIcon?: string;

  /**
   * Classes merged onto the tab button.
   */
  root?: string;

  /**
   * Classes merged onto the start icon.
   */
  startIcon?: string;
}

export interface TabCustomProps {
  /**
   * Props forwarded to the inline-end slot wrapper.
   */
  end?: HTMLAttributes;

  /**
   * Props forwarded to the end `Icon`.
   */
  endIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the tab button.
   */
  root?: ButtonHTMLAttributes;

  /**
   * Props forwarded to the inline-start slot wrapper.
   */
  start?: HTMLAttributes;

  /**
   * Props forwarded to the start `Icon`.
   */
  startIcon?: Partial<Omit<IconProps, "icon">>;
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
   * Icon at the **inline end** (physical right in `ltr`, physical left in `rtl`).
   *
   * @default undefined
   */
  endIcon?: IconSource;

  /**
   * Icon at the **inline start** (physical left in `ltr`, physical right in `rtl`). Prefer over the `#start` slot.
   *
   * @default undefined
   */
  startIcon?: IconSource;

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

  /**
   * Slot at the inline end (ignored when `endIcon` is set).
   */
  end?: Slot<undefined>;

  /**
   * Slot at the inline start (ignored when `startIcon` is set).
   */
  start?: Slot<undefined>;
}

export type TabProps = MergeHtmlProps<TabOwnProps, ButtonHTMLAttributes>;
