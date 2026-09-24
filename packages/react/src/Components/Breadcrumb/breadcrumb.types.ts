// ** External Imports
import type {
  ElementType,
  HTMLAttributes,
  OlHTMLAttributes,
  ReactNode,
} from "react";

// ** Core Imports
import type { BreadcrumbSize } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type { BreadcrumbItemOwnProps } from "@/Components/BreadcrumbItem/breadcrumbItem.types";
import type { IconProps } from "@/Components/Icon";
import type { LinkHref, LinkPropsOf } from "@/Utils/linkAs";

export interface BreadcrumbSizeOverrides {}

export interface BreadcrumbClasses {
  /**
   * Classes merged onto the ordered list.
   */
  list?: string;

  /**
   * Classes merged onto the nav root.
   */
  root?: string;

  /**
   * Classes merged onto each separator.
   */
  separator?: string;
}

export interface BreadcrumbCustomProps {
  /**
   * Props forwarded to the ordered list.
   *
   * @default undefined
   */
  list?: OlHTMLAttributes<HTMLOListElement>;

  /**
   * Props forwarded to the nav root.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLElement>;

  /**
   * Props forwarded to each separator `Icon` when using the default icon separator.
   *
   * @default undefined
   */
  separator?: Partial<Omit<IconProps, "icon">>;
}

/**
 * Data-driven crumb for the `items` API on `Breadcrumb`.
 */
export type BreadcrumbItemData<T extends ElementType = "a"> = Omit<
  Pick<
    BreadcrumbItemOwnProps,
    | "as"
    | "href"
    | "current"
    | "endIcon"
    | "disabled"
    | "linkProps"
    | "startIcon"
  >,
  "href" | "linkProps"
> & {
  /**
   * Link target. When `linkAs` is set, this also accepts that component's `href`.
   */
  href?: LinkHref<T, "a">;

  /**
   * Accessible / visible crumb label.
   */
  label?: ReactNode;

  /**
   * Props forwarded to `linkAs`. Checked against the `Breadcrumb` `linkAs`.
   */
  linkProps?: LinkPropsOf<T, "a">;
};

export interface BreadcrumbSlots {
  /**
   * Custom separator between crumbs (overrides `separator` icon).
   */
  separator?: ReactNode;
}

/**
 * Breadcrumb nav root. Compose with `BreadcrumbItem` or pass `items`.
 */
export interface BreadcrumbOwnProps<T extends ElementType = "a"> {
  /**
   * The children to render (`BreadcrumbItem`, etc.). Wins over `items` when both are set.
   *
   * @default undefined
   */
  children?: ReactNode;

  /**
   * Classes for breadcrumb parts.
   *
   * @default undefined
   */
  classes?: BreadcrumbClasses;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: BreadcrumbCustomProps;

  /**
   * Render all crumbs from data (no children).
   *
   * @default undefined
   */
  items?: BreadcrumbItemData<T>[];

  /**
   * Default component rendered in place of navigating crumb anchors.
   * Applies to crumbs from `items` and to child `BreadcrumbItem`s that omit their own `linkAs`.
   * The item's `linkAs` wins when both are set.
   * `items[].linkProps` is checked against this component.
   *
   * @default undefined
   */
  linkAs?: T;

  /**
   * Collapse middle crumbs when the list exceeds this count (`items` API).
   *
   * @default undefined
   */
  maxItems?: number;

  /**
   * Icon between crumbs. Use `slots.separator` for a fully custom separator.
   *
   * @default "chevronRight"
   */
  separator?: IconSource;

  /**
   * Density of text, gaps, and icons.
   *
   * @default "md"
   */
  size?: MergeProps<BreadcrumbSize, BreadcrumbSizeOverrides>;

  /**
   * Custom separator slot.
   *
   * @default undefined
   */
  slots?: BreadcrumbSlots;
}

export type BreadcrumbProps<T extends ElementType = "a"> = MergeHtmlProps<
  BreadcrumbOwnProps<T>,
  HTMLAttributes<HTMLElement>
>;
