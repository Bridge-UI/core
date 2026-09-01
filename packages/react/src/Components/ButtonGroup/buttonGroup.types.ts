// ** External Imports
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  ButtonDensity,
  ButtonGroupColor,
  ButtonGroupOrientation,
  ButtonRounded,
  ButtonSize,
  ButtonVariant,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  ButtonDensityOverrides,
  ButtonRoundedOverrides,
  ButtonSizeOverrides,
  ButtonVariantOverrides,
} from "@/Components/Button/button.types";

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
 * Groups related action buttons in a joined strip.
 * Compose with `Button`. Size, color, density, rounded, and variant
 * cascade to nested buttons unless they override them.
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
   * Semantic color of the divider. Nested `Button` children inherit it when set.
   *
   * @default "primary"
   */
  color?: MergeProps<ButtonGroupColor, ButtonGroupColorOverrides>;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: ButtonGroupCustomProps;

  /**
   * Density applied to nested `Button` children unless they set `density`.
   *
   * @default undefined
   */
  density?: MergeProps<ButtonDensity, ButtonDensityOverrides>;

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

  /**
   * Roundness applied to nested `Button` children unless they set `rounded`.
   *
   * @default undefined
   */
  rounded?: MergeProps<ButtonRounded, ButtonRoundedOverrides>;

  /**
   * Draw a full-height divider between adjacent children. The fill follows `variant`.
   *
   * @default true
   */
  separator?: boolean;

  /**
   * Size applied to nested `Button` children unless they set `size`.
   *
   * @default undefined
   */
  size?: MergeProps<ButtonSize, ButtonSizeOverrides>;

  /**
   * Variant applied to nested `Button` children unless they set `variant`.
   *
   * @default undefined
   */
  variant?: MergeProps<ButtonVariant, ButtonVariantOverrides>;
}

export type ButtonGroupProps = MergeHtmlProps<
  ButtonGroupOwnProps,
  HTMLAttributes<HTMLDivElement>
>;
