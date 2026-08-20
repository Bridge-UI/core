// ** External Imports
import { createContext, useContext } from "react";

// ** Core Imports
import type { TableAlign } from "@bridge-ui/core/Tokens";

/**
 * Table section for row hover / stripe and sticky header cells.
 */
export type TableSection = "body" | "footer" | "header";

/**
 * Merged token classes for table parts.
 */
export type TableTokenClasses = {
  /**
   * Merged align class maps for cells and header cells.
   */
  align: TableAlign;

  /**
   * Footer corner radius classes.
   */
  roundedFooter?: string;

  /**
   * Header corner radius classes.
   */
  roundedHeader?: string;

  /**
   * Caption size classes.
   */
  sizeCaption?: string;

  /**
   * Body cell size classes.
   */
  sizeCell?: string;

  /**
   * Header cell size classes.
   */
  sizeHead?: string;

  /**
   * Body variant classes.
   */
  variantBody?: string;

  /**
   * Caption variant classes.
   */
  variantCaption?: string;

  /**
   * Body cell variant classes.
   */
  variantCell?: string;

  /**
   * Footer variant classes.
   */
  variantFooter?: string;

  /**
   * Header cell variant classes.
   */
  variantHead?: string;

  /**
   * Header variant classes.
   */
  variantHeader?: string;

  /**
   * Sticky header cell variant classes.
   */
  variantHeadSticky?: string;

  /**
   * Row variant classes.
   */
  variantRow?: string;

  /**
   * Hoverable body row variant classes.
   */
  variantRowHover?: string;

  /**
   * Striped body row variant classes.
   */
  variantRowStriped?: string;
};

/**
 * Shared table chrome for `Table*` descendants.
 */
export type TableContextValue = {
  /**
   * Whether the table is full width.
   */
  full: boolean;

  /**
   * Whether body rows show hover styles.
   */
  hoverable: boolean;

  /**
   * Registry / instance classes for parts.
   */
  mergedClasses: {
    body?: string;
    caption?: string;
    cell?: string;
    footer?: string;
    head?: string;
    header?: string;
    row?: string;
  };

  /**
   * Whether header cells stick to the nearest scrollport (usually the page).
   */
  stickyHeader: boolean;

  /**
   * Whether body rows alternate surfaces.
   */
  striped: boolean;

  /**
   * Merged token classes for parts.
   */
  tokenClasses: TableTokenClasses;
};

export const TableContext = createContext<null | TableContextValue>(null);

export const TableSectionContext = createContext<null | TableSection>(null);

/**
 * Reads the nearest `Table` context. Throws when used outside `Table`.
 */
export function useTableContext(): TableContextValue {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error("Table parts must be used within a Table provider");
  }

  return context;
}

/**
 * Reads the nearest table section (`header` / `body` / `footer`).
 */
export function useTableSectionContext(): null | TableSection {
  return useContext(TableSectionContext);
}
