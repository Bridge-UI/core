// ** External Imports
import { omit } from "es-toolkit/compat";

// ** Core Imports
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useTableContext } from "@/Components/Table/TableContext";
import type {
  TableBodyOwnProps,
  TableBodyProps,
  TableCaptionOwnProps,
  TableCaptionProps,
  TableFooterOwnProps,
  TableFooterProps,
  TableHeaderOwnProps,
  TableHeaderProps,
} from "@/Components/Table/table.types";
import { derived, mergePartBind } from "@/Utils";

const tablePartBridgeKeys = [
  "classes",
  "customProps",
] as const satisfies readonly (
  | keyof TableBodyOwnProps
  | keyof TableFooterOwnProps
  | keyof TableHeaderOwnProps
  | keyof TableCaptionOwnProps
)[];

type TablePartKind = "body" | "footer" | "header" | "caption";

type TablePartPropsMap = {
  body: TableBodyProps;
  caption: TableCaptionProps;
  footer: TableFooterProps;
  header: TableHeaderProps;
};

/**
 * Bind for `TableHeader` / `TableBody` / `TableFooter` / `TableCaption`.
 */
export function useTablePart<K extends TablePartKind>(
  props: TablePartPropsMap[K],
  part: K,
) {
  const table = useTableContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    TablePartPropsMap[K],
    typeof tablePartBridgeKeys
  >({
    props,
    bridgeKeys: tablePartBridgeKeys,
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

  const variantClass = derived(() => {
    if (part === "header") {
      return table.tokenClasses.variantHeader;
    }

    if (part === "body") {
      return table.tokenClasses.variantBody;
    }

    if (part === "footer") {
      return table.tokenClasses.variantFooter;
    }

    return table.tokenClasses.variantCaption;
  });

  const sizeClass = derived(() => {
    return part === "caption" ? table.tokenClasses.sizeCaption : undefined;
  });

  const registryClass = derived(() => {
    return table.mergedClasses[part];
  });

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      className: cn({
        "sticky top-0 z-20": part === "header" && table.stickyHeader,
        [sizeClass ?? ""]: true,
        [variantClass ?? ""]: true,
        [table.tokenClasses.roundedHeader ?? ""]: part === "header",
        [table.tokenClasses.roundedFooter ?? ""]: part === "footer",
        [registryClass ?? ""]: true,
        [componentProps.classes?.root ?? ""]: true,
      }),
    });
  });

  return {
    children,
    rootBind,
  };
}
