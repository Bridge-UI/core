// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, provide, useAttrs } from "vue";

// ** Core Imports
import {
  tableAlignProps as alignProps,
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
import type { TableOwnProps, TableProps } from "@/Components/Table/table.types";
import {
  TABLE_INJECTION_KEY,
  type TableContextValue,
} from "@/Components/Table/tableInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const tableBridgeKeys = [
  "full",
  "size",
  "classes",
  "striped",
  "variant",
  "hoverable",
  "customProps",
  "stickyHeader",
] as const satisfies readonly (keyof TableOwnProps)[];

type TableLibDefaults = LibDefaultsShape<
  TableOwnProps,
  "full" | "size" | "striped" | "variant" | "hoverable" | "stickyHeader"
>;

type TableMerged = MergeLibDefaults<TableOwnProps, TableLibDefaults>;

export function useTable(props: TableOwnProps, libDefaults: TableLibDefaults) {
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<TableProps, typeof tableBridgeKeys>({
      bridgeKeys: tableBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeTable } = useBridgeUIComponent<
    TableMerged,
    "Table"
  >({
    libDefaults,
    componentName: "Table",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeTable,
    props: () => split.value.componentProps,
  });

  const sizeClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeTable.value?.tokens?.size,
    );
  });

  const variantClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeTable.value?.tokens?.variant,
    );
  });

  const alignClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      alignProps,
      bridgeTable.value?.tokens?.align,
    );
  });

  const sizeItem = computed(() => {
    return get(sizeClasses.value, merged.value.size);
  });

  const variantItem = computed(() => {
    return get(variantClasses.value, merged.value.variant);
  });

  const contextValue = computed((): TableContextValue => {
    return {
      full: merged.value.full === true,
      striped: merged.value.striped === true,
      hoverable: merged.value.hoverable === true,
      stickyHeader: merged.value.stickyHeader === true,
      mergedClasses: {
        row: get(mergedClasses.value, "row"),
        body: get(mergedClasses.value, "body"),
        cell: get(mergedClasses.value, "cell"),
        head: get(mergedClasses.value, "head"),
        footer: get(mergedClasses.value, "footer"),
        header: get(mergedClasses.value, "header"),
        caption: get(mergedClasses.value, "caption"),
      },
      tokenClasses: {
        sizeHead: get(sizeItem.value, "head"),
        sizeCell: get(sizeItem.value, "cell"),
        align: alignClasses.value as TableAlign,
        variantRow: get(variantItem.value, "row"),
        sizeCaption: get(sizeItem.value, "caption"),
        variantBody: get(variantItem.value, "body"),
        variantHead: get(variantItem.value, "head"),
        variantCell: get(variantItem.value, "cell"),
        variantFooter: get(variantItem.value, "footer"),
        variantHeader: get(variantItem.value, "header"),
        variantCaption: get(variantItem.value, "caption"),
        variantRowHover: get(variantItem.value, "rowHover"),
        variantRowStriped: get(variantItem.value, "rowStriped"),
        variantHeadSticky: get(variantItem.value, "headSticky"),
      },
    };
  });

  provide(TABLE_INJECTION_KEY, contextValue);

  const rootBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.root,
      split.value.inheritedAttrs,
      {
        class: cn({
          [get(sizeItem.value, "root") ?? ""]: true,
          [get(variantItem.value, "root") ?? ""]: true,
          [get(mergedClasses.value, "root") ?? ""]: true,
        }),
      },
    );
  });

  const tableBind = computed(() => {
    return mergePartBind(
      merged.value.customProps?.table,
      {},
      {
        class: cn({
          "w-full": merged.value.full === true,
          [get(sizeItem.value, "table") ?? ""]: true,
          [get(variantItem.value, "table") ?? ""]: true,
          [get(mergedClasses.value, "table") ?? ""]: true,
        }),
      },
    );
  });

  return {
    merged,
    rootBind,
    tableBind,
    contextValue,
  };
}
