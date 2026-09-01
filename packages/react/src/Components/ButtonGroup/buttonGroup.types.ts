// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { ButtonGroupOrientation } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

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
 * Groups related action buttons with a divider between each child.
 * Compose with `Button`. Size, color, and variant stay on each button.
 */
export interface ButtonGroupOwnProps {
  /**
   * The children to render (`Button`, nested `ButtonGroup`).
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

export type ButtonGroupProps = MergeHtmlProps<
  ButtonGroupOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
