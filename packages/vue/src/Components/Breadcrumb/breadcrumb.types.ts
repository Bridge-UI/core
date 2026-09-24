// ** External Imports
import type { HTMLAttributes, OlHTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { BreadcrumbSize } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type { BreadcrumbItemOwnProps } from "@/Components/BreadcrumbItem/breadcrumbItem.types";
import type { IconProps } from "@/Components/Icon";
import type { LinkAsTag, LinkHref, LinkPropsOf } from "@/Utils/linkAs";

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
  list?: OlHTMLAttributes;

  /**
   * Props forwarded to the nav root.
   *
   * @default undefined
   */
  root?: HTMLAttributes;

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
export type BreadcrumbItemData<T extends LinkAsTag = "a"> = Omit<
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
  label?: string;

  /**
   * Props forwarded to `linkAs`. Checked against the `Breadcrumb` `linkAs`.
   */
  linkProps?: LinkPropsOf<T, "a">;
};

export interface BreadcrumbSlots {
  /**
   * The children to render (`BreadcrumbItem`, etc.).
   */
  default?: Slot<undefined>;

  /**
   * Custom separator between crumbs (overrides `separator` icon).
   */
  separator?: Slot<undefined>;
}

/**
 * Breadcrumb nav root. Compose with `BreadcrumbItem` or pass `items`.
 */
export interface BreadcrumbOwnProps<T extends LinkAsTag = "a"> {
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
   * Render all crumbs from data (no default slot content).
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
   * Icon between crumbs. Use the `separator` slot for a fully custom separator.
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
}

export type BreadcrumbProps<T extends LinkAsTag = "a"> = MergeHtmlProps<
  BreadcrumbOwnProps<T>,
  HTMLAttributes
>;
