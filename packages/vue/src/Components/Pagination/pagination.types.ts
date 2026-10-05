// ** External Imports
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  Slot,
} from "vue";

// ** Core Imports
import type { PaginationCursor } from "@bridge-ui/core/Domain";
import type {
  PaginationColor,
  PaginationRounded,
  PaginationSize,
  PaginationVariant,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type { IconProps } from "@/Components/Icon";

export interface PaginationSizeOverrides {}
export interface PaginationColorOverrides {}
export interface PaginationRoundedOverrides {}
export interface PaginationVariantOverrides {}

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

export interface PaginationCustomProps {
  /**
   * Props forwarded to each ellipsis placeholder.
   *
   * @default undefined
   */
  ellipsis?: LiHTMLAttributes;

  /**
   * Props forwarded to each page button.
   *
   * @default undefined
   */
  item?: ButtonHTMLAttributes;

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

export interface PaginationEmits {
  /**
   * Emitted when the page changes in numbered mode.
   */
  change: [page: number];

  /**
   * Emitted when next is activated in simple mode.
   */
  next: [];

  /**
   * Emitted when previous is activated in simple mode.
   */
  previous: [];

  /**
   * Emitted with `nextCursor` / `prevCursor` when next / previous is
   * activated in simple mode (`v-model:cursor`, only when that cursor prop is
   * passed). Fires before `next` / `previous`.
   */
  "update:cursor": [cursor: PaginationCursor];

  /**
   * Emitted when `v-model` should update.
   */
  "update:modelValue": [page: number];
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
   * Optional text accent for the selected page. Selected surface comes from `variant`.
   *
   * @default "dark"
   */
  color?: MergeProps<PaginationColor, PaginationColorOverrides>;

  /**
   * Total number of pages (numbered mode).
   *
   * @default undefined
   */
  count?: number;

  /**
   * Current cursor, bound with `v-model:cursor` (`mode="simple"`). Set to
   * `nextCursor` / `prevCursor` when the user navigates.
   *
   * @default undefined
   */
  cursor?: PaginationCursor;

  /**
   * Extra props for internal parts.
   *
   * @default undefined
   */
  customProps?: PaginationCustomProps;

  /**
   * Disable all controls.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether next is available (`mode="simple"`). Defaults to
   * `nextCursor !== null` when `nextCursor` is passed.
   *
   * @default undefined
   */
  hasNext?: boolean;

  /**
   * Whether previous is available (`mode="simple"`). Defaults to
   * `prevCursor !== null` when `prevCursor` is passed.
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
   * Numbered pages, or prev/next only.
   *
   * @default "numbered"
   */
  mode?: "simple" | "numbered";

  /**
   * Bound page with `v-model` (1-based, numbered mode).
   *
   * @default 1
   */
  modelValue?: number;

  /**
   * Cursor of the next page (`mode="simple"`). `null` disables next.
   *
   * @default undefined
   */
  nextCursor?: PaginationCursor;

  /**
   * Cursor of the previous page (`mode="simple"`). `null` disables previous.
   *
   * @default undefined
   */
  prevCursor?: PaginationCursor;

  /**
   * Control corner radius (`ghost` / `text` items and `outlined` group edges).
   *
   * @default "md"
   */
  rounded?: MergeProps<PaginationRounded, PaginationRoundedOverrides>;

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
   * Visual style of page / control buttons.
   *
   * @default "ghost"
   */
  variant?: MergeProps<PaginationVariant, PaginationVariantOverrides>;
}

export interface PaginationSlots {
  /**
   * Custom ellipsis content (default `…`).
   */
  ellipsis?: Slot;

  /**
   * Custom next control content (default chevron icon).
   */
  next?: Slot;

  /**
   * Custom previous control content (default chevron icon).
   */
  prev?: Slot;
}

export type PaginationProps = MergeHtmlProps<
  PaginationOwnProps,
  HTMLAttributes
>;
