// ** Local Imports
import { DataTable } from "@/Components/DataTable";
import type { DataTableColumn } from "@/Components/DataTable/dataTable.types";

type User = { id: string; name: string };

const columns: DataTableColumn<User>[] = [
  { id: "name", header: "Name", cell: (row) => row.name },
];

test("it should render a data table in the browser", () => {
  cy.mount(
    <DataTable columns={columns} rows={[{ id: "1", name: "Ada Lovelace" }]} />,
  );

  cy.contains("Name").should("be.visible");
  cy.get("table").should("be.visible");
  cy.contains("Ada Lovelace").should("be.visible");
});

test("it should render the bordered variant", () => {
  cy.mount(
    <DataTable
      columns={columns}
      variant="bordered"
      rows={[{ id: "1", name: "Ada" }]}
    />,
  );

  cy.get("table").parent().should("have.class", "ring-1");
});

test("it should render radios in single selection mode", () => {
  cy.mount(
    <DataTable
      selection={[]}
      columns={columns}
      selectionMode="single"
      getRowId={(row) => row.id}
      rows={[{ id: "1", name: "Ada Lovelace" }]}
    />,
  );

  cy.get('input[type="radio"][aria-label="Select row"]').should("be.visible");
});

test("it should render the columns toolbar control", () => {
  cy.mount(
    <DataTable
      columns={columns}
      hiddenColumns={[]}
      rows={[{ id: "1", name: "Ada Lovelace" }]}
    />,
  );

  cy.get('button[aria-label="Columns"]').should("be.visible");
});
