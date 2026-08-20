// ** Local Imports
import { useTableCell } from "@/Components/Table/hooks/useTableCell";
import type { TableCellProps } from "@/Components/Table/table.types";

function TableCell(props: TableCellProps) {
  const { children, rootBind } = useTableCell(props, "cell");

  return <td {...rootBind}>{children}</td>;
}

export default TableCell;
