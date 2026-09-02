// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

// ** Core Imports
import type { PaginationRounded, PaginationSize } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";
import type {
  PaginationRoundedOverrides,
  PaginationSizeOverrides,
} from "@/Components/Pagination/pagination.types";

export interface DataTablePaginationCallbacks {
  /**
   * Called when the page changes.
   *
   * @default undefined
   */
  onChange?: (page: number) => void;
}

export interface DataTablePaginationClasses {
  /**
   * Classes merged onto the first-page control.
   */
  first?: string;

  /**
   * Classes merged onto the last-page control.
   */
  last?: string;

  /**
   * Classes merged onto the unordered list.
   */
  list?: string;

  /**
   * Classes merged onto the next control.
   */
  next?: string;

  /**
   * Classes merged onto the previous control.
   */
  prev?: string;

  /**
   * Classes merged onto the nav root.
   */
  root?: string;
}

export interface DataTablePaginationCustomProps {
  /**
   * Props forwarded to the first-page button.
   *
   * @default undefined
   */
  first?: ButtonHTMLAttributes<HTMLButtonElement>;

  /**
   * Props forwarded to the first-page `Icon`.
   *
   * @default undefined
   */
  firstIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the last-page button.
   *
   * @default undefined
   */
  last?: ButtonHTMLAttributes<HTMLButtonElement>;

  /**
   * Props forwarded to the last-page `Icon`.
   *
   * @default undefined
   */
  lastIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the unordered list.
   *
   * @default undefined
   */
  list?: HTMLAttributes<HTMLUListElement>;

  /**
   * Props forwarded to the next button.
   *
   * @default undefined
   */
  next?: ButtonHTMLAttributes<HTMLButtonElement>;

  /**
   * Props forwarded to the next `Icon`.
   *
   * @default undefined
   */
  nextIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the previous button.
   *
   * @default undefined
   */
  prev?: ButtonHTMLAttributes<HTMLButtonElement>;

  /**
   * Props forwarded to the previous `Icon`.
   *
   * @default undefined
   */
  prevIcon?: Partial<Omit<IconProps, "icon">>;

  /**
   * Props forwarded to the nav root.
   *
   * @default undefined
   */
  root?: HTMLAttributes<HTMLElement>;
}

/**
 * First / previous / next / last pager used by the DataTable chrome footer.
 */
export interface DataTablePaginationOwnProps {
  /**
   * Classes for pagination parts.
   *
   * @default undefined
   */
  classes?: DataTablePaginationClasses;

  /**
   * Total number of pages.
   *
   * @default undefined
   */
  count?: number;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: DataTablePaginationCustomProps;

  /**
   * Uncontrolled initial page.
   *
   * @default 1
   */
  defaultPage?: number;

  /**
   * Disable all controls.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Controlled page (1-based).
   *
   * @default undefined
   */
  page?: number;

  /**
   * Control corner radius.
   *
   * @default "md"
   */
  rounded?: MergeProps<PaginationRounded, PaginationRoundedOverrides>;

  /**
   * Control size.
   *
   * @default "sm"
   */
  size?: MergeProps<PaginationSize, PaginationSizeOverrides>;

  /**
   * Custom first / previous / next / last slots.
   *
   * @default undefined
   */
  slots?: DataTablePaginationSlots;
}

export interface DataTablePaginationSlots {
  /**
   * Custom first-page control content (default double-chevron icon).
   */
  first?: ReactNode;

  /**
   * Custom last-page control content (default double-chevron icon).
   */
  last?: ReactNode;

  /**
   * Custom next control content (default chevron icon).
   */
  next?: ReactNode;

  /**
   * Custom previous control content (default chevron icon).
   */
  prev?: ReactNode;
}

export type DataTablePaginationProps = MergeHtmlProps<
  DataTablePaginationOwnProps & DataTablePaginationCallbacks,
  HTMLAttributes<HTMLElement>
>;
