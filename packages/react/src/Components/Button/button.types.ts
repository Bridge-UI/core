// ** External Imports
import type { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

// ** Local Imports
import type {
  ButtonColor,
  ButtonRounded,
  ButtonSize,
  ButtonVariant,
} from "@/Components/Button/props";
import type { MergeProps } from "@/Utils";

export interface ButtonSizeOverrides {}
export interface ButtonColorOverrides {}
export interface ButtonRoundedOverrides {}
export interface ButtonVariantOverrides {}

export interface ButtonClasses {
  /**
   * The classes to apply to the left icon.
   */
  leftIcon?: string;

  /**
   * The classes to apply to the loading.
   */
  loading?: string;

  /**
   * The classes to apply to the right icon.
   */
  rightIcon?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface ButtonProps {
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
   * The left icon to apply to the button.
   *
   * @default undefined
   */
  leftIcon?: LucideIcon;

  /**
   * Whether the button is loading.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * The right icon to apply to the button.
   *
   * @default undefined
   */
  rightIcon?: LucideIcon;

  /**
   * The roundedness of the button.
   *
   * @default "none"
   */
  rounded?: MergeProps<ButtonRounded, ButtonRoundedOverrides>;

  /**
   * The size of the button.
   *
   * @default "md"
   */
  size?: MergeProps<ButtonSize, ButtonSizeOverrides>;

  /**
   * The slots to apply to the button.
   *
   * @default undefined
   */
  slots?: ButtonSlots;

  /**
   * The variant of the button.
   *
   * @default "flat"
   */
  variant?: MergeProps<ButtonVariant, ButtonVariantOverrides>;
}

export interface ButtonSlots {
  /**
   * The slot to apply to the append.
   */
  append?: ReactNode;

  /**
   * The slot to apply to the prepend.
   */
  prepend?: ReactNode;
}
