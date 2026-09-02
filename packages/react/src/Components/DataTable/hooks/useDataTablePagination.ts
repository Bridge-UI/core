// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useCallback, useState } from "react";

// ** Core Imports
import {
  DATATABLE_PAGINATION_ITEM_CLASS,
  DATATABLE_PAGINATION_LIST_CLASS,
} from "@bridge-ui/core/Domain";
import {
  paginationRoundedProps as roundedProps,
  paginationSizeProps as sizeProps,
  type IconSize,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  DataTablePaginationOwnProps,
  DataTablePaginationProps,
} from "@/Components/DataTable/dataTablePagination.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const dataTablePaginationBridgeKeys = [
  "page",
  "size",
  "count",
  "slots",
  "classes",
  "rounded",
  "disabled",
  "onChange",
  "customProps",
  "defaultPage",
] as const satisfies readonly (
  "onChange" | keyof DataTablePaginationOwnProps
)[];

type DataTablePaginationLibDefaults = LibDefaultsShape<
  DataTablePaginationOwnProps,
  "size" | "rounded" | "disabled" | "defaultPage"
>;

type DataTablePaginationMerged = MergeLibDefaults<
  DataTablePaginationOwnProps,
  DataTablePaginationLibDefaults
> &
  Pick<DataTablePaginationProps, "onChange">;

export function useDataTablePagination(
  props: DataTablePaginationProps,
  libDefaults: DataTablePaginationLibDefaults,
) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    DataTablePaginationProps,
    typeof dataTablePaginationBridgeKeys
  >({
    props,
    bridgeKeys: dataTablePaginationBridgeKeys,
  });

  const { merged } = useBridgeUIComponent<DataTablePaginationMerged>({
    libDefaults,
    props: componentProps,
  });

  const resolveMessage = useResolveMessage();

  const isControlled = derived(() => {
    return props.page !== undefined;
  });

  const [uncontrolledPage, setUncontrolledPage] = useState(
    () => props.defaultPage ?? libDefaults.defaultPage ?? 1,
  );

  const page = derived(() => {
    return isControlled ? (props.page ?? 1) : uncontrolledPage;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const slots = derived(() => {
    return props.slots;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "onChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props: componentProps,
  });

  const sizeItem = derived(() => {
    return get(sizeProps, merged.size);
  });

  const roundedItem = derived(() => {
    return get(roundedProps, merged.rounded);
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
    setPage(page - 1);
  }, [page, setPage]);

  const goNext = useCallback(() => {
    setPage(page + 1);
  }, [page, setPage]);

  const goFirst = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const goLast = useCallback(() => {
    setPage(merged.count ?? 1);
  }, [merged.count, setPage]);

  const prevDisabled = derived(() => {
    return merged.disabled || page <= 1;
  });

  const nextDisabled = derived(() => {
    return merged.disabled || page >= (merged.count ?? 0);
  });

  const itemIconClassName = derived(() => {
    return cn({
      [get(sizeItem, "itemIcon") ?? ""]: true,
      [DATATABLE_PAGINATION_ITEM_CLASS]: true,
      [get(roundedItem, "item") ?? ""]: true,
    });
  });

  const iconSize = derived(() => {
    return (get(sizeItem, "icon") ?? "xs") as keyof IconSize;
  });

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      className: cn({
        [get(sizeItem, "root") ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
      "aria-label":
        (rootInheritedAttrs as { "aria-label"?: string })["aria-label"] ??
        resolveMessage("Pagination"),
    });
  });

  const listBind = derived(() => {
    return mergePartBind(
      customProps?.list,
      {},
      {
        className: cn({
          [get(sizeItem, "list") ?? ""]: true,
          [DATATABLE_PAGINATION_LIST_CLASS]: true,
          [get(mergedClasses, "list") ?? ""]: true,
        }),
      },
    );
  });

  const prevBind = derived(() => {
    return mergePartBind(
      customProps?.prev,
      {},
      {
        onClick: goPrevious,
        disabled: prevDisabled,
        type: "button" as const,
        "aria-label": resolveMessage("Previous"),
        className: cn({
          [itemIconClassName]: true,
          [get(mergedClasses, "prev") ?? ""]: true,
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
        disabled: nextDisabled,
        type: "button" as const,
        "aria-label": resolveMessage("Next"),
        className: cn({
          [itemIconClassName]: true,
          [get(mergedClasses, "next") ?? ""]: true,
        }),
      },
    );
  });

  const firstBind = derived(() => {
    return mergePartBind(
      customProps?.first,
      {},
      {
        onClick: goFirst,
        disabled: prevDisabled,
        type: "button" as const,
        "aria-label": resolveMessage("First page"),
        className: cn({
          [itemIconClassName]: true,
          [get(mergedClasses, "first") ?? ""]: true,
        }),
      },
    );
  });

  const lastBind = derived(() => {
    return mergePartBind(
      customProps?.last,
      {},
      {
        onClick: goLast,
        disabled: nextDisabled,
        type: "button" as const,
        "aria-label": resolveMessage("Last page"),
        className: cn({
          [itemIconClassName]: true,
          [get(mergedClasses, "last") ?? ""]: true,
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

  const firstIconBind = derived(() => {
    return mergePartBind(
      customProps?.firstIcon,
      {},
      {
        size: iconSize,
        "aria-hidden": true,
        className: "shrink-0 pointer-events-none",
      },
    );
  });

  const lastIconBind = derived(() => {
    return mergePartBind(
      customProps?.lastIcon,
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
    rootBind,
    listBind,
    prevBind,
    nextBind,
    lastBind,
    firstBind,
    prevIconBind,
    nextIconBind,
    lastIconBind,
    firstIconBind,
  };
}
