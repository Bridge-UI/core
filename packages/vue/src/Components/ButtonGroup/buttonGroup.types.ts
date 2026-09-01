// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  ButtonGroupColor,
  ButtonGroupOrientation,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

export interface ButtonGroupColorOverrides {}
export interface ButtonGroupOrientationOverrides {}

export interface ButtonGroupClasses {
  /**
   * Classes merged onto the root.
   */
  root?: string;
}

export interface ButtonGroupCustomProps {
  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

/**
 * Groups related action controls with a divider between each child.
 * Compose with `Button` and `ButtonGroupText`.
 */
export interface ButtonGroupOwnProps {
  /**
   * Classes for button group parts.
   *
   * @default undefined
   */
  classes?: ButtonGroupClasses;

  /**
   * Fill color of the divider between children.
   *
   * @default "dark"
   */
  color?: MergeProps<ButtonGroupColor, ButtonGroupColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: ButtonGroupCustomProps;

  /**
   * Stretch the group to the container width.
   *
   * @default false
   */
  full?: boolean;

  /**
   * Layout orientation of the group.
   *
   * @default "horizontal"
   */
  orientation?: MergeProps<
    ButtonGroupOrientation,
    ButtonGroupOrientationOverrides
  >;
}

export interface ButtonGroupSlots {
  /**
   * Grouped controls (`Button`, `ButtonGroupText`, nested `ButtonGroup`).
   */
  default?: Slot<undefined>;
}

export interface ButtonGroupTextClasses {
  /**
   * Classes merged onto the text root.
   */
  root?: string;
}

export interface ButtonGroupTextCustomProps {
  /**
   * Props forwarded to the root element.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

/**
 * Static text (or label) that sits flush with grouped buttons.
 */
export interface ButtonGroupTextOwnProps {
  /**
   * The element to render as.
   *
   * @default "span"
   */
  as?: "span" | "label";

  /**
   * Classes for text parts.
   *
   * @default undefined
   */
  classes?: ButtonGroupTextClasses;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: ButtonGroupTextCustomProps;
}

export interface ButtonGroupTextSlots {
  /**
   * Text content.
   */
  default?: Slot<undefined>;
}

export type ButtonGroupProps = MergeHtmlProps<
  ButtonGroupOwnProps,
  HTMLAttributes
>;

export type ButtonGroupTextProps = MergeHtmlProps<
  ButtonGroupTextOwnProps,
  HTMLAttributes
>;
