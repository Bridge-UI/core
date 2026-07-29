// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

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
  root?: HTMLAttributes;
}

export interface TabsEmits {
  /**
   * Emitted when the selected tab changes.
   */
  change: [value: string];

  /**
   * Emitted when `v-model` should update.
   */
  "update:modelValue": [value: string];
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
   * Props forwarded to each tabs part.
   *
   * @default undefined
   */
  customProps?: TabsCustomProps;

  /**
   * When true, inactive panels stay mounted (hidden).
   *
   * @default true
   */
  keepMounted?: boolean;

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
   * Visual style of the tab list / selected tab.
   *
   * @default "line"
   */
  variant?: MergeProps<TabsVariant, TabsVariantOverrides>;
}

export interface TabsSlots {
  /**
   * The children to render (`TabList`, `TabPanel`, etc.).
   */
  default?: Slot<undefined>;
}

export type TabsProps = MergeHtmlProps<TabsOwnProps, HTMLAttributes> & {
  /**
   * Bound with `v-model` on the component (`defineModel` internally).
   */
  modelValue?: string;
};
