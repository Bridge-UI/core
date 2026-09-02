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

test("it should render the default empty state", () => {
  cy.mount(<DataTable rows={[]} columns={columns} />);

  cy.get("svg").should("be.visible");
  cy.contains("No data").should("be.visible");
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

test("it should show the toolbar search field", () => {
  cy.mount(
    <DataTable
      search=""
      columns={columns}
      rows={[{ id: "1", name: "Ada Lovelace" }]}
    />,
  );

  cy.get('input[aria-label="Search"]').should("be.visible");
});

test("it should mark the current page in the footer status", () => {
  cy.mount(
    <DataTable
      page={2}
      pageCount={3}
      columns={columns}
      rows={[{ id: "1", name: "Ada Lovelace" }]}
    />,
  );

  cy.contains("Page 2 of 3").should("be.visible");
});

test("it should set aria-sort on a sorted column", () => {
  cy.mount(
    <DataTable
      sorting={{ id: "name", desc: true }}
      rows={[{ id: "1", name: "Ada Lovelace" }]}
      columns={[
        { id: "name", header: "Name", sortable: true, cell: (row) => row.name },
      ]}
    />,
  );

  cy.get("th[aria-sort='descending']").should("be.visible");
  cy.get('button[aria-label="Cancel sorting"]').should("be.visible");
});

test("it should shrink-wrap when full is false", () => {
  cy.mount(
    <DataTable
      full={false}
      columns={columns}
      variant="bordered"
      rows={[{ id: "1", name: "Ada Lovelace" }]}
    />,
  );

  cy.get("table").parent().should("have.class", "ring-1");
  cy.get("table").parent().parent().should("have.class", "w-fit");
});

test("it should stack per-page and pagination when they overflow", () => {
  cy.mount(
    <DataTable
      page={1}
      perPage={10}
      pageCount={8}
      columns={columns}
      style={{ width: 220 }}
      rows={[{ id: "1", name: "Ada Lovelace" }]}
    />,
  );

  cy.contains("Rows per page")
    .closest(".gap-3")
    .should("have.class", "flex-col");
});

test("it should keep per-page and pagination inline when they fit", () => {
  cy.mount(
    <DataTable
      page={1}
      perPage={10}
      pageCount={8}
      columns={columns}
      style={{ width: 960 }}
      rows={[{ id: "1", name: "Ada Lovelace" }]}
    />,
  );

  cy.contains("Rows per page")
    .closest(".gap-3")
    .should("have.class", "flex-row")
    .and("have.class", "justify-between");
});
