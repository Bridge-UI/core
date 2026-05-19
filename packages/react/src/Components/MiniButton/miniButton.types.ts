// ** External Imports
import type { LucideIcon } from "lucide-react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

// ** Core Imports
import type {
  ButtonColor,
  ButtonRounded,
  ButtonVariant,
  MergeHtmlProps,
  MergeProps,
  MiniButtonSize,
} from "@bridge-ui/core";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";

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
   * The classes to apply to the loading spinner.
   */
  loading?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface MiniButtonPartsProps {
  /**
   * Props forwarded to the `Icon` (`icon` is set by the mini button).
   */
  icon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the loading spinner `Icon`.
   */
  loading?: Partial<Omit<IconProps, "icon">>;
}

export interface MiniButtonOwnProps {
  /**
   * The element to render as.
   *
   * @default "button"
   */
  as?: "a" | "span" | "button";

  /**
   * Content rendered in place of the icon. Hidden while `loading` is true.
   * Ignored when `icon` is set.
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
   * The classes to apply to the mini button.
   *
   * @default undefined
   */
  classes?: MiniButtonClasses;

  /**
   * The color to apply to the mini button.
   *
   * @default "primary"
   */
  color?: MergeProps<ButtonColor, MiniButtonColorOverrides>;

  /**
   * Whether the mini button is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * The href when `as` is `"a"`.
   *
   * @default undefined
   */
  href?: string;

  /**
   * The icon to display.
   *
   * @default undefined
   */
  icon?: LucideIcon;

  /**
   * Whether the mini button is loading.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Extra props for internal parts (`icon`, `loading`, etc.).
   * Root HTML attributes stay on the component top level.
   *
   * @default undefined
   */
  partsProps?: MiniButtonPartsProps;

  /**
   * The roundedness of the mini button.
   *
   * @default "none"
   */
  rounded?: MergeProps<ButtonRounded, MiniButtonRoundedOverrides>;

  /**
   * The size of the mini button.
   *
   * @default "md"
   */
  size?: MergeProps<MiniButtonSize, MiniButtonSizeOverrides>;

  /**
   * The variant of the mini button.
   *
   * @default "flat"
   */
  variant?: MergeProps<ButtonVariant, MiniButtonVariantOverrides>;
}

// prettier-ignore
export type MiniButtonProps =
  | MergeHtmlProps<MiniButtonOwnProps & { as: "span" }, HTMLAttributes<HTMLSpanElement>>
  | MergeHtmlProps<MiniButtonOwnProps & { as: "a" }, AnchorHTMLAttributes<HTMLAnchorElement>>
  | MergeHtmlProps<MiniButtonOwnProps & { as?: "button" }, ButtonHTMLAttributes<HTMLButtonElement>>;
