// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useCallback, useMemo, useState } from "react";

// ** Core Imports
import {
  cn,
  getPaginationItems,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type IconSize,
  type LibDefaultsShape,
  type MergeLibDefaults,
  type PaginationEntry,
} from "@bridge-ui/core";
import {
  colorProps,
  sizeProps,
  variantProps,
} from "@bridge-ui/core/Tokens/Pagination";

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

  const sizeItem = derived(() => {
    return get(sizeClasses, merged.size);
  });

  const variantItem = derived(() => {
    return get(variantClasses, merged.variant);
  });

  const colorItem = derived(() => {
    return get(colorClasses, merged.color);
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
  }, [merged, page, setPage]);

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
  }, [merged, page, setPage]);

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

  const controlClassName = derived(() => {
    return cn({
      [get(sizeItem, "item") ?? ""]: true,
      [get(variantItem, "item") ?? ""]: true,
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
          [get(mergedClasses, "list") ?? ""]: true,
        }),
      },
    );
  });

  const getItemBind = useCallback(
    (pageNumber: number) => {
      const selected = pageNumber === page;

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
            [controlClassName]: true,
            [selectedClassName]: selected,
            [get(mergedClasses, "item") ?? ""]: true,
          }),
        },
      );
    },
    [
      page,
      setPage,
      merged.disabled,
      customProps?.item,
      controlClassName,
      selectedClassName,
      mergedClasses,
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
            [get(mergedClasses, "ellipsis") ?? ""]: true,
          }),
        },
      );
    },
    [customProps?.ellipsis, sizeItem, variantItem, mergedClasses],
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
          [controlClassName]: true,
          [get(mergedClasses, "prev") ?? ""]: true,
          [get(mergedClasses, "item") ?? ""]: true,
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
          [controlClassName]: true,
          [get(mergedClasses, "next") ?? ""]: true,
          [get(mergedClasses, "item") ?? ""]: true,
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
