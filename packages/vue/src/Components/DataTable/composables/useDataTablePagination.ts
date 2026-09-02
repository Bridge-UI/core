// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs, useSlots, type Ref, type SetupContext } from "vue";

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
  DataTablePaginationClasses,
  DataTablePaginationEmits,
  DataTablePaginationOwnProps,
  DataTablePaginationProps,
} from "@/Components/DataTable/dataTablePagination.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const dataTablePaginationBridgeKeys = [
  "size",
  "count",
  "classes",
  "rounded",
  "disabled",
  "modelValue",
  "customProps",
] as const satisfies readonly (keyof DataTablePaginationOwnProps)[];

type DataTablePaginationLibDefaults = LibDefaultsShape<
  DataTablePaginationOwnProps,
  "size" | "rounded" | "disabled"
>;

type DataTablePaginationMerged = MergeLibDefaults<
  DataTablePaginationOwnProps,
  DataTablePaginationLibDefaults
>;

export function useDataTablePagination(
  props: DataTablePaginationOwnProps,
  libDefaults: DataTablePaginationLibDefaults,
  model: Ref<number | undefined>,
  emit: SetupContext<DataTablePaginationEmits>["emit"],
) {
  const attrs = useAttrs();
  const slots = useSlots();
  const resolveMessage = useResolveMessage();

  const split = computed(() => {
    return splitComponentProps<
      DataTablePaginationProps,
      typeof dataTablePaginationBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: dataTablePaginationBridgeKeys,
    });
  });

  const { merged } = useBridgeUIComponent<DataTablePaginationMerged>({
    libDefaults,
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const page = computed(() => {
    return model.value ?? 1;
  });

  const mergedClasses =
    useBridgeUIMergedRegistryClasses<DataTablePaginationClasses>({
      props: () => split.value.componentProps,
      entry: computed(() => {
        return undefined;
      }),
    });

  const sizeItem = computed(() => {
    return get(sizeProps, merged.value.size);
  });

  const roundedItem = computed(() => {
    return get(roundedProps, merged.value.rounded);
  });

  const setPage = (next: number) => {
    if (merged.value.disabled) {
      return;
    }

    const count = merged.value.count ?? 0;
    const clamped = Math.min(Math.max(1, next), Math.max(count, 1));

    model.value = clamped;
    emit("change", clamped);
    emit("update:modelValue", clamped);
  };

  const goPrevious = () => {
    setPage(page.value - 1);
  };

  const goNext = () => {
    setPage(page.value + 1);
  };

  const goFirst = () => {
    setPage(1);
  };

  const goLast = () => {
    setPage(merged.value.count ?? 1);
  };

  const prevDisabled = computed(() => {
    return merged.value.disabled || page.value <= 1;
  });

  const nextDisabled = computed(() => {
    return merged.value.disabled || page.value >= (merged.value.count ?? 0);
  });

  const itemIconClass = computed(() => {
    return cn({
      [get(sizeItem.value, "itemIcon") ?? ""]: true,
      [DATATABLE_PAGINATION_ITEM_CLASS]: true,
      [get(roundedItem.value, "item") ?? ""]: true,
    });
  });

  const iconSize = computed(() => {
    return (get(sizeItem.value, "icon") ?? "xs") as keyof IconSize;
  });

  const rootBind = computed(() => {
    const inherited = split.value.inheritedAttrs;

    return mergePartBind(customProps.value?.root, inherited, {
      "aria-label":
        (inherited as { "aria-label"?: string })["aria-label"] ??
        resolveMessage("Pagination"),
      class: cn({
        [get(sizeItem.value, "root") ?? ""]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    });
  });

  const listBind = computed(() => {
    return mergePartBind(
      customProps.value?.list,
      {},
      {
        class: cn({
          [get(sizeItem.value, "list") ?? ""]: true,
          [DATATABLE_PAGINATION_LIST_CLASS]: true,
          [get(mergedClasses.value, "list") ?? ""]: true,
        }),
      },
    );
  });

  const prevBind = computed(() => {
    return mergePartBind(
      customProps.value?.prev,
      {},
      {
        onClick: goPrevious,
        type: "button" as const,
        disabled: prevDisabled.value,
        "aria-label": resolveMessage("Previous"),
        class: cn({
          [itemIconClass.value]: true,
          [get(mergedClasses.value, "prev") ?? ""]: true,
        }),
      },
    );
  });

  const nextBind = computed(() => {
    return mergePartBind(
      customProps.value?.next,
      {},
      {
        onClick: goNext,
        type: "button" as const,
        disabled: nextDisabled.value,
        "aria-label": resolveMessage("Next"),
        class: cn({
          [itemIconClass.value]: true,
          [get(mergedClasses.value, "next") ?? ""]: true,
        }),
      },
    );
  });

  const firstBind = computed(() => {
    return mergePartBind(
      customProps.value?.first,
      {},
      {
        onClick: goFirst,
        type: "button" as const,
        disabled: prevDisabled.value,
        "aria-label": resolveMessage("First page"),
        class: cn({
          [itemIconClass.value]: true,
          [get(mergedClasses.value, "first") ?? ""]: true,
        }),
      },
    );
  });

  const lastBind = computed(() => {
    return mergePartBind(
      customProps.value?.last,
      {},
      {
        onClick: goLast,
        type: "button" as const,
        disabled: nextDisabled.value,
        "aria-label": resolveMessage("Last page"),
        class: cn({
          [itemIconClass.value]: true,
          [get(mergedClasses.value, "last") ?? ""]: true,
        }),
      },
    );
  });

  const prevIconBind = computed(() => {
    return mergePartBind(
      customProps.value?.prevIcon,
      {},
      {
        "aria-hidden": true,
        size: iconSize.value,
        class: "shrink-0 pointer-events-none",
      },
    );
  });

  const nextIconBind = computed(() => {
    return mergePartBind(
      customProps.value?.nextIcon,
      {},
      {
        "aria-hidden": true,
        size: iconSize.value,
        class: "shrink-0 pointer-events-none",
      },
    );
  });

  const firstIconBind = computed(() => {
    return mergePartBind(
      customProps.value?.firstIcon,
      {},
      {
        "aria-hidden": true,
        size: iconSize.value,
        class: "shrink-0 pointer-events-none",
      },
    );
  });

  const lastIconBind = computed(() => {
    return mergePartBind(
      customProps.value?.lastIcon,
      {},
      {
        "aria-hidden": true,
        size: iconSize.value,
        class: "shrink-0 pointer-events-none",
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
