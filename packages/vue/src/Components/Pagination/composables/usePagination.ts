// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs, useSlots, type Ref, type SetupContext } from "vue";

// ** Core Imports
import {
  getPaginationItems,
  type PaginationEntry,
} from "@bridge-ui/core/Domain";
import {
  paginationColorProps as colorProps,
  paginationRoundedProps as roundedProps,
  paginationSizeProps as sizeProps,
  paginationVariantProps as variantProps,
  type IconSize,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  PaginationEmits,
  PaginationOwnProps,
  PaginationProps,
} from "@/Components/Pagination/pagination.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const paginationBridgeKeys = [
  "mode",
  "size",
  "color",
  "count",
  "classes",
  "hasNext",
  "rounded",
  "variant",
  "disabled",
  "modelValue",
  "customProps",
  "hasPrevious",
  "siblingCount",
  "boundaryCount",
  "hideNextButton",
  "hidePrevButton",
] as const satisfies readonly (keyof PaginationOwnProps)[];

type PaginationLibDefaults = LibDefaultsShape<
  PaginationOwnProps,
  | "mode"
  | "size"
  | "color"
  | "rounded"
  | "variant"
  | "disabled"
  | "siblingCount"
  | "boundaryCount"
  | "hideNextButton"
  | "hidePrevButton"
>;

type PaginationMerged = MergeLibDefaults<
  PaginationOwnProps,
  PaginationLibDefaults
>;

