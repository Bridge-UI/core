// ** Local Imports
import { TableSectionContext } from "@/Components/Table/TableContext";
import { useTablePart } from "@/Components/Table/hooks/useTablePart";
import type { TableFooterProps } from "@/Components/Table/table.types";

function TableFooter(props: TableFooterProps) {
  const { children, rootBind } = useTablePart(props, "footer");

  return (
    <TableSectionContext.Provider value="footer">
      <tfoot {...rootBind}>{children}</tfoot>
    </TableSectionContext.Provider>
  );
}

export default TableFooter;
