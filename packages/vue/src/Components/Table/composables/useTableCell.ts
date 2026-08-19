// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, inject, useAttrs } from "vue";

// ** Core Imports
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  TableCellOwnProps,
  TableCellProps,
  TableHeadOwnProps,
  TableHeadProps,
} from "@/Components/Table/table.types";
import {
  TABLE_INJECTION_KEY,
  TABLE_SECTION_INJECTION_KEY,
} from "@/Components/Table/tableInjectionKey";
import { mergePartBind } from "@/Utils";

const tableCellBridgeKeys = [
  "align",
  "classes",
  "numeric",
  "customProps",
] as const satisfies readonly (
  keyof TableCellOwnProps | keyof TableHeadOwnProps
)[];

type TableCellKind = "cell" | "head";

/**
 * Bind for `TableCell` (`td`) and `TableHead` (`th`).
 */
export function useTableCell(
  props: TableCellOwnProps | TableHeadOwnProps,
  part: TableCellKind,
) {
  const attrs = useAttrs();
  const tableContextRef = inject(TABLE_INJECTION_KEY, null);
  const sectionRef = inject(TABLE_SECTION_INJECTION_KEY, null);

  if (!tableContextRef) {
    throw new Error("Table parts must be used within a Table provider");
  }

  const split = computed(() => {
    return splitComponentProps<
      TableCellProps | TableHeadProps,
      typeof tableCellBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: tableCellBridgeKeys,
    });
  });

  const rootBind = computed(() => {
    const table = tableContextRef.value;
    const numeric = split.value.componentProps.numeric === true;
    const align =
      split.value.componentProps.align ?? (numeric ? "end" : "start");
    const alignItem = get(table.tokenClasses.align, align);
    const sizeClass =
      part === "head"
        ? table.tokenClasses.sizeHead
        : table.tokenClasses.sizeCell;
    const variantClass =
      part === "head"
        ? table.tokenClasses.variantHead
        : table.tokenClasses.variantCell;
    const alignClass =
      part === "head" ? get(alignItem, "head") : get(alignItem, "cell");
    const registryClass =
      part === "head" ? table.mergedClasses.head : table.mergedClasses.cell;
    const isStickyHead =
      part === "head" && table.stickyHeader && sectionRef?.value === "header";

    return mergePartBind(
      split.value.componentProps.customProps?.root,
      split.value.inheritedAttrs,
      {
        scope: part === "head" ? "col" : undefined,
        class: cn({
          "tabular-nums": numeric,
          [sizeClass ?? ""]: true,
          [alignClass ?? ""]: true,
          [variantClass ?? ""]: true,
          [registryClass ?? ""]: true,
          [split.value.componentProps.classes?.root ?? ""]: true,
          [table.tokenClasses.variantHeadSticky ?? ""]: isStickyHead,
        }),
      },
    );
  });

  return {
    rootBind,
  };
}