export function usePagination(
  props: PaginationOwnProps,
  libDefaults: PaginationLibDefaults,
  model: Ref<number | undefined>,
  emit: SetupContext<PaginationEmits>["emit"],
) {
  const resolveMessage = useResolveMessage();
  const attrs = useAttrs();
  const slots = useSlots();

  const split = computed(() => {
    return splitComponentProps<PaginationProps, typeof paginationBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: paginationBridgeKeys,
    });
  });

  const { merged, entry: bridgePagination } = useBridgeUIComponent<
    PaginationMerged,
    "Pagination"
  >({
    libDefaults,
    componentName: "Pagination",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const page = computed(() => {
    if (merged.value.mode === "simple") {
      return 1;
    }

    return model.value ?? 1;
  });

  const entries = computed((): PaginationEntry[] => {
    if (merged.value.mode === "simple") {
      return [];
    }

    return getPaginationItems({
      page: page.value,
      count: merged.value.count ?? 0,
      siblingCount: merged.value.siblingCount,
      boundaryCount: merged.value.boundaryCount,
    });
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgePagination,
    props: () => split.value.componentProps,
  });

  const sizeClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgePagination.value?.tokens?.size,
    );
  });

  const variantClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgePagination.value?.tokens?.variant,
    );
  });

  const colorClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      colorProps,
      bridgePagination.value?.tokens?.color,
    );
  });

  const roundedClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      roundedProps,
      bridgePagination.value?.tokens?.rounded,
    );
  });

  const sizeItem = computed(() => {
    return get(sizeClasses.value, merged.value.size);
  });

  const variantItem = computed(() => {
    return get(variantClasses.value, merged.value.variant);
  });

  const colorItem = computed(() => {
    return get(colorClasses.value, merged.value.color);
  });

  const roundedItem = computed(() => {
    return get(roundedClasses.value, merged.value.rounded);
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
    if (merged.value.disabled) {
      return;
    }

    if (merged.value.mode === "simple") {
      if (merged.value.hasPrevious === false) {
        return;
      }

      emit("previous");
      return;
    }

    setPage(page.value - 1);
  };

  const goNext = () => {
    if (merged.value.disabled) {
      return;
    }

    if (merged.value.mode === "simple") {
      if (merged.value.hasNext === false) {
        return;
      }

      emit("next");
      return;
    }

    setPage(page.value + 1);
  };

  const prevDisabled = computed(() => {
    if (merged.value.disabled) {
      return true;
    }

    if (merged.value.mode === "simple") {
      return merged.value.hasPrevious === false;
    }

    return page.value <= 1;
  });

  const nextDisabled = computed(() => {
    if (merged.value.disabled) {
      return true;
    }

    if (merged.value.mode === "simple") {
      return merged.value.hasNext === false;
    }

    return page.value >= (merged.value.count ?? 0);
  });

  const showPrev = computed(() => {
    return !merged.value.hidePrevButton;
  });

  const showNext = computed(() => {
    return !merged.value.hideNextButton;
  });

  const isOutlined = computed(() => {
    return merged.value.variant === "outlined";
  });

  const isSpaced = computed(() => {
    return merged.value.variant === "ghost" || merged.value.variant === "text";
  });

  const itemClass = computed(() => {
    return cn({
      [get(sizeItem.value, "item") ?? ""]: true,
      [get(variantItem.value, "item") ?? ""]: true,
      [get(roundedItem.value, "item") ?? ""]: isSpaced.value,
    });
  });

  const itemIconClass = computed(() => {
    return cn({
      [get(sizeItem.value, "itemIcon") ?? ""]: true,
      [get(variantItem.value, "item") ?? ""]: true,
      [get(roundedItem.value, "item") ?? ""]: isSpaced.value,
    });
  });

  const selectedClass = computed(() => {
    return cn({
      [get(variantItem.value, "itemSelected") ?? ""]: true,
      [get(colorItem.value, "itemSelectedAccent") ?? ""]: true,
    });
  });

  const edgePages = computed(() => {
    const pages = entries.value.filter(
      (entry): entry is Extract<PaginationEntry, { type: "page" }> => {
        return entry.type === "page";
      },
    );

    return {
      first: pages[0]?.page,
      last: pages[pages.length - 1]?.page,
    };
  });

  const isFirstOutlinedControl = (
    kind: "next" | "page" | "prev" | "ellipsis",
    key?: number,
  ) => {
    if (!isOutlined.value) {
      return false;
    }

    if (kind === "prev") {
      return true;
    }

    if (showPrev.value) {
      return false;
    }

    const first = entries.value[0];

    if (kind === "page") {
      return first?.type === "page" && first.page === key;
    }

    if (kind === "ellipsis") {
      return first?.type === "ellipsis" && key === 0;
    }

    return false;
  };

  const prevLabel = computed(() => {
    return resolveMessage("Previous");
  });

  const nextLabel = computed(() => {
    return resolveMessage("Next");
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
          [get(variantItem.value, "list") ?? ""]: true,
          [get(roundedItem.value, "list") ?? ""]: isOutlined.value,
          [get(mergedClasses.value, "list") ?? ""]: true,
        }),
      },
    );
  });

  const getItemBind = (pageNumber: number) => {
    const selected = pageNumber === page.value;
    const isStart =
      isOutlined.value &&
      !showPrev.value &&
      pageNumber === edgePages.value.first;
    const isEnd =
      isOutlined.value &&
      !showNext.value &&
      pageNumber === edgePages.value.last;

    return mergePartBind(
      customProps.value?.item,
      {},
      {
        type: "button" as const,
        disabled: merged.value.disabled,
        "aria-label": `Page ${pageNumber}`,
        "aria-current": selected ? ("page" as const) : undefined,
        onClick: () => {
          if (!selected) {
            setPage(pageNumber);
          }
        },
        class: cn({
          [itemClass.value]: true,
          [selectedClass.value]: selected,
          [get(mergedClasses.value, "item") ?? ""]: true,
          "ml-0": isFirstOutlinedControl("page", pageNumber),
          [get(roundedItem.value, "itemStart") ?? ""]: isStart,
          [get(roundedItem.value, "itemEnd") ?? ""]: isEnd,
        }),
      },
    );
  };

  const getEllipsisBind = (index: number) => {
    return mergePartBind(
      customProps.value?.ellipsis,
      {},
      {
        "aria-hidden": true,
        "data-ellipsis-index": index,
        class: cn({
          [get(sizeItem.value, "ellipsis") ?? ""]: true,
          [get(variantItem.value, "ellipsis") ?? ""]: true,
          [get(roundedItem.value, "item") ?? ""]: isSpaced.value,
          [get(mergedClasses.value, "ellipsis") ?? ""]: true,
          "ml-0": isFirstOutlinedControl("ellipsis", index),
        }),
      },
    );
  };

  const iconSize = computed(() => {
    return (get(sizeItem.value, "icon") ?? "sm") as keyof IconSize;
  });

  const prevBind = computed(() => {
    return mergePartBind(
      customProps.value?.prev,
      {},
      {
        onClick: goPrevious,
        type: "button" as const,
        disabled: prevDisabled.value,
        "aria-label": prevLabel.value,
        class: cn({
          [itemIconClass.value]: true,
          [get(mergedClasses.value, "prev") ?? ""]: true,
          [get(mergedClasses.value, "item") ?? ""]: true,
          "ml-0": isOutlined.value,
          [get(roundedItem.value, "itemStart") ?? ""]: isOutlined.value,
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
        "aria-label": nextLabel.value,
        class: cn({
          [itemIconClass.value]: true,
          [get(mergedClasses.value, "next") ?? ""]: true,
          [get(mergedClasses.value, "item") ?? ""]: true,
          [get(roundedItem.value, "itemEnd") ?? ""]: isOutlined.value,
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
    prevLabel,
    nextLabel,
    getItemBind,
    prevIconBind,
    nextIconBind,
    getEllipsisBind,
  };
}
