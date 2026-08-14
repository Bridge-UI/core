// ** External Imports
import { clamp, floor, range } from "es-toolkit/compat";

/**
 * Options for building the visible page list in numbered pagination.
 */
export type GetPaginationItemsOptions = {
  /**
   * Pages always shown at the start and end of the range.
   *
   * @default 1
   */
  boundaryCount?: number;

  /**
   * Total number of pages (1-based count).
   */
  count: number;

  /**
   * Current page (1-based).
   */
  page: number;

  /**
   * Pages shown on each side of the current page.
   *
   * @default 1
   */
  siblingCount?: number;
};

/**
 * A visible pagination control entry after ellipsis collapse.
 */
export type PaginationEntry =
  | {
      type: "ellipsis";
    }
  | {
      page: number;
      type: "page";
    };

/**
 * Inclusive integer range. Avoids es-toolkit/compat `range` reversing when
 * `start > end`.
 */
function inclusiveRange(start: number, end: number): number[] {
  return start <= end ? range(start, end + 1) : [];
}

/**
 * Maps page numbers to pagination page entries.
 */
function toPageEntries(pages: number[]): PaginationEntry[] {
  return pages.map((page) => ({
    page,
    type: "page" as const,
  }));
}

/**
 * Builds the visible page / ellipsis sequence for numbered pagination.
 * Keeps `boundaryCount` pages at each end and `siblingCount` pages beside
 * the current page, inserting ellipsis placeholders where the range gaps.
 */
export function getPaginationItems(
  options: GetPaginationItemsOptions,
): PaginationEntry[] {
  const count = Math.max(0, floor(options.count));
  const siblingCount = Math.max(0, floor(options.siblingCount ?? 1));
  const boundaryCount = Math.max(0, floor(options.boundaryCount ?? 1));

  if (count === 0) {
    return [];
  }

  const page = clamp(floor(options.page), 1, count);

  const startPages = inclusiveRange(1, Math.min(boundaryCount, count));
  const endPages = inclusiveRange(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count,
  );

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );

  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0]! - 2 : count - 1,
  );

  const startGap: PaginationEntry[] =
    siblingsStart > boundaryCount + 2
      ? [{ type: "ellipsis" }]
      : boundaryCount + 1 < count - boundaryCount
        ? toPageEntries([boundaryCount + 1])
        : [];

  const endGap: PaginationEntry[] =
    siblingsEnd < count - boundaryCount - 1
      ? [{ type: "ellipsis" }]
      : count - boundaryCount > boundaryCount
        ? toPageEntries([count - boundaryCount])
        : [];

  return [
    ...toPageEntries(startPages),
    ...startGap,
    ...toPageEntries(inclusiveRange(siblingsStart, siblingsEnd)),
    ...endGap,
    ...toPageEntries(endPages),
  ];
}
