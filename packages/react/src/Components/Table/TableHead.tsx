// ** Local Imports
import { useTableCell } from "@/Components/Table/hooks/useTableCell";
import type { TableHeadProps } from "@/Components/Table/table.types";

function TableHead(props: TableHeadProps) {
  const { children, rootBind } = useTableCell(props, "head");

  return <th {...rootBind}>{children}</th>;
}

export default TableHead;
