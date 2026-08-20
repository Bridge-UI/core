// ** Local Imports
import { useTablePart } from "@/Components/Table/hooks/useTablePart";
import type { TableCaptionProps } from "@/Components/Table/table.types";

function TableCaption(props: TableCaptionProps) {
  const { children, rootBind } = useTablePart(props, "caption");

  return <caption {...rootBind}>{children}</caption>;
}

export default TableCaption;
