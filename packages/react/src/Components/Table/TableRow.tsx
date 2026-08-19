// ** Local Imports
import { useTableRow } from "@/Components/Table/hooks/useTableRow";
import type { TableRowProps } from "@/Components/Table/table.types";

function TableRow(props: TableRowProps) {
  const { children, rootBind } = useTableRow(props);

  return <tr {...rootBind}>{children}</tr>;
}

export default TableRow;
