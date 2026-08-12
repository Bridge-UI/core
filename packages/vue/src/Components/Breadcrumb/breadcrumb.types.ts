// ** External Imports
import type { HTMLAttributes, OlHTMLAttributes, Slot } from "vue";

// ** Core Imports
import type {
  BreadcrumbSize,
  MergeHtmlProps,
  MergeProps,
} from "@bridge-ui/core";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type { BreadcrumbItemOwnProps } from "@/Components/BreadcrumbItem/breadcrumbItem.types";
import type { IconProps } from "@/Components/Icon";

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
export type BreadcrumbItemData = Pick<
  BreadcrumbItemOwnProps,
  "as" | "href" | "current" | "endIcon" | "disabled" | "iconOnly" | "startIcon"
> & {
  /**
   * Accessible / visible crumb label.
   */
  label: string;
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
export interface BreadcrumbOwnProps {
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
  items?: BreadcrumbItemData[];

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

export type BreadcrumbProps = MergeHtmlProps<
  BreadcrumbOwnProps,
  HTMLAttributes
>;
