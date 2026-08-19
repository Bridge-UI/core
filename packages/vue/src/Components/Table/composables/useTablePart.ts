// ** External Imports
import { computed, inject, provide, useAttrs } from "vue";

// ** Core Imports
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
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
import {
  TABLE_INJECTION_KEY,
  TABLE_SECTION_INJECTION_KEY,
  type TableSection,
} from "@/Components/Table/tableInjectionKey";
import { mergePartBind } from "@/Utils";

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

type TablePartProps =
  TableBodyProps | TableFooterProps | TableHeaderProps | TableCaptionProps;

/**
 * Bind for `TableHeader` / `TableBody` / `TableFooter` / `TableCaption`.
 */
export function useTablePart(props: TablePartProps, part: TablePartKind) {
  const attrs = useAttrs();
  const tableContextRef = inject(TABLE_INJECTION_KEY, null);

  if (!tableContextRef) {
    throw new Error("Table parts must be used within a Table provider");
  }

  if (part !== "caption") {
    provide(
      TABLE_SECTION_INJECTION_KEY,
      computed(() => part as TableSection),
    );
  }

  const split = computed(() => {
    return splitComponentProps<TablePartProps, typeof tablePartBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: tablePartBridgeKeys,
    });
  });

  const rootBind = computed(() => {
    const table = tableContextRef.value;
    const variantClass =
      part === "header"
        ? table.tokenClasses.variantHeader
        : part === "body"
          ? table.tokenClasses.variantBody
          : part === "footer"
            ? table.tokenClasses.variantFooter
            : table.tokenClasses.variantCaption;
    const sizeClass =
      part === "caption" ? table.tokenClasses.sizeCaption : undefined;

    return mergePartBind(
      split.value.componentProps.customProps?.root,
      split.value.inheritedAttrs,
      {
        class: cn({
          [sizeClass ?? ""]: true,
          [variantClass ?? ""]: true,
          [table.mergedClasses[part] ?? ""]: true,
          [split.value.componentProps.classes?.root ?? ""]: true,
        }),
      },
    );
  });

  return {
    rootBind,
  };
}
