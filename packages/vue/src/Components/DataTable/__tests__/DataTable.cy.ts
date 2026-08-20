// ** Local Imports
import { DataTable } from "@/Components/DataTable";
import type { DataTableColumn } from "@/Components/DataTable/dataTable.types";

type User = { id: string; name: string };

const columns: DataTableColumn<User>[] = [
  { id: "name", header: "Name", cell: (row) => row.name },
];

test("it should render a data table in the browser", () => {
  cy.mount(DataTable, {
    props: {
      columns,
      rows: [{ id: "1", name: "Ada Lovelace" }],
    },
  });

  cy.contains("Name").should("be.visible");
  cy.get('[role="table"]').should("be.visible");
  cy.contains("Ada Lovelace").should("be.visible");
});

test("it should render the bordered variant", () => {
  cy.mount(DataTable, {
    props: {
      columns,
      variant: "bordered",
      rows: [{ id: "1", name: "Ada" }],
    },
  });

  cy.get('[role="table"]').parent().should("have.class", "ring-1");
});

test("it should render radios in single selection mode", () => {
  cy.mount(DataTable, {
    props: {
      columns,
      selection: [],
      selectionMode: "single",
      getRowId: (row: User) => row.id,
      rows: [{ id: "1", name: "Ada Lovelace" }],
    },
  });

  cy.get('input[type="radio"][aria-label="Select row"]').should("be.visible");
});

test("it should render the columns toolbar control", () => {
  cy.mount(DataTable, {
    props: {
      columns,
      hiddenColumns: [],
      rows: [{ id: "1", name: "Ada Lovelace" }],
    },
  });

  cy.contains("button", "Columns").should("be.visible");
});
