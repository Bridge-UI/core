// ** External Imports
import { isNil, last, take, takeRight } from "es-toolkit/compat";

/**
 * A breadcrumb list entry after optional middle collapse.
 */
export type CollapsedBreadcrumbEntry<T> =
  | {
      type: "ellipsis";
    }
  | {
      index: number;
      item: T;
      type: "item";
    };

/**
 * Maps `items` to visible crumb entries, preserving source indices.
 */
function toItemEntries<T>(
  items: T[],
  startIndex = 0,
): Extract<CollapsedBreadcrumbEntry<T>, { type: "item" }>[] {
  return items.map((item, offset) => ({
    item,
    type: "item" as const,
    index: startIndex + offset,
  }));
}

/**
 * Collapses middle breadcrumb items when `items.length` exceeds `maxItems`.
 * Keeps the first crumb and the last `maxItems - 2` crumbs, inserting an
 * ellipsis placeholder between them. When `maxItems` is omitted or not
 * exceeded, returns every item in order.
 */
export function collapseBreadcrumbItems<T>(
  items: T[],
  maxItems?: number,
): CollapsedBreadcrumbEntry<T>[] {
  if (isNil(maxItems) || maxItems < 1 || items.length <= maxItems) {
    return toItemEntries(items);
  }

  if (maxItems === 1) {
    const index = items.length - 1;

    return [
      {
        index,
        type: "item",
        item: last(items) as T,
      },
    ];
  }

  const tailCount = Math.max(1, maxItems - 2);

  return [
    ...toItemEntries(take(items, 1)),
    { type: "ellipsis" as const },
    ...toItemEntries(takeRight(items, tailCount), items.length - tailCount),
  ];
}
