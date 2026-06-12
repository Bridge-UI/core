// ** External Imports
import type { LucideIcon } from "lucide-react";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type {
  LinkColor,
  LinkSize,
  LinkUnderline,
  MergeHtmlProps,
  MergeProps,
} from "@bridge-ui/core";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";

export interface LinkSizeOverrides {}
export interface LinkColorOverrides {}
export interface LinkUnderlineOverrides {}

export interface LinkClasses {
  /**
   * The classes to apply to the left icon.
   */
  leftIcon?: string;

  /**
   * The classes to apply to the right icon.
   */
  rightIcon?: string;

  /**
   * The classes to apply to the root.
   */
  root?: string;
}

export interface LinkCustomProps {
  /**
   * Props forwarded to the left `Icon` (`icon` is set by the link).
   */
  leftIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the right `Icon` (`icon` is set by the link).
   */
  rightIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the root `<a>`.
   */
  root?: HTMLAttributes<HTMLAnchorElement>;
}

export interface LinkOwnProps {
  /**
   * The children to render.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * The classes to apply to the link.
   *
   * @default undefined
   */
  classes?: LinkClasses;

  /**
   * The color to apply to the link.
   *
   * @default "primary"
   */
  color?: MergeProps<LinkColor, LinkColorOverrides>;

  /**
   * Extra props for internal parts (`leftIcon`, `rightIcon`, etc.).
   * Root HTML attributes stay on the component top level.
   *
   * @default undefined
   */
  customProps?: LinkCustomProps;

  /**
   * Whether the link is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the link opens in a new tab.
   *
   * @default false
   */
  external?: boolean;

  /**
   * The URL the link points to.
   *
   * @default undefined
   */
  href?: string;

  /**
   * The icon to display before the link text.
   *
   * @default undefined
   */
  leftIcon?: LucideIcon;

  /**
   * The icon to display after the link text.
   *
   * @default undefined
   */
  rightIcon?: LucideIcon;

  /**
   * The size of the link.
   *
   * @default "md"
   */
  size?: MergeProps<LinkSize, LinkSizeOverrides>;

  /**
   * The slots to apply to the link.
   *
   * @default undefined
   */
  slots?: LinkSlots;

  /**
   * The underline behavior of the link.
   *
   * @default "hover"
   */
  underline?: MergeProps<LinkUnderline, LinkUnderlineOverrides>;
}

export interface LinkSlots {
  /**
   * Content after the label (inline end).
   */
  append?: ReactNode;

  /**
   * Content before the label (inline start).
   */
  prepend?: ReactNode;
}

export type LinkProps = MergeHtmlProps<
  LinkOwnProps,
  AnchorHTMLAttributes<HTMLAnchorElement>
>;
