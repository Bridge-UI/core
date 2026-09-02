// ** External Imports
import type { ButtonHTMLAttributes, HTMLAttributes, Slot } from "vue";

// ** Core Imports
import type { PaginationRounded, PaginationSize } from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";
import type {
  PaginationRoundedOverrides,
  PaginationSizeOverrides,
} from "@/Components/Pagination/pagination.types";

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
  first?: ButtonHTMLAttributes;

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
  last?: ButtonHTMLAttributes;

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
  list?: HTMLAttributes;

  /**
   * Props forwarded to the next button.
   *
   * @default undefined
   */
  next?: ButtonHTMLAttributes;

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
  prev?: ButtonHTMLAttributes;

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
  root?: HTMLAttributes;
}

export interface DataTablePaginationEmits {
  /**
   * Emitted when the page changes.
   */
  change: [page: number];

  /**
   * Emitted when `v-model` should update.
   */
  "update:modelValue": [page: number];
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
   * Disable all controls.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Bound page with `v-model` (1-based).
   *
   * @default 1
   */
  modelValue?: number;

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
}

export interface DataTablePaginationSlots {
  /**
   * Custom first-page control content (default double-chevron icon).
   */
  first?: Slot;

  /**
   * Custom last-page control content (default double-chevron icon).
   */
  last?: Slot;

  /**
   * Custom next control content (default chevron icon).
   */
  next?: Slot;

  /**
   * Custom previous control content (default chevron icon).
   */
  prev?: Slot;
}

export type DataTablePaginationProps = MergeHtmlProps<
  DataTablePaginationOwnProps,
  HTMLAttributes
>;
