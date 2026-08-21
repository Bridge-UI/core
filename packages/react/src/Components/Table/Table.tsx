// ** Local Imports
import { TableContext } from "@/Components/Table/TableContext";
import { useTable } from "@/Components/Table/hooks/useTable";
import type { TableProps } from "@/Components/Table/table.types";

const tableLibDefaults = {
  size: "md",
  full: true,
  rounded: "lg",
  striped: false,
  variant: "plain",
  hoverable: false,
  stickyHeader: false,
} as const;

function Table(props: TableProps) {
  const { children, rootBind, tableBind, contextValue } = useTable(
    props,
    tableLibDefaults,
  );

  return (
    <TableContext.Provider value={contextValue}>
      <div {...rootBind}>
        <table {...tableBind}>{children}</table>
      </div>
    </TableContext.Provider>
  );
}

export default Table;
