// ** External Imports
import { omit } from "es-toolkit/compat";

// ** Core Imports
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import {
  useTableContext,
  useTableSectionContext,
} from "@/Components/Table/TableContext";
import type {
  TableRowOwnProps,
  TableRowProps,
} from "@/Components/Table/table.types";
import { derived, mergePartBind } from "@/Utils";

const tableRowBridgeKeys = [
  "classes",
  "customProps",
] as const satisfies readonly (keyof TableRowOwnProps)[];

export function useTableRow(props: TableRowProps) {
  const table = useTableContext();
  const section = useTableSectionContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    TableRowProps,
    typeof tableRowBridgeKeys
  >({
    props,
    bridgeKeys: tableRowBridgeKeys,
  });

  const children = derived(() => {
    return props.children;
  });

  const customProps = derived(() => {
    return componentProps.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children"]);
  });

  const isBodyRow = derived(() => {
    return section === "body";
  });

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      className: cn({
        [table.tokenClasses.variantRow ?? ""]: true,
        [table.mergedClasses.row ?? ""]: true,
        [componentProps.classes?.root ?? ""]: true,
        [table.tokenClasses.variantRowHover ?? ""]:
          isBodyRow && table.hoverable,
        [table.tokenClasses.variantRowStriped ?? ""]:
          isBodyRow && table.striped,
      }),
    });
  });

  return {
    children,
    rootBind,
  };
}
