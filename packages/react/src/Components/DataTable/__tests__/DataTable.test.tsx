// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { DataTable } from "@/Components/DataTable";
import type {
  DataTableColumn,
  DataTableFilters,
} from "@/Components/DataTable/dataTable.types";

afterEach(() => {
  cleanup();
  resetLayerStackForTests();
});

type User = { id: string; name: string; role: string };

const rows: User[] = [
  { id: "1", role: "Engineer", name: "Ada Lovelace" },
  { id: "2", role: "Researcher", name: "Alan Turing" },
];

const columns: DataTableColumn<User>[] = [
  { id: "name", header: "Name", cell: (row) => row.name },
  {
    id: "role",
    header: "Role",
    sortable: true,
    cell: (row) => row.role,
  },
];

test("it should render headers and cells from columns and rows", () => {
  render(<DataTable rows={rows} columns={columns} />);

  expect(screen.getByText("Name")).toBeTruthy();
  expect(screen.getByText("Role")).toBeTruthy();
  expect(screen.getByRole("table")).toBeTruthy();
  expect(screen.getByText("Alan Turing")).toBeTruthy();
  expect(screen.getByText("Ada Lovelace")).toBeTruthy();
});

test("it should apply the bordered variant on the table wrapper", () => {
  render(<DataTable rows={rows} columns={columns} variant="bordered" />);

  expect(screen.getByRole("table").parentElement?.className).toContain(
    "ring-1",
  );
});

test("it should call onSortingChange when a sortable header is clicked", () => {
  const onSortingChange = vi.fn();

  render(
    <DataTable
      rows={rows}
      columns={columns}
      onSortingChange={onSortingChange}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: /Role/ }));

  expect(onSortingChange).toHaveBeenCalledWith({ id: "role", desc: false });
  expect(
    screen
      .getByRole("columnheader", { name: /Role/ })
      .getAttribute("aria-sort"),
  ).toBe("none");
});

test("it should set aria-sort when sorting is controlled", () => {
  render(
    <DataTable
      rows={rows}
      columns={columns}
      sorting={{ id: "role", desc: true }}
    />,
  );

  expect(
    screen
      .getByRole("columnheader", { name: /Role/ })
      .getAttribute("aria-sort"),
  ).toBe("descending");
});

test("it should toggle row selection", () => {
  const onSelectionChange = vi.fn();

  render(
    <DataTable
      rows={rows}
      selection={[]}
      columns={columns}
      getRowId={(row) => row.id}
      onSelectionChange={onSelectionChange}
    />,
  );

  fireEvent.click(screen.getAllByRole("checkbox", { name: "Select row" })[0]!);

  expect(onSelectionChange).toHaveBeenCalledWith(["1"]);
});

