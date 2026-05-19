// ** External Imports
import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  ButtonColor,
  ButtonRounded,
  ButtonSize,
  ButtonVariant,
  MergeHtmlProps,
  MergeProps,
} from "@bridge-ui/core";

export interface ButtonSizeOverrides {}
export interface ButtonColorOverrides {}
export interface ButtonRoundedOverrides {}
export interface ButtonVariantOverrides {}

export interface ButtonClasses {
  /**
   * The classes to apply to the end icon.
   */
  endIcon?: string;

  /**
   * The classes to apply to the loading.
   */
  loading?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the start icon.
   */
  startIcon?: string;
}

export interface ButtonOwnProps {
  /**
   * The element to render as.
   *
   * @default "button"
   */
  as?: "a" | "span" | "button";

  /**
   * The children to apply to the button.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Extra classes merged with the root element (and `classes.root`).
   *
   * @default undefined
   */
  className?: string;

  /**
   * The classes to apply to the button.
   *
   * @default undefined
   */
  classes?: ButtonClasses;

  /**
   * The color to apply to the button.
   *
   * @default "primary"
   */
  color?: MergeProps<ButtonColor, ButtonColorOverrides>;

  /**
   * Whether the button is disabled.
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
   * Whether the button is full width.
   *
   * @default false
   */
  full?: boolean;

  /**
   * The href to apply to the button.
   *
   * @default undefined
   */
  href?: string;

  /**
   * Whether the button is loading.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * The roundedness of the button.
   *
   * @default "sm"
   */
  rounded?: MergeProps<ButtonRounded, ButtonRoundedOverrides>;

  /**
   * The size of the button.
   *
   * @default "md"
   */
  size?: MergeProps<ButtonSize, ButtonSizeOverrides>;

  /**
   * Label text when `children` is not provided.
   *
   * @default undefined
   */
  text?: string;

  /**
   * Icon at the **inline start** (physical left in `ltr`, physical right in `rtl`).
   *
   * @default undefined
   */
  startIcon?: LucideIcon;

  /**
   * The slots to apply to the button.
   *
   * @default undefined
   */
  slots?: ButtonSlots;

  /**
   * The variant of the button.
   *
   * @default "solid"
   */
  variant?: MergeProps<ButtonVariant, ButtonVariantOverrides>;
}

export interface ButtonSlots {
  /**
   * Slot at the inline end (follows `dir` on an ancestor, e.g. `<html dir="rtl">`).
   */
  end?: ReactNode;

  /**
   * Slot at the inline start (follows `dir` on an ancestor, e.g. `<html dir="rtl">`).
   */
  start?: ReactNode;
}

export type ButtonProps = MergeHtmlProps<
  ButtonOwnProps,
  HTMLAttributes<HTMLElement>
>;
