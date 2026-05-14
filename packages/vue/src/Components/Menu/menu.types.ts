// ** External Imports
import type { Slot } from "vue";

// ** Core Imports
import type { MenuRounded, MenuShadow, MergeProps } from "@bridge-ui/core";

export interface MenuRoundedOverrides {}
export interface MenuShadowOverrides {}

export interface MenuClasses {
  /**
   * The classes to apply to the content.
   */
  content?: string;

  /**
   * The classes to apply to the group.
   */
  group?: string;

  /**
   * The classes to apply to the item.
   */
  item?: string;

  /**
   * The classes to apply to the label.
   */
  label?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the separator.
   */
  separator?: string;

  /**
   * The classes to apply to the trigger.
   */
  trigger?: string;
}

export interface MenuProps {
  /**
   * The classes to apply to the menu.
   *
   * @default undefined
   */
  classes?: MenuClasses;

  /**
   * The roundedness of the menu.
   *
   * @default "md"
   */
  rounded?: MergeProps<MenuRounded, MenuRoundedOverrides>;

  /**
   * The shadow to apply to the menu.
   *
   * @default "md"
   */
  shadow?: MergeProps<MenuShadow, MenuShadowOverrides>;
}

export interface MenuSlots {
  /**
   * The menu items content.
   */
  default?: Slot<undefined>;

  /**
   * The trigger element that opens the menu.
   */
  trigger?: Slot<undefined>;
}
