// ** External Imports
import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";

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
  end?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to the end `Icon`.
   */
  endIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the tab button.
   */
  root?: ButtonHTMLAttributes<HTMLButtonElement>;

  /**
   * Props forwarded to the inline-start slot wrapper.
   */
  start?: HTMLAttributes<HTMLDivElement>;

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
   * The label content.
   *
   * @default undefined
   */
  children?: ReactNode;

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
  endIcon?: LucideIcon;

  /**
   * Custom start / end adornments when not using Lucide icon props.
   *
   * @default undefined
   */
  slots?: TabSlots;

  /**
   * Icon at the **inline start** (physical left in `ltr`, physical right in `rtl`). Prefer over `slots.start`.
   *
   * @default undefined
   */
  startIcon?: LucideIcon;

  /**
   * Stable value matching a `TabPanel`.
   */
  value: string;
}

export interface TabSlots {
  /**
   * Slot at the inline end (ignored when `endIcon` is set).
   */
  end?: ReactNode;

  /**
   * Slot at the inline start (ignored when `startIcon` is set).
   */
  start?: ReactNode;
}

export type TabProps = MergeHtmlProps<
  TabOwnProps,
  ButtonHTMLAttributes<HTMLButtonElement>
>;
