// ** External Imports
import type { LucideIcon } from "lucide-vue-next";
import type { AnchorHTMLAttributes, HTMLAttributes, Slot } from "vue";

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
   * The classes to apply to the root.
   */
  root?: string;

  /**
   * The classes to apply to the right icon.
   */
  rightIcon?: string;
}

export interface LinkPartsProps {
  /**
   * Props forwarded to the root `<a>`.
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the left `Icon` (`icon` is set by the link).
   */
  leftIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the right `Icon` (`icon` is set by the link).
   */
  rightIcon?: Partial<Omit<IconProps, "icon">>;
}

export interface LinkOwnProps {
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
   * Extra props for internal parts (`leftIcon`, `rightIcon`, etc.).
   * Root HTML attributes stay on the component top level.
   *
   * @default undefined
   */
  partsProps?: LinkPartsProps;

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
  append?: Slot;

  /**
   * The link label.
   */
  default?: Slot;

  /**
   * Content before the label (inline start).
   */
  prepend?: Slot;
}

export type LinkProps = MergeHtmlProps<LinkOwnProps, AnchorHTMLAttributes>;
