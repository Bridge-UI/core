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

// ** Local Imports
import type { TabOwnProps } from "@/Components/Tab/tab.types";
import type { TabListOwnProps } from "@/Components/TabList/tabList.types";
import type { TabPanelOwnProps } from "@/Components/TabPanel/tabPanel.types";

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
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLDivElement>;

  /**
   * Props forwarded to each mapped `Tab` when using the `items` API.
   * Value, icons, disabled, and label stay owned by `Tabs`.
   *
   * @default undefined
   */
  tab?: Partial<
    Omit<
      TabOwnProps,
      "slots" | "value" | "endIcon" | "children" | "disabled" | "startIcon"
    >
  >;

  /**
   * Props forwarded to the mapped `TabList` when using the `items` API.
   *
   * @default undefined
   */
  tabList?: Partial<Omit<TabListOwnProps, "children">>;

  /**
   * Props forwarded to each mapped `TabPanel` when using the `items` API.
   * Value, keepMounted, and panel content stay owned by `Tabs`.
   *
   * @default undefined
   */
  tabPanel?: Partial<
    Omit<TabPanelOwnProps, "value" | "children" | "keepMounted">
  >;
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
   * Accent color for the selected tab.
   *
   * @default "primary"
   */
  color?: MergeProps<TabsColor, TabsColorOverrides>;

  /**
   * Extra props for the root and mapped `TabList` / `Tab` / `TabPanel` parts
   * (items API).
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
