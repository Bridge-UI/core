// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useCallback, useMemo, useState } from "react";

// ** Core Imports
import {
  getPaginationItems,
  type PaginationEntry,
} from "@bridge-ui/core/Domain";
import type { IconSize } from "@bridge-ui/core/Tokens/Icon";
import {
  colorProps,
  roundedProps,
  sizeProps,
  variantProps,
} from "@bridge-ui/core/Tokens/Pagination";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  PaginationOwnProps,
  PaginationProps,
} from "@/Components/Pagination/pagination.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const paginationBridgeKeys = [
  "mode",
  "page",
  "size",
  "color",
  "count",
  "slots",
  "onNext",
  "classes",
  "hasNext",
  "rounded",
  "variant",
  "disabled",
  "onChange",
  "onPrevious",
  "customProps",
  "defaultPage",
  "hasPrevious",
  "siblingCount",
  "boundaryCount",
  "hideNextButton",
  "hidePrevButton",
] as const satisfies readonly (
  "onNext" | "onChange" | "onPrevious" | keyof PaginationOwnProps
)[];

type PaginationLibDefaults = LibDefaultsShape<
  PaginationOwnProps,
  | "mode"
  | "size"
  | "color"
  | "rounded"
  | "variant"
  | "disabled"
  | "defaultPage"
  | "siblingCount"
  | "boundaryCount"
  | "hideNextButton"
  | "hidePrevButton"
>;

type PaginationMerged = MergeLibDefaults<
  PaginationOwnProps,
  PaginationLibDefaults
> &
  Pick<PaginationProps, "onNext" | "onChange" | "onPrevious">;

