// ** External Imports
import type {
  AnchorHTMLAttributes,
  ElementType,
  HTMLAttributes,
  ReactNode,
} from "react";

// ** Core Imports
import type {
  LinkColor,
  LinkSize,
  LinkUnderline,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type { IconProps } from "@/Components/Icon";
import type { LinkHref, LinkPropsOf } from "@/Utils/linkAs";

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
   * Props forwarded to the root element (`a`, or `linkAs` when set).
   */
  root?: HTMLAttributes<HTMLAnchorElement>;
}

export interface LinkOwnProps<T extends ElementType = "a"> {
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
   * When `linkAs` is set, this also accepts that component's `href`.
   *
   * @default undefined
   */
  href?: LinkHref<T, "a">;

  /**
   * The icon to display before the link text.
   *
   * @default undefined
   */
  leftIcon?: IconSource;

  /**
   * Component rendered in place of the navigating `<a>`.
   * Receives `href`, `linkProps`, and the same attributes the anchor would.
   * Ignored while disabled.
   *
   * @default undefined
   */
  linkAs?: T;

  /**
   * Props forwarded to `linkAs` (`method`, `replace`, `prefetch`, and so on).
   * Checked against that component. Ignored while `linkAs` is not rendered.
   *
   * @default undefined
   */
  linkProps?: LinkPropsOf<T, "a">;

  /**
   * The icon to display after the link text.
   *
   * @default undefined
   */
  rightIcon?: IconSource;

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

export type LinkProps<T extends ElementType = "a"> = MergeHtmlProps<
  LinkOwnProps<T>,
  AnchorHTMLAttributes<HTMLAnchorElement>
>;
