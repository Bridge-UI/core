// ** Local Imports
import { TableSectionContext } from "@/Components/Table/TableContext";
import { useTablePart } from "@/Components/Table/hooks/useTablePart";
import type { TableBodyProps } from "@/Components/Table/table.types";

function TableBody(props: TableBodyProps) {
  const { children, rootBind } = useTablePart(props, "body");

  return (
    <TableSectionContext.Provider value="body">
      <tbody {...rootBind}>{children}</tbody>
    </TableSectionContext.Provider>
  );
}

export default TableBody;