test("it should render built-in pagination when page and pageCount are set", () => {
  const onPageChange = vi.fn();

  render(
    <DataTable
      page={1}
      rows={rows}
      pageCount={4}
      columns={columns}
      onPageChange={onPageChange}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Page 2" }));

  expect(onPageChange).toHaveBeenCalledWith(2);
});

test("it should show the empty slot when there are no rows", () => {
  render(
    <DataTable rows={[]} columns={columns} slots={{ empty: "No users" }} />,
  );

  expect(screen.getByText("No users")).toBeTruthy();
});

test("it should mark the table busy and show a spinner when loading", () => {
  render(<DataTable loading rows={rows} columns={columns} />);

  expect(screen.getByRole("table").getAttribute("aria-busy")).toBe("true");
});

test("it should render radios and replace the selection in single mode", () => {
  const onSelectionChange = vi.fn();

  render(
    <DataTable
      rows={rows}
      selection={["1"]}
      columns={columns}
      selectionMode="single"
      getRowId={(row) => row.id}
      onSelectionChange={onSelectionChange}
    />,
  );

  expect(
    screen.queryByRole("checkbox", { name: "Select all rows" }),
  ).toBeNull();

  fireEvent.click(screen.getAllByRole("radio", { name: "Select row" })[1]!);

  expect(onSelectionChange).toHaveBeenCalledWith(["2"]);
});

const filterColumns: DataTableColumn<User>[] = [
  { id: "name", header: "Name", cell: (row) => row.name },
  {
    id: "role",
    header: "Role",
    cell: (row) => row.role,
    filters: [
      { label: "Engineer", value: "Engineer" },
      { label: "Researcher", value: "Researcher" },
    ],
  },
];

test("it should call onFiltersChange when a column filter is applied", () => {
  const onFiltersChange = vi.fn();

  render(
    <DataTable
      rows={rows}
      filters={{}}
      columns={filterColumns}
      onFiltersChange={onFiltersChange}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Filter column" }));
  fireEvent.click(screen.getByRole("checkbox", { name: "Engineer" }));
  fireEvent.click(screen.getByRole("button", { name: "OK" }));

  expect(onFiltersChange).toHaveBeenCalledWith({ role: ["Engineer"] });
});

test("it should hide non-matching rows when a client filter is set", () => {
  render(
    <DataTable
      rows={rows}
      columns={filterColumns}
      filters={{ role: ["Engineer"] }}
    />,
  );

  expect(screen.getByText("Ada Lovelace")).toBeTruthy();
  expect(screen.queryByText("Alan Turing")).toBeNull();
});

test("it should keep server-paged rows unfiltered locally", () => {
  render(
    <DataTable
      page={1}
      rows={rows}
      pageCount={2}
      columns={filterColumns}
      filters={{ role: ["Engineer"] }}
    />,
  );

  expect(screen.getByText("Ada Lovelace")).toBeTruthy();
  expect(screen.getByText("Alan Turing")).toBeTruthy();
});

function FilterResetHarness() {
  const [filters, setFilters] = useState<DataTableFilters>({
    role: ["Engineer"],
  });

  return (
    <DataTable
      rows={rows}
      filters={filters}
      columns={filterColumns}
      onFiltersChange={setFilters}
    />
  );
}

test("it should clear a column filter after Reset and OK", () => {
  render(<FilterResetHarness />);

  expect(screen.queryByText("Alan Turing")).toBeNull();

  fireEvent.click(screen.getByRole("button", { name: "Filter column" }));
  fireEvent.click(screen.getByRole("button", { name: "Reset" }));
  fireEvent.click(screen.getByRole("button", { name: "OK" }));

  expect(screen.getByText("Alan Turing")).toBeTruthy();
});

test("it should pin a sticky start column", () => {
  render(
    <DataTable
      rows={rows}
      columns={[
        {
          id: "name",
          width: 120,
          header: "Name",
          sticky: "start",
          cell: (row) => row.name,
        },
        { id: "role", header: "Role", cell: (row) => row.role },
      ]}
    />,
  );

  expect(screen.getByRole("columnheader", { name: "Name" }).style.left).toBe(
    "0px",
  );
});

test("it should truncate ellipsis cells", () => {
  render(
    <DataTable
      rows={rows}
      columns={[
        {
          id: "name",
          header: "Name",
          ellipsis: true,
          cell: (row) => row.name,
        },
      ]}
    />,
  );

  expect(screen.getByText("Ada Lovelace").className).toContain("text-ellipsis");
});

test("it should hide columns listed in hiddenColumns", () => {
  render(<DataTable rows={rows} columns={columns} hiddenColumns={["role"]} />);

  expect(screen.getByText("Name")).toBeTruthy();
  expect(screen.queryByText("Role")).toBeNull();
  expect(screen.queryByText("Engineer")).toBeNull();
});

test("it should toggle a column from the columns menu", () => {
  const onHiddenColumnsChange = vi.fn();

  render(
    <DataTable
      rows={rows}
      columns={columns}
      hiddenColumns={[]}
      onHiddenColumnsChange={onHiddenColumnsChange}
    />,
  );

  fireEvent.click(screen.getAllByRole("button", { name: "Columns" })[0]!);
  fireEvent.click(screen.getByRole("checkbox", { name: "Role" }));

  expect(onHiddenColumnsChange).toHaveBeenCalledWith(["role"]);
});

test("it should expand a row from the expand control", () => {
  const onExpandedChange = vi.fn();

  render(
    <DataTable
      rows={rows}
      expanded={[]}
      columns={columns}
      getRowId={(row) => row.id}
      onExpandedChange={onExpandedChange}
      slots={{
        expanded: (row) => `Detail ${row.name}`,
      }}
    />,
  );

  fireEvent.click(screen.getAllByRole("button", { name: "Expand row" })[0]!);

  expect(onExpandedChange).toHaveBeenCalledWith(["1"]);
});

test("it should render expanded slot content", () => {
  render(
    <DataTable
      rows={rows}
      expanded={["1"]}
      columns={columns}
      getRowId={(row) => row.id}
      slots={{
        expanded: (row) => `Detail ${row.name}`,
      }}
    />,
  );

  expect(screen.getByText("Detail Ada Lovelace")).toBeTruthy();
});

test("it should render a summary footer", () => {
  render(
    <DataTable
      rows={rows}
      columns={[
        { id: "name", header: "Name", cell: (row) => row.name },
        {
          id: "role",
          header: "Role",
          cell: (row) => row.role,
          summary: (items) => `${items.length} roles`,
        },
      ]}
    />,
  );

  expect(screen.getByText("2 roles")).toBeTruthy();
});

test("it should render accessor text when cell is omitted", () => {
  render(<DataTable rows={rows} columns={[{ id: "name", header: "Name" }]} />);

  expect(screen.getByText("Ada Lovelace")).toBeTruthy();
});

test("it should let an item slot override the column cell", () => {
  render(
    <DataTable
      rows={rows}
      slots={{
        item: {
          name: ({ row }) => `Slot ${row.name}`,
        },
      }}
      columns={[
        {
          id: "name",
          header: "Name",
          cell: (row) => `Cell ${row.name}`,
        },
      ]}
    />,
  );

  expect(screen.getByText("Slot Ada Lovelace")).toBeTruthy();
  expect(screen.queryByText("Cell Ada Lovelace")).toBeNull();
});
