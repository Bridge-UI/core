// ** External Imports
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  ReactNode,
} from "react";

// ** Core Imports
import type {
  MergeHtmlProps,
  MergeProps,
  PaginationColor,
  PaginationSize,
  PaginationVariant,
} from "@bridge-ui/core";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";

export interface PaginationSizeOverrides {}
export interface PaginationColorOverrides {}
export interface PaginationVariantOverrides {}

export interface PaginationCallbacks {
  /**
   * Called when the page changes in numbered mode.
   *
   * @default undefined
   */
  onChange?: (page: number) => void;

  /**
   * Called when next is activated in simple mode.
   *
   * @default undefined
   */
  onNext?: () => void;

  /**
   * Called when previous is activated in simple mode.
   *
   * @default undefined
   */
  onPrevious?: () => void;
}

export interface PaginationClasses {
  /**
   * Classes merged onto each ellipsis placeholder.
   */
  ellipsis?: string;

  /**
   * Classes merged onto each page button.
   */
  item?: string;

  /**
   * Classes merged onto the ordered list.
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

export interface PaginationCustomProps {
  /**
   * Props forwarded to each ellipsis placeholder.
   *
   * @default undefined
   */
  ellipsis?: LiHTMLAttributes<HTMLLIElement>;

  /**
   * Props forwarded to each page button.
   *
   * @default undefined
   */
  item?: ButtonHTMLAttributes<HTMLButtonElement>;

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
 * Pagination page controls for lists and tables.
 */
export interface PaginationOwnProps {
  /**
   * Pages always shown at the start and end (numbered mode).
   *
   * @default 1
   */
  boundaryCount?: number;

  /**
   * Classes for pagination parts.
   *
   * @default undefined
   */
  classes?: PaginationClasses;

  /**
   * Selected page accent color.
   *
   * @default "primary"
   */
  color?: MergeProps<PaginationColor, PaginationColorOverrides>;

  /**
   * Total number of pages (numbered mode).
   *
   * @default undefined
   */
  count?: number;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: PaginationCustomProps;

  /**
   * Uncontrolled initial page (numbered mode).
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
   * Whether next is available (`mode="simple"`).
   *
   * @default undefined
   */
  hasNext?: boolean;

  /**
   * Whether previous is available (`mode="simple"`).
   *
   * @default undefined
   */
  hasPrevious?: boolean;

  /**
   * Hide the next control.
   *
   * @default false
   */
  hideNextButton?: boolean;

  /**
   * Hide the previous control.
   *
   * @default false
   */
  hidePrevButton?: boolean;

  /**
   * Numbered pages vs prev/next only.
   *
   * @default "numbered"
   */
  mode?: "simple" | "numbered";

  /**
   * Controlled page (1-based, numbered mode).
   *
   * @default undefined
   */
  page?: number;

  /**
   * Pages shown on each side of the current page (numbered mode).
   *
   * @default 1
   */
  siblingCount?: number;

  /**
   * Control size.
   *
   * @default "md"
   */
  size?: MergeProps<PaginationSize, PaginationSizeOverrides>;

  /**
   * Custom prev / next / ellipsis slots.
   *
   * @default undefined
   */
  slots?: PaginationSlots;

  /**
   * Visual style of page / control buttons.
   *
   * @default "text"
   */
  variant?: MergeProps<PaginationVariant, PaginationVariantOverrides>;
}

export interface PaginationSlots {
  /**
   * Custom ellipsis content (default `…`).
   */
  ellipsis?: ReactNode;

  /**
   * Custom next control content (default chevron icon).
   */
  next?: ReactNode;

  /**
   * Custom previous control content (default chevron icon).
   */
  prev?: ReactNode;
}

export type PaginationProps = MergeHtmlProps<
  PaginationOwnProps & PaginationCallbacks,
  HTMLAttributes<HTMLElement>
>;
