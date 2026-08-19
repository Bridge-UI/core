// ** External Imports
import type {
  HTMLAttributes,
  Slot,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "vue";

// ** Core Imports
import type {
  TableAlign,
  TableSize,
  TableVariant,
} from "@bridge-ui/core/Tokens";
import type { MergeHtmlProps, MergeProps } from "@bridge-ui/core/Utils";

export interface TableSizeOverrides {}
export interface TableAlignOverrides {}
export interface TableVariantOverrides {}

export interface TableBodyClasses {
  /**
   * Classes merged onto the `tbody`.
   */
  root?: string;
}

export interface TableBodyCustomProps {
  /**
   * Props forwarded to the `tbody`.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

/**
 * Table body (`tbody`). Must be used inside `Table`.
 */
export interface TableBodyOwnProps {
  /**
   * Classes for the body.
   *
   * @default undefined
   */
  classes?: TableBodyClasses;

  /**
   * Extra props for the `tbody`.
   *
   * @default undefined
   */
  customProps?: TableBodyCustomProps;
}

export interface TableBodySlots {
  /**
   * Body rows.
   */
  default?: Slot<undefined>;
}

export interface TableCaptionClasses {
  /**
   * Classes merged onto the caption.
   */
  root?: string;
}

export interface TableCaptionCustomProps {
  /**
   * Props forwarded to the caption.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

/**
 * Table caption. Must be used inside `Table`.
 */
export interface TableCaptionOwnProps {
  /**
   * Classes for the caption.
   *
   * @default undefined
   */
  classes?: TableCaptionClasses;

  /**
   * Extra props for the caption.
   *
   * @default undefined
   */
  customProps?: TableCaptionCustomProps;
}

export interface TableCaptionSlots {
  /**
   * Caption content.
   */
  default?: Slot<undefined>;
}

export interface TableCellClasses {
  /**
   * Classes merged onto the `td`.
   */
  root?: string;
}

export interface TableCellCustomProps {
  /**
   * Props forwarded to the `td`.
   *
   * @default undefined
   */
  root?: TdHTMLAttributes;
}

/**
 * Table body cell (`td`). Must be used inside `Table`.
 */
export interface TableCellOwnProps {
  /**
   * Text alignment.
   *
   * @default "start"
   */
  align?: MergeProps<TableAlign, TableAlignOverrides>;

  /**
   * Classes for the cell.
   *
   * @default undefined
   */
  classes?: TableCellClasses;

  /**
   * Extra props for the `td`.
   *
   * @default undefined
   */
  customProps?: TableCellCustomProps;

  /**
   * Tabular numbers and end alignment (unless `align` is set).
   *
   * @default false
   */
  numeric?: boolean;
}

export interface TableCellSlots {
  /**
   * Cell content.
   */
  default?: Slot<undefined>;
}

export interface TableClasses {
  /**
   * Classes merged onto the `tbody`.
   */
  body?: string;

  /**
   * Classes merged onto the caption.
   */
  caption?: string;

  /**
   * Classes merged onto body cells.
   */
  cell?: string;

  /**
   * Classes merged onto the `tfoot`.
   */
  footer?: string;

  /**
   * Classes merged onto header cells.
   */
  head?: string;

  /**
   * Classes merged onto the `thead`.
   */
  header?: string;

  /**
   * Classes merged onto the overflow wrapper.
   */
  root?: string;

  /**
   * Classes merged onto rows.
   */
  row?: string;

  /**
   * Classes merged onto the `<table>` element.
   */
  table?: string;
}

export interface TableCustomProps {
  /**
   * Props forwarded to the overflow wrapper.
   *
   * @default undefined
   */
  root?: HTMLAttributes;

  /**
   * Props forwarded to the `<table>` element.
   *
   * @default undefined
   */
  table?: HTMLAttributes;
}

export interface TableFooterClasses {
  /**
   * Classes merged onto the `tfoot`.
   */
  root?: string;
}

export interface TableFooterCustomProps {
  /**
   * Props forwarded to the `tfoot`.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

/**
 * Table footer (`tfoot`). Must be used inside `Table`.
 */
export interface TableFooterOwnProps {
  /**
   * Classes for the footer.
   *
   * @default undefined
   */
  classes?: TableFooterClasses;

  /**
   * Extra props for the `tfoot`.
   *
   * @default undefined
   */
  customProps?: TableFooterCustomProps;
}

export interface TableFooterSlots {
  /**
   * Footer rows.
   */
  default?: Slot<undefined>;
}

export interface TableHeadClasses {
  /**
   * Classes merged onto the `th`.
   */
  root?: string;
}

export interface TableHeadCustomProps {
  /**
   * Props forwarded to the `th`.
   *
   * @default undefined
   */
  root?: ThHTMLAttributes;
}

/**
 * Table header cell (`th`). Must be used inside `Table`.
 */
export interface TableHeadOwnProps {
  /**
   * Text alignment.
   *
   * @default "start"
   */
  align?: MergeProps<TableAlign, TableAlignOverrides>;

  /**
   * Classes for the header cell.
   *
   * @default undefined
   */
  classes?: TableHeadClasses;

  /**
   * Extra props for the `th`.
   *
   * @default undefined
   */
  customProps?: TableHeadCustomProps;

  /**
   * Tabular numbers and end alignment (unless `align` is set).
   *
   * @default false
   */
  numeric?: boolean;
}

export interface TableHeadSlots {
  /**
   * Header cell content.
   */
  default?: Slot<undefined>;
}

export interface TableHeaderClasses {
  /**
   * Classes merged onto the `thead`.
   */
  root?: string;
}

export interface TableHeaderCustomProps {
  /**
   * Props forwarded to the `thead`.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

/**
 * Table header (`thead`). Must be used inside `Table`.
 */
export interface TableHeaderOwnProps {
  /**
   * Classes for the header.
   *
   * @default undefined
   */
  classes?: TableHeaderClasses;

  /**
   * Extra props for the `thead`.
   *
   * @default undefined
   */
  customProps?: TableHeaderCustomProps;
}

export interface TableHeaderSlots {
  /**
   * Header rows.
   */
  default?: Slot<undefined>;
}

/**
 * Presentational table root. Compose with `TableHeader`, `TableBody`,
 * `TableRow`, `TableHead`, and `TableCell`.
 */
export interface TableOwnProps {
  /**
   * Classes for table parts.
   *
   * @default undefined
   */
  classes?: TableClasses;

  /**
   * Extra props for the wrapper and `<table>`.
   *
   * @default undefined
   */
  customProps?: TableCustomProps;

  /**
   * Full width of the container.
   *
   * @default true
   */
  full?: boolean;

  /**
   * Row hover styles on the body.
   *
   * @default false
   */
  hoverable?: boolean;

  /**
   * Cell padding / type scale.
   *
   * @default "md"
   */
  size?: MergeProps<TableSize, TableSizeOverrides>;

  /**
   * Sticky `thead` inside the scroll container.
   *
   * @default false
   */
  stickyHeader?: boolean;

  /**
   * Alternating body row surfaces.
   *
   * @default false
   */
  striped?: boolean;

  /**
   * Chrome treatment. Pair with Pagination `text` / `ghost` / `outlined`.
   *
   * @default "plain"
   */
  variant?: MergeProps<TableVariant, TableVariantOverrides>;
}

export interface TableRowClasses {
  /**
   * Classes merged onto the `tr`.
   */
  root?: string;
}

export interface TableRowCustomProps {
  /**
   * Props forwarded to the `tr`.
   *
   * @default undefined
   */
  root?: HTMLAttributes;
}

/**
 * Table row (`tr`). Must be used inside `Table`.
 */
export interface TableRowOwnProps {
  /**
   * Classes for the row.
   *
   * @default undefined
   */
  classes?: TableRowClasses;

  /**
   * Extra props for the `tr`.
   *
   * @default undefined
   */
  customProps?: TableRowCustomProps;
}

export interface TableRowSlots {
  /**
   * Row cells.
   */
  default?: Slot<undefined>;
}

export interface TableSlots {
  /**
   * Table sections and caption.
   */
  default?: Slot<undefined>;
}

export type TableBodyProps = MergeHtmlProps<TableBodyOwnProps, HTMLAttributes>;

export type TableCaptionProps = MergeHtmlProps<
  TableCaptionOwnProps,
  HTMLAttributes
>;

export type TableCellProps = MergeHtmlProps<
  TableCellOwnProps,
  TdHTMLAttributes
>;

export type TableFooterProps = MergeHtmlProps<
  TableFooterOwnProps,
  HTMLAttributes
>;

export type TableHeadProps = MergeHtmlProps<
  TableHeadOwnProps,
  ThHTMLAttributes
>;

export type TableHeaderProps = MergeHtmlProps<
  TableHeaderOwnProps,
  HTMLAttributes
>;

export type TableProps = MergeHtmlProps<TableOwnProps, HTMLAttributes>;

export type TableRowProps = MergeHtmlProps<TableRowOwnProps, HTMLAttributes>;
