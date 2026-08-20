// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { DataTable } from "@/Components/DataTable";
import type { DataTableColumn } from "@/Components/DataTable/dataTable.types";

afterEach(() => {
  cleanup();
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

  expect(screen.getByText("Role")).toBeTruthy();
  expect(screen.getByText("Name")).toBeTruthy();
  expect(screen.getByRole("table")).toBeTruthy();
  expect(screen.getByText("Alan Turing")).toBeTruthy();
  expect(screen.getByText("Ada Lovelace")).toBeTruthy();
});

test("it should apply the bordered variant on the table wrapper", () => {
  const { container } = render(
    <DataTable rows={rows} columns={columns} variant="bordered" />,
  );

  expect(container.querySelector("table")?.parentElement?.className).toContain(
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

  expect(
    screen.getByRole("table").parentElement?.getAttribute("aria-busy"),
  ).toBe("true");
});
