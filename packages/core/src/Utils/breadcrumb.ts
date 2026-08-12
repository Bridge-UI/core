/**
 * A breadcrumb list entry after optional middle collapse.
 */
export type CollapsedBreadcrumbEntry<T> =
  | {
      /**
       * Placeholder for collapsed middle crumbs.
       */
      type: "ellipsis";
    }
  | {
      /**
       * Original item index in the full list.
       */
      index: number;

      /**
       * Original crumb data.
       */
      item: T;

      /**
       * Visible crumb.
       */
      type: "item";
    };

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
  if (maxItems == null || maxItems < 1 || items.length <= maxItems) {
    return items.map((item, index) => ({
      item,
      index,
      type: "item" as const,
    }));
  }

  if (maxItems === 1) {
    const index = items.length - 1;

    return [
      {
        index,
        type: "item",
        item: items[index] as T,
      },
    ];
  }

  const headCount = 1;
  const tailCount = Math.max(1, maxItems - 2);
  const head = items.slice(0, headCount);
  const tail = items.slice(items.length - tailCount);

  return [
    ...head.map((item, index) => ({
      item,
      index,
      type: "item" as const,
    })),
    { type: "ellipsis" as const },
    ...tail.map((item, offset) => ({
      item,
      type: "item" as const,
      index: items.length - tailCount + offset,
    })),
  ];
}
