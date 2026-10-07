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
  cy.get("table").should("be.visible");
  cy.contains("Ada Lovelace").should("be.visible");
});

test("it should render the default empty state", () => {
  cy.mount(DataTable, {
    props: {
      columns,
      rows: [],
    },
  });

  cy.get("svg").should("be.visible");
  cy.contains("No data").should("be.visible");
});

test("it should render the bordered variant", () => {
  cy.mount(DataTable, {
    props: {
      columns,
      variant: "bordered",
      rows: [{ id: "1", name: "Ada" }],
    },
  });

  cy.get("table").parent().should("have.class", "ring-1");
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
      showColumnVisibility: true,
      rows: [{ id: "1", name: "Ada Lovelace" }],
    },
  });

  cy.get('button[aria-label="Columns"]').should("be.visible");
});

test("it should show the toolbar search field", () => {
  cy.mount(DataTable, {
    props: {
      columns,
      showSearch: true,
      rows: [{ id: "1", name: "Ada Lovelace" }],
    },
  });

  cy.get('input[aria-label="Search"]').should("be.visible");
});

test("it should mark the current page in the footer status", () => {
  cy.mount(DataTable, {
    props: {
      page: 2,
      columns,
      pageCount: 3,
      rows: [{ id: "1", name: "Ada Lovelace" }],
    },
  });

  cy.contains("Page 2 of 3").should("be.visible");
});

test("it should set aria-sort on a sorted column", () => {
  cy.mount(DataTable, {
    props: {
      sorting: { id: "name", desc: true },
      rows: [{ id: "1", name: "Ada Lovelace" }],
      columns: [
        { id: "name", header: "Name", sortable: true, cell: (row) => row.name },
      ],
    },
  });

  cy.get("th[aria-sort='descending']").should("be.visible");
  cy.get('button[aria-label="Cancel sorting"]').should("be.visible");
});

test("it should shrink-wrap when full is false", () => {
  cy.mount(DataTable, {
    props: {
      columns,
      full: false,
      variant: "bordered",
      rows: [{ id: "1", name: "Ada Lovelace" }],
    },
  });

  cy.get("table").parent().should("have.class", "ring-1");
  cy.get("table").parent().parent().should("have.class", "w-fit");
});

test("it should stack per-page and pagination when they overflow", () => {
  cy.mount(DataTable, {
    attrs: { style: "width: 220px" },
    props: {
      page: 1,
      columns,
      perPage: 10,
      pageCount: 8,
      rows: [{ id: "1", name: "Ada Lovelace" }],
    },
  });

  cy.contains("Rows per page")
    .closest(".py-3")
    .should("have.css", "flex-direction", "column")
    .and("have.css", "justify-content", "center");
});

test("it should keep per-page and pagination inline when they fit", () => {
  cy.mount(DataTable, {
    attrs: { style: "width: 960px" },
    props: {
      page: 1,
      columns,
      perPage: 10,
      pageCount: 8,
      rows: [{ id: "1", name: "Ada Lovelace" }],
    },
  });

  cy.contains("Rows per page")
    .closest(".py-3")
    .should("have.css", "flex-direction", "row")
    .and("have.css", "justify-content", "space-between");
});

test("it should keep two clusters inline below the three-cluster breakpoint", () => {
  cy.mount(DataTable, {
    attrs: { style: "width: 560px" },
    props: {
      page: 1,
      columns,
      perPage: 10,
      pageCount: 100,
      totalCount: 1000,
      rows: [{ id: "1", name: "Ada Lovelace" }],
    },
  });

  cy.contains("Rows per page")
    .closest(".py-3")
    .should("have.css", "flex-direction", "row")
    .and("have.css", "justify-content", "space-between");
});

test("it should fit selection, per-page and pagination on one row at the breakpoint", () => {
  cy.mount(DataTable, {
    attrs: { style: "width: 780px" },
    props: {
      page: 1,
      columns,
      perPage: 10,
      pageCount: 100,
      totalCount: 1000,
      selection: ["1"],
      rows: [{ id: "1", name: "Ada Lovelace" }],
    },
  });

  cy.contains("Rows per page")
    .closest(".py-3")
    .should("have.css", "flex-direction", "row")
    .then(($footer) => {
      const centers = [...$footer.children()].map((child) => {
        return Math.round(child.offsetTop + child.offsetHeight / 2);
      });

      expect(new Set(centers).size).to.eq(1);
    });
});

test("it should keep header text from clipping truncated glyphs", () => {
  cy.mount(DataTable, {
    props: {
      rows: [{ id: "1", name: "Ada Lovelace" }],
      columns: [
        {
          id: "tags",
          header: "Tags",
          cell: (row: User) => row.name,
          filters: [{ label: "A", value: "a" }],
        },
      ],
    },
  });

  cy.contains("Tags")
    .should("have.class", "leading-normal")
    .and("not.have.class", "leading-none")
    .then(($el) => {
      const styles = getComputedStyle($el[0]);

      expect(Number.parseFloat(styles.lineHeight)).to.be.greaterThan(
        Number.parseFloat(styles.fontSize),
      );
    });
});

test("it should render a cursor pager instead of the page status", () => {
  cy.mount(DataTable, {
    props: {
      columns,
      cursor: "b",
      perPage: 10,
      prevCursor: "a",
      nextCursor: null,
      rows: [{ id: "1", name: "Ada Lovelace" }],
      "onUpdate:cursor": cy.stub().as("onUpdateCursor"),
    },
  });

  cy.contains(/Page \d+ of/).should("not.exist");
  cy.get("[role='combobox']").should("be.visible");
  cy.get("button[aria-label='Next']").should("be.disabled");
  cy.get("button[aria-label='Previous']").should("be.enabled").click();
  cy.get("@onUpdateCursor").should("have.been.calledOnceWith", "a");
});
