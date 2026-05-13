// ** External Imports
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

// ** Core Imports
import type {
  ButtonColor,
  ButtonRounded,
  ButtonVariant,
  MergeProps,
  MiniButtonSize,
} from "@bridge-ui/core";

export interface MiniButtonSizeOverrides {}
export interface MiniButtonColorOverrides {}
export interface MiniButtonRoundedOverrides {}
export interface MiniButtonVariantOverrides {}

export interface MiniButtonClasses {
  /**
   * The classes to apply to the icon.
   */
  icon?: string;

  /**
   * The classes to apply to the loading.
   */
  loading?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface MiniButtonProps {
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
   * The classes to apply to the button.
   *
   * @default undefined
   */
  classes?: MiniButtonClasses;

  /**
   * The color to apply to the button.
   *
   * @default undefined
   */
  color?: MergeProps<ButtonColor, MiniButtonColorOverrides>;

  /**
   * Whether the button is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * The href to apply to the button.
   *
   * @default undefined
   */
  href?: string;

  /**
   * The icon to apply to the button.
   *
   * @default undefined
   */
  icon?: LucideIcon;

  /**
   * Whether the button is loading.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * The roundedness of the button.
   *
   * @default "none"
   */
  rounded?: MergeProps<ButtonRounded, MiniButtonRoundedOverrides>;

  /**
   * The size of the button.
   *
   * @default "md"
   */
  size?: MergeProps<MiniButtonSize, MiniButtonSizeOverrides>;

  /**
   * The variant of the button.
   *
   * @default "flat"
   */
  variant?: MergeProps<ButtonVariant, MiniButtonVariantOverrides>;
}
