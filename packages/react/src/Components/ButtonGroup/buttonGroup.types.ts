// ** External Imports
import type { HTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";

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
  root?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Groups related action controls with a divider between each child.
 * Compose with `Button` and `ButtonGroupText`.
 */
export interface ButtonGroupOwnProps {
  /**
   * The children to render (`Button`, `ButtonGroupText`, nested `ButtonGroup`).
   *
   * @default undefined
   */
  children?: ReactNode;

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
  root?: HTMLAttributes<HTMLElement>;
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
   * The children to render inside the text.
   *
   * @default undefined
   */
  children?: ReactNode;

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

export type ButtonGroupProps = MergeHtmlProps<
  ButtonGroupOwnProps,
  HTMLAttributes<HTMLDivElement>
>;

export type ButtonGroupTextProps =
  | MergeHtmlProps<
      ButtonGroupTextOwnProps & { as?: "span" },
      HTMLAttributes<HTMLSpanElement>
    >
  | MergeHtmlProps<
      ButtonGroupTextOwnProps & { as: "label" },
      LabelHTMLAttributes<HTMLLabelElement>
    >;
