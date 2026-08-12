// ** External Imports
import type { HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { MergeHtmlProps } from "@bridge-ui/core";

// ** Local Imports
import type { IconSource } from "@/Adapters/Icon";
import type { IconProps } from "@/Components/Icon";

export interface BreadcrumbItemClasses {
  /**
   * Classes merged onto the current-page crumb.
   */
  current?: string;

  /**
   * Classes merged onto the end icon.
   */
  endIcon?: string;

  /**
   * Classes merged onto the interactive crumb.
   */
  link?: string;

  /**
   * Classes merged onto the list item shell.
   */
  root?: string;

  /**
   * Classes merged onto the separator.
   */
  separator?: string;

  /**
   * Classes merged onto the start icon.
   */
  startIcon?: string;
}

export interface BreadcrumbItemCustomProps {
  /**
   * Props forwarded to the current-page crumb element.
   *
   * @default undefined
   */
  current?: HTMLAttributes;

  /**
   * Props forwarded to the end `Icon`.
   *
   * @default undefined
   */
  endIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the interactive crumb element.
   *
   * @default undefined
   */
  link?: HTMLAttributes;

  /**
   * Props forwarded to the list item shell.
   *
   * @default undefined
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the separator `Icon` when using the default icon separator.
   *
   * @default undefined
   */
  separator?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the start `Icon`.
   *
   * @default undefined
   */
  startIcon?: Partial<Omit<IconProps, "icon">>;
}

export interface BreadcrumbItemSlots {
  /**
   * Crumb label content.
   */
  default?: Slot<undefined>;

  /**
   * Slot at the inline end (ignored when `endIcon` is set).
   */
  end?: Slot<undefined>;

  /**
   * Custom separator for this crumb (overrides the breadcrumb separator).
   */
  separator?: Slot<undefined>;

  /**
   * Slot at the inline start (ignored when `startIcon` is set).
   */
  start?: Slot<undefined>;
}

/**
 * One breadcrumb crumb. Must be used inside `Breadcrumb`.
 */
export interface BreadcrumbItemOwnProps {
  /**
   * Element to render for the interactive crumb.
   *
   * @default inferred from `href` / `current`
   */
  as?: "a" | "span" | "button";

  /**
   * Classes for breadcrumb item parts.
   *
   * @default undefined
   */
  classes?: BreadcrumbItemClasses;

  /**
   * Marks the current page (`aria-current="page"`). Renders as a non-link.
   *
   * @default false
   */
  current?: boolean;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: BreadcrumbItemCustomProps;

  /**
   * Non-interactive crumb.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Icon at the inline end.
   *
   * @default undefined
   */
  endIcon?: IconSource;

  /**
   * Link target when rendered as an anchor.
   *
   * @default undefined
   */
  href?: string;

  /**
   * Hide the label visually and keep it for assistive tech (`sr-only`).
   * Useful for icon-only crumbs (e.g. home).
   *
   * @default false
   */
  iconOnly?: boolean;

  /**
   * Icon at the inline start.
   *
   * @default undefined
   */
  startIcon?: IconSource;
}

export type BreadcrumbItemProps = MergeHtmlProps<
  BreadcrumbItemOwnProps,
  HTMLAttributes
>;