export function usePagination(
  props: PaginationProps,
  libDefaults: PaginationLibDefaults,
) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    PaginationProps,
    typeof paginationBridgeKeys
  >({
    props,
    bridgeKeys: paginationBridgeKeys,
  });

  const { merged, entry: bridgePagination } = useBridgeUIComponent<
    PaginationMerged,
    "Pagination"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Pagination",
  });

  const isControlled = derived(() => {
    return props.page !== undefined;
  });

  const [uncontrolledPage, setUncontrolledPage] = useState(
    () => props.defaultPage ?? libDefaults.defaultPage ?? 1,
  );

  const page = derived(() => {
    if (merged.mode === "simple") {
      return 1;
    }

    return isControlled ? (props.page ?? 1) : uncontrolledPage;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const slots = derived(() => {
    return props.slots;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "onChange", "onNext", "onPrevious"]);
  });

  const entries = derived((): PaginationEntry[] => {
    if (merged.mode === "simple") {
      return [];
    }

    return getPaginationItems({
      page,
      count: merged.count ?? 0,
      siblingCount: merged.siblingCount,
      boundaryCount: merged.boundaryCount,
    });
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props: componentProps,
    entry: bridgePagination,
  });

  const sizeClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgePagination?.tokens?.size,
    );
  }, [bridgePagination?.tokens?.size]);

  const variantClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgePagination?.tokens?.variant,
    );
  }, [bridgePagination?.tokens?.variant]);

  const colorClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      colorProps,
      bridgePagination?.tokens?.color,
    );
  }, [bridgePagination?.tokens?.color]);

  const roundedClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      roundedProps,
      bridgePagination?.tokens?.rounded,
    );
  }, [bridgePagination?.tokens?.rounded]);

  const sizeItem = derived(() => {
    return get(sizeClasses, merged.size);
  });

  const variantItem = derived(() => {
    return get(variantClasses, merged.variant);
  });

  const colorItem = derived(() => {
    return get(colorClasses, merged.color);
  });

  const roundedItem = derived(() => {
    return get(roundedClasses, merged.rounded);
  });

  const setPage = useCallback(
    (next: number) => {
      if (merged.disabled) {
        return;
      }

      const count = merged.count ?? 0;
      const clamped = Math.min(Math.max(1, next), Math.max(count, 1));

      if (!isControlled) {
        setUncontrolledPage(clamped);
      }

      merged.onChange?.(clamped);
    },
    [merged, isControlled],
  );

  const goPrevious = useCallback(() => {
    if (merged.disabled) {
      return;
    }

    if (merged.mode === "simple") {
      if (merged.hasPrevious === false) {
        return;
      }

      merged.onPrevious?.();
      return;
    }

    setPage(page - 1);
  }, [page, merged, setPage]);

  const goNext = useCallback(() => {
    if (merged.disabled) {
      return;
    }

    if (merged.mode === "simple") {
      if (merged.hasNext === false) {
        return;
      }

      merged.onNext?.();
      return;
    }

    setPage(page + 1);
  }, [page, merged, setPage]);

  const prevDisabled = derived(() => {
    if (merged.disabled) {
      return true;
    }

    if (merged.mode === "simple") {
      return merged.hasPrevious === false;
    }

    return page <= 1;
  });

  const nextDisabled = derived(() => {
    if (merged.disabled) {
      return true;
    }

    if (merged.mode === "simple") {
      return merged.hasNext === false;
    }

    return page >= (merged.count ?? 0);
  });

  const showPrev = derived(() => {
    return !merged.hidePrevButton;
  });

  const showNext = derived(() => {
    return !merged.hideNextButton;
  });

  const isOutlined = derived(() => {
    return merged.variant === "outlined";
  });

  const isGhost = derived(() => {
    return merged.variant === "ghost";
  });

  const itemClassName = derived(() => {
    return cn({
      [get(sizeItem, "item") ?? ""]: true,
      [get(variantItem, "item") ?? ""]: true,
      [get(roundedItem, "item") ?? ""]: isGhost,
    });
  });

  const itemIconClassName = derived(() => {
    return cn({
      [get(sizeItem, "itemIcon") ?? ""]: true,
      [get(variantItem, "item") ?? ""]: true,
      [get(roundedItem, "item") ?? ""]: isGhost,
    });
  });

  const selectedClassName = derived(() => {
    const variant = merged.variant;

    return cn({
      [get(variantItem, "itemSelected") ?? ""]: true,
      [get(colorItem, "itemSelectedFilled") ?? ""]: variant === "outlined",
      [get(colorItem, "itemSelectedAccent") ?? ""]:
        variant === "text" || variant === "ghost",
      [get(colorItem, "itemSelectedSoft") ?? ""]: variant === "ghost",
    });
  });

  const edgePages = derived(() => {
    const pages = entries.filter(
      (entry): entry is Extract<PaginationEntry, { type: "page" }> => {
        return entry.type === "page";
      },
    );

    return {
      first: pages[0]?.page,
      last: pages[pages.length - 1]?.page,
    };
  });

  const isFirstOutlinedControl = derived(() => {
    return (kind: "next" | "page" | "prev" | "ellipsis", key?: number) => {
      if (!isOutlined) {
        return false;
      }

      if (kind === "prev") {
        return true;
      }

      if (showPrev) {
        return false;
      }

      const first = entries[0];

      if (kind === "page") {
        return first?.type === "page" && first.page === key;
      }

      if (kind === "ellipsis") {
        return first?.type === "ellipsis" && key === 0;
      }

      return false;
    };
  });

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      "aria-label":
        (rootInheritedAttrs as { "aria-label"?: string })["aria-label"] ??
        "Pagination",
      className: cn({
        [get(sizeItem, "root") ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const listBind = derived(() => {
    return mergePartBind(
      customProps?.list,
      {},
      {
        className: cn({
          [get(sizeItem, "list") ?? ""]: true,
          [get(variantItem, "list") ?? ""]: true,
          [get(roundedItem, "list") ?? ""]: isOutlined,
          [get(mergedClasses, "list") ?? ""]: true,
        }),
      },
    );
  });

  const getItemBind = useCallback(
    (pageNumber: number) => {
      const selected = pageNumber === page;
      const isStart = isOutlined && !showPrev && pageNumber === edgePages.first;
      const isEnd = isOutlined && !showNext && pageNumber === edgePages.last;

      return mergePartBind(
        customProps?.item,
        {},
        {
          type: "button" as const,
          disabled: merged.disabled,
          "aria-label": `Page ${pageNumber}`,
          "aria-current": selected ? ("page" as const) : undefined,
          onClick: () => {
            if (!selected) {
              setPage(pageNumber);
            }
          },
          className: cn({
            [itemClassName]: true,
            [selectedClassName]: selected,
            [get(mergedClasses, "item") ?? ""]: true,
            "ml-0": isFirstOutlinedControl("page", pageNumber),
            [get(roundedItem, "itemStart") ?? ""]: isStart,
            [get(roundedItem, "itemEnd") ?? ""]: isEnd,
          }),
        },
      );
    },
    [
      page,
      setPage,
      showNext,
      showPrev,
      edgePages,
      isOutlined,
      roundedItem,
      itemClassName,
      mergedClasses,
      merged.disabled,
      customProps?.item,
      selectedClassName,
      isFirstOutlinedControl,
    ],
  );

  const getEllipsisBind = useCallback(
    (index: number) => {
      return mergePartBind(
        customProps?.ellipsis,
        {},
        {
          "aria-hidden": true,
          "data-ellipsis-index": index,
          className: cn({
            [get(sizeItem, "ellipsis") ?? ""]: true,
            [get(variantItem, "ellipsis") ?? ""]: true,
            [get(roundedItem, "item") ?? ""]: isGhost,
            [get(mergedClasses, "ellipsis") ?? ""]: true,
            "ml-0": isFirstOutlinedControl("ellipsis", index),
          }),
        },
      );
    },
    [
      isGhost,
      sizeItem,
      roundedItem,
      variantItem,
      mergedClasses,
      customProps?.ellipsis,
      isFirstOutlinedControl,
    ],
  );

  const iconSize = derived(() => {
    return (get(sizeItem, "icon") ?? "sm") as keyof IconSize;
  });

  const prevBind = derived(() => {
    return mergePartBind(
      customProps?.prev,
      {},
      {
        onClick: goPrevious,
        disabled: prevDisabled,
        type: "button" as const,
        "aria-label": "Previous",
        className: cn({
          [itemIconClassName]: true,
          [get(mergedClasses, "prev") ?? ""]: true,
          [get(mergedClasses, "item") ?? ""]: true,
          "ml-0": isOutlined,
          [get(roundedItem, "itemStart") ?? ""]: isOutlined,
        }),
      },
    );
  });

  const nextBind = derived(() => {
    return mergePartBind(
      customProps?.next,
      {},
      {
        onClick: goNext,
        "aria-label": "Next",
        disabled: nextDisabled,
        type: "button" as const,
        className: cn({
          [itemIconClassName]: true,
          [get(mergedClasses, "next") ?? ""]: true,
          [get(mergedClasses, "item") ?? ""]: true,
          [get(roundedItem, "itemEnd") ?? ""]: isOutlined,
        }),
      },
    );
  });

  const prevIconBind = derived(() => {
    return mergePartBind(
      customProps?.prevIcon,
      {},
      {
        size: iconSize,
        "aria-hidden": true,
        className: "shrink-0 pointer-events-none",
      },
    );
  });

  const nextIconBind = derived(() => {
    return mergePartBind(
      customProps?.nextIcon,
      {},
      {
        size: iconSize,
        "aria-hidden": true,
        className: "shrink-0 pointer-events-none",
      },
    );
  });

  return {
    page,
    slots,
    merged,
    entries,
    showPrev,
    showNext,
    rootBind,
    listBind,
    prevBind,
    nextBind,
    getItemBind,
    prevIconBind,
    nextIconBind,
    getEllipsisBind,
  };
}
