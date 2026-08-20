// ** Local Imports
import { TableSectionContext } from "@/Components/Table/TableContext";
import { useTablePart } from "@/Components/Table/hooks/useTablePart";
import type { TableHeaderProps } from "@/Components/Table/table.types";

function TableHeader(props: TableHeaderProps) {
  const { children, rootBind } = useTablePart(props, "header");

  return (
    <TableSectionContext.Provider value="header">
      <thead {...rootBind}>{children}</thead>
    </TableSectionContext.Provider>
  );
}

export default TableHeader;
