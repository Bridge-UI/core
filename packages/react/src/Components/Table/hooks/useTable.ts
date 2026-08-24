// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  tableAlignProps as alignProps,
  tableRoundedProps as roundedProps,
  tableSizeProps as sizeProps,
  tableVariantProps as variantProps,
  type TableAlign,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type { TableContextValue } from "@/Components/Table/TableContext";
import type { TableOwnProps, TableProps } from "@/Components/Table/table.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const tableBridgeKeys = [
  "full",
  "size",
  "classes",
  "rounded",
  "striped",
  "variant",
  "hoverable",
  "customProps",
  "stickyHeader",
] as const satisfies readonly (keyof TableOwnProps)[];

type TableLibDefaults = LibDefaultsShape<
  TableOwnProps,
  | "full"
  | "size"
  | "rounded"
  | "striped"
  | "variant"
  | "hoverable"
  | "stickyHeader"
>;

type TableMerged = MergeLibDefaults<TableOwnProps, TableLibDefaults>;

export function useTable(props: TableProps, libDefaults: TableLibDefaults) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    TableProps,
    typeof tableBridgeKeys
  >({
    props,
    bridgeKeys: tableBridgeKeys,
  });

  const { merged, entry: bridgeTable } = useBridgeUIComponent<
    TableMerged,
    "Table"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Table",
  });

  const children = derived(() => {
    return props.children;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeTable,
    props: componentProps,
  });

  const sizeClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(sizeProps, bridgeTable?.tokens?.size);
  }, [bridgeTable?.tokens?.size]);

  const variantClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeTable?.tokens?.variant,
    );
  }, [bridgeTable?.tokens?.variant]);

  const alignClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(alignProps, bridgeTable?.tokens?.align);
  }, [bridgeTable?.tokens?.align]);

  const roundedClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeTable?.tokens?.rounded,
    );
  }, [bridgeTable?.tokens?.rounded]);

  const sizeItem = derived(() => {
    return get(sizeClasses, merged.size);
  });

  const variantItem = derived(() => {
    return get(variantClasses, merged.variant);
  });

  const roundedItem = derived(() => {
    return get(roundedClasses, merged.rounded);
  });

  const contextValue = useMemo((): TableContextValue => {
    return {
      full: merged.full === true,
      striped: merged.striped === true,
      hoverable: merged.hoverable === true,
      stickyHeader: merged.stickyHeader === true,
      mergedClasses: {
        row: get(mergedClasses, "row"),
        body: get(mergedClasses, "body"),
        cell: get(mergedClasses, "cell"),
        head: get(mergedClasses, "head"),
        footer: get(mergedClasses, "footer"),
        header: get(mergedClasses, "header"),
        caption: get(mergedClasses, "caption"),
      },
      tokenClasses: {
        sizeHead: get(sizeItem, "head"),
        sizeCell: get(sizeItem, "cell"),
        align: alignClasses as TableAlign,
        variantRow: get(variantItem, "row"),
        sizeCaption: get(sizeItem, "caption"),
        variantBody: get(variantItem, "body"),
        variantHead: get(variantItem, "head"),
        variantCell: get(variantItem, "cell"),
        variantFooter: get(variantItem, "footer"),
        variantHeader: get(variantItem, "header"),
        roundedFooter: get(roundedItem, "footer"),
        roundedHeader: get(roundedItem, "header"),
        variantCaption: get(variantItem, "caption"),
        variantRowHover: get(variantItem, "rowHover"),
        variantRowStriped: get(variantItem, "rowStriped"),
        variantHeadSticky: get(variantItem, "headSticky"),
      },
    };
  }, [
    roundedItem,
    sizeItem,
    merged.full,
    variantItem,
    alignClasses,
    mergedClasses,
    merged.striped,
    merged.hoverable,
    merged.stickyHeader,
  ]);

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      className: cn({
        "overflow-x-auto": merged.stickyHeader !== true,
        [get(sizeItem, "root") ?? ""]: true,
        [get(variantItem, "root") ?? ""]: true,
        [get(roundedItem, "root") ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const tableBind = derived(() => {
    const tableVariantClass =
      merged.stickyHeader === true
        ? get(variantItem, "tableSticky")
        : get(variantItem, "table");

    return mergePartBind(
      customProps?.table,
      {},
      {
        className: cn({
          "w-max sm:min-w-full": merged.full === true,
          [get(sizeItem, "table") ?? ""]: true,
          [tableVariantClass ?? ""]: true,
          [get(mergedClasses, "table") ?? ""]: true,
        }),
      },
    );
  });

  return {
    merged,
    children,
    rootBind,
    tableBind,
    contextValue,
  };
}
