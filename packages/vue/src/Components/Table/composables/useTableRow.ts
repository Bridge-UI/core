// ** External Imports
import { computed, inject, useAttrs } from "vue";

// ** Core Imports
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  TableRowOwnProps,
  TableRowProps,
} from "@/Components/Table/table.types";
import {
  TABLE_INJECTION_KEY,
  TABLE_SECTION_INJECTION_KEY,
} from "@/Components/Table/tableInjectionKey";
import { mergePartBind } from "@/Utils";

const tableRowBridgeKeys = [
  "classes",
  "customProps",
] as const satisfies readonly (keyof TableRowOwnProps)[];

export function useTableRow(props: TableRowOwnProps) {
  const attrs = useAttrs();
  const tableContextRef = inject(TABLE_INJECTION_KEY, null);
  const sectionRef = inject(TABLE_SECTION_INJECTION_KEY, null);

  if (!tableContextRef) {
    throw new Error("Table parts must be used within a Table provider");
  }

  const split = computed(() => {
    return splitComponentProps<TableRowProps, typeof tableRowBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: tableRowBridgeKeys,
    });
  });

  const rootBind = computed(() => {
    const table = tableContextRef.value;
    const isBodyRow = sectionRef?.value === "body";

    return mergePartBind(
      split.value.componentProps.customProps?.root,
      split.value.inheritedAttrs,
      {
        class: cn({
          [table.tokenClasses.variantRow ?? ""]: true,
          [table.mergedClasses.row ?? ""]: true,
          [split.value.componentProps.classes?.root ?? ""]: true,
          [table.tokenClasses.variantRowHover ?? ""]:
            isBodyRow && table.hoverable,
          [table.tokenClasses.variantRowStriped ?? ""]:
            isBodyRow && table.striped,
        }),
      },
    );
  });

  return {
    rootBind,
  };
}
