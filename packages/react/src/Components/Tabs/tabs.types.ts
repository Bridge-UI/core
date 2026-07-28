// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  TabsActivation,
  TabsColor,
  TabsOrientation,
  TabsSize,
  TabsVariant,
} from "@bridge-ui/core";

export interface TabsSizeOverrides {}
export interface TabsColorOverrides {}
export interface TabsVariantOverrides {}
export interface TabsOrientationOverrides {}

export interface TabsClasses {
  /**
   * Classes merged onto the root.
   */
  root?: string;
}

export interface TabsCustomProps {
  /**
   * Props forwarded to the root element.
   */
  root?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Tabs context root. Compose with `TabList`, `Tab`, and `TabPanel`.
 */
export interface TabsOwnProps {
  /**
   * Keyboard activation: `automatic` selects on arrow focus; `manual` needs Enter/Space.
   *
   * @default "automatic"
   */
  activation?: TabsActivation;

  /**
   * The children to render (`TabList`, `TabPanel`, etc.).
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for tabs parts.
   *
   * @default undefined
   */
  classes?: TabsClasses;

  /**
   * Accent color for the selected tab (`primary` or `dark`).
   *
   * @default "primary"
   */
  color?: MergeProps<TabsColor, TabsColorOverrides>;

  /**
   * Props forwarded to each tabs part.
   *
   * @default undefined
   */
  customProps?: TabsCustomProps;

  /**
   * Initial selected value when uncontrolled.
   *
   * @default undefined
   */
  defaultValue?: string;

  /**
   * When true, inactive panels stay mounted (hidden).
   *
   * @default true
   */
  keepMounted?: boolean;

  /**
   * Called when the selected tab changes.
   *
   * @default undefined
   */
  onChange?: (value: string) => void;

  /**
   * Layout orientation of the tab list.
   *
   * @default "horizontal"
   */
  orientation?: MergeProps<TabsOrientation, TabsOrientationOverrides>;

  /**
   * Size of the tab list and triggers.
   *
   * @default "md"
   */
  size?: MergeProps<TabsSize, TabsSizeOverrides>;

  /**
   * Controlled selected tab value.
   *
   * @default undefined
   */
  value?: string;

  /**
   * Visual style of the tab list / selected tab.
   *
   * @default "line"
   */
  variant?: MergeProps<TabsVariant, TabsVariantOverrides>;
}

export type TabsProps = MergeHtmlProps<
  TabsOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
