// ** External Imports
import type { ReactNode } from "react";

// ** Core Imports
import type { MenuRounded, MenuShadow, MergeProps } from "@bridge-ui/core";

export interface MenuShadowOverrides {}
export interface MenuRoundedOverrides {}

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
   * The children to render.
   *
   * @default undefined
   */
  children?: ReactNode;

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

  /**
   * The slots to apply to the menu.
   *
   * @default undefined
   */
  slots?: MenuSlots;
}

export interface MenuSlots {
  /**
   * The slot for the trigger element.
   */
  trigger?: ReactNode;
}
