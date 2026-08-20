// ** External Imports
import { get, omit } from "es-toolkit/compat";

// ** Core Imports
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import {
  useTableContext,
  useTableSectionContext,
} from "@/Components/Table/TableContext";
import type {
  TableCellOwnProps,
  TableCellProps,
  TableHeadOwnProps,
  TableHeadProps,
} from "@/Components/Table/table.types";
import { derived, mergePartBind } from "@/Utils";

const tableCellBridgeKeys = [
  "align",
  "classes",
  "numeric",
  "customProps",
] as const satisfies readonly (
  keyof TableCellOwnProps | keyof TableHeadOwnProps
)[];

type TableCellKind = "cell" | "head";

type TableCellPropsMap = {
  cell: TableCellProps;
  head: TableHeadProps;
};

/**
 * Bind for `TableCell` (`td`) and `TableHead` (`th`).
 */
export function useTableCell<K extends TableCellKind>(
  props: TableCellPropsMap[K],
  part: K,
) {
  const table = useTableContext();
  const section = useTableSectionContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    TableCellPropsMap[K],
    typeof tableCellBridgeKeys
  >({
    props,
    bridgeKeys: tableCellBridgeKeys,
  });

  const children = derived(() => {
    return props.children;
  });

  const customProps = derived(() => {
    return componentProps.customProps;
  });

  const numeric = derived(() => {
    return componentProps.numeric === true;
  });

  const align = derived(() => {
    return componentProps.align ?? (numeric ? "end" : "start");
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children"]);
  });

  const alignItem = derived(() => {
    return get(table.tokenClasses.align, align);
  });

  const isStickyHead = derived(() => {
    return part === "head" && table.stickyHeader && section === "header";
  });

  const rootBind = derived(() => {
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

    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      scope: part === "head" ? "col" : undefined,
      className: cn({
        "tabular-nums": numeric,
        [sizeClass ?? ""]: true,
        [alignClass ?? ""]: true,
        [variantClass ?? ""]: true,
        [registryClass ?? ""]: true,
        [componentProps.classes?.root ?? ""]: true,
        [table.tokenClasses.variantHeadSticky ?? ""]: isStickyHead,
      }),
    });
  });

  return {
    children,
    rootBind,
  };
}
