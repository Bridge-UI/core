// ** External Imports
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
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
  vi.useRealTimers();
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

test("it should merge column classes onto header and cells", () => {
  render(
    <DataTable
      rows={rows}
      columns={[
        {
          id: "name",
          header: "Name",
          cell: (row) => row.name,
          classes: {
            cell: "col-cell",
            header: "col-header",
          },
        },
        { id: "role", header: "Role", cell: (row) => row.role },
      ]}
    />,
  );

  expect(
    screen.getByRole("columnheader", { name: "Name" }).className,
  ).toContain("col-header");
  expect(
    screen.getByRole("cell", { name: "Ada Lovelace" }).className,
  ).toContain("col-cell");
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

  fireEvent.click(screen.getByRole("columnheader", { name: /Role/ }));

  expect(onSortingChange).toHaveBeenCalledWith({ id: "role", desc: false });
  expect(
    screen.getByRole("columnheader", { name: /Role/ }).className,
  ).toContain("cursor-pointer");
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

test("it should show the sort tooltip when hovering the header cell", async () => {
  vi.useFakeTimers();

  render(<DataTable rows={rows} columns={columns} />);

  const header = screen.getByRole("columnheader", { name: /Role/ });
  const trigger = header.querySelector(".absolute.inset-0.size-full");

  expect(header.className).toContain("relative");
  expect(trigger).toBeTruthy();

  fireEvent.pointerEnter(trigger!);

  await act(async () => {
    vi.advanceTimersByTime(200);
  });

  expect(screen.getByRole("tooltip").textContent).toContain(
    "Click to sort ascending",
  );
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

test("it should slice rows locally when page and perPage are set", () => {
  render(
    <DataTable
      page={2}
      perPage={1}
      columns={columns}
      rows={[
        { id: "1", role: "Engineer", name: "Ada Lovelace" },
        { id: "2", role: "Researcher", name: "Alan Turing" },
      ]}
    />,
  );

  expect(screen.getByText("Alan Turing")).toBeTruthy();
  expect(screen.queryByText("Ada Lovelace")).toBeNull();
});

test("it should paginate from totalCount when pageCount is omitted", () => {
  const onPageChange = vi.fn();

  render(
    <DataTable
      page={1}
      rows={rows}
      perPage={10}
      totalCount={20}
      columns={columns}
      onPageChange={onPageChange}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Page 2" }));

  expect(onPageChange).toHaveBeenCalledWith(2);
  expect(screen.getByRole("combobox")).toBeTruthy();
});

test("it should show the per-page Select when onPerPageChange is set", () => {
  render(
    <DataTable
      page={1}
      rows={rows}
      pageCount={2}
      columns={columns}
      onPerPageChange={vi.fn()}
    />,
  );

  expect(screen.getByRole("combobox")).toBeTruthy();
});

test("it should render a custom perPage slot beside pagination", () => {
  render(
    <DataTable
      page={1}
      rows={rows}
      perPage={10}
      pageCount={2}
      columns={columns}
      slots={{ perPage: "Page size" }}
    />,
  );

  expect(screen.getByText("Page size")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Page 2" })).toBeTruthy();
  expect(screen.queryByRole("combobox")).toBeNull();
});

test("it should show the empty slot when there are no rows", () => {
  render(
    <DataTable rows={[]} columns={columns} slots={{ empty: "No users" }} />,
  );

  expect(screen.getByText("No users")).toBeTruthy();
});

test("it should render a default empty state", () => {
  render(<DataTable rows={[]} columns={columns} />);

  expect(screen.getByText("No data")).toBeTruthy();
});

test("it should render the footer slot below the table", () => {
  render(
    <DataTable
      rows={rows}
      columns={columns}
      slots={{ footer: "Here is footer" }}
    />,
  );

  expect(screen.getByText("Here is footer")).toBeTruthy();
});

test("it should mark the table busy and show a spin when loading", () => {
  render(<DataTable loading rows={rows} columns={columns} />);

  expect(screen.getByText("Ada Lovelace")).toBeTruthy();
  expect(screen.getByRole("status", { name: "Loading" })).toBeTruthy();
  expect(screen.getByRole("table").getAttribute("aria-busy")).toBe("true");
});

test("it should show a progress bar under the header when loadingVariant is bar", () => {
  render(
    <DataTable loading rows={rows} columns={columns} loadingVariant="bar" />,
  );

  expect(screen.getByRole("progressbar")).toBeTruthy();
  expect(document.querySelector(".bg-white\\/50")).toBeTruthy();
  expect(screen.queryByRole("status", { name: "Loading" })).toBeNull();
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

  const radios = screen.getAllByRole("radio", { name: "Select row" });

  expect((radios[0] as HTMLInputElement).checked).toBe(true);
  expect((radios[1] as HTMLInputElement).checked).toBe(false);

  fireEvent.click(radios[1]!);

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

test("it should open column filters in a modal when filterOverlay is modal", () => {
  render(
    <DataTable
      rows={rows}
      filters={{}}
      filterOverlay="modal"
      columns={filterColumns}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Filter column" }));

  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  expect(screen.getByRole("checkbox", { name: "Engineer" })).toBeTruthy();
  expect(document.body.querySelector('[role="dialog"] .w-5')).not.toBeNull();
});

test("it should use radios for a single-select column filter", () => {
  render(
    <DataTable
      rows={rows}
      filters={{}}
      columns={[
        { id: "name", header: "Name", cell: (row) => row.name },
        {
          id: "role",
          header: "Role",
          filterMultiple: false,
          cell: (row) => row.role,
          filters: [
            { label: "Engineer", value: "Engineer" },
            { label: "Researcher", value: "Researcher" },
          ],
        },
      ]}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Filter column" }));

  expect(screen.getByRole("radio", { name: "Engineer" })).toBeTruthy();
  expect(screen.getByRole("menuitemradio", { name: "Engineer" })).toBeTruthy();
  expect(
    screen.queryByRole("menuitemcheckbox", { name: "Engineer" }),
  ).toBeNull();
});

test("it should call onColumnSearchChange when a column search is applied", () => {
  const onColumnSearchChange = vi.fn();

  render(
    <DataTable
      rows={rows}
      columnSearch={{}}
      onColumnSearchChange={onColumnSearchChange}
      columns={[
        {
          id: "name",
          header: "Name",
          searchable: true,
          cell: (row) => row.name,
        },
        { id: "role", header: "Role", cell: (row) => row.role },
      ]}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Filter column" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Search" }), {
    target: { value: "Ada" },
  });
  fireEvent.click(screen.getByRole("button", { name: "OK" }));

  expect(onColumnSearchChange).toHaveBeenCalledWith({ name: "Ada" });
});

test("it should hide non-matching rows when a client column search is set", () => {
  render(
    <DataTable
      rows={rows}
      columnSearch={{ name: "Ada" }}
      columns={[
        {
          id: "name",
          header: "Name",
          searchable: true,
          cell: (row) => row.name,
        },
        { id: "role", header: "Role", cell: (row) => row.role },
      ]}
    />,
  );

  expect(screen.getByText("Ada Lovelace")).toBeTruthy();
  expect(screen.queryByText("Alan Turing")).toBeNull();
});

test("it should ignore column search on hidden columns", () => {
  render(
    <DataTable
      rows={rows}
      hiddenColumns={["name"]}
      columnSearch={{ name: "Ada" }}
      columns={[
        {
          id: "name",
          header: "Name",
          searchable: true,
          cell: (row) => row.name,
        },
        { id: "role", header: "Role", cell: (row) => row.role },
      ]}
    />,
  );

  expect(screen.getByText("Engineer")).toBeTruthy();
  expect(screen.getByText("Researcher")).toBeTruthy();
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
  expect(
    screen.getByRole("columnheader", { name: "Name" }).style.maxWidth,
  ).toBe("120px");
  expect(
    screen.getByRole("columnheader", { name: "Name" }).className,
  ).not.toContain("before:translate-x-full");
  expect(screen.getByRole("table").className).toContain("border-separate");
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

test("it should show the ellipsis tooltip on the first pointer enter", () => {
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

  fireEvent.pointerEnter(screen.getByText("Ada Lovelace").parentElement!);

  expect(screen.getByRole("tooltip").textContent).toContain("Ada Lovelace");
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
      columnsOverlay="menu"
      onHiddenColumnsChange={onHiddenColumnsChange}
    />,
  );

  fireEvent.click(screen.getAllByRole("button", { name: "Columns" })[0]!);
  fireEvent.click(screen.getByRole("checkbox", { name: "Role" }));

  expect(screen.queryByRole("button", { name: "OK" })).toBeNull();
  expect(onHiddenColumnsChange).toHaveBeenCalledWith(["role"]);
});

test("it should commit column visibility from the columns menu footer", () => {
  const onHiddenColumnsChange = vi.fn();

  render(
    <DataTable
      rows={rows}
      columns={columns}
      hiddenColumns={[]}
      columnsOverlay="modal"
      onHiddenColumnsChange={onHiddenColumnsChange}
    />,
  );

  fireEvent.click(screen.getAllByRole("button", { name: "Columns" })[0]!);
  fireEvent.click(screen.getByRole("checkbox", { name: "Role" }));

  expect(onHiddenColumnsChange).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole("button", { name: "OK" }));

  expect(onHiddenColumnsChange).toHaveBeenCalledWith(["role"]);
});

test("it should reset hideable columns from the columns menu footer", () => {
  const onHiddenColumnsChange = vi.fn();

  render(
    <DataTable
      rows={rows}
      columns={columns}
      columnsOverlay="modal"
      hiddenColumns={["role"]}
      onHiddenColumnsChange={onHiddenColumnsChange}
    />,
  );

  fireEvent.click(screen.getAllByRole("button", { name: "Columns" })[0]!);
  fireEvent.click(screen.getByRole("button", { name: "Reset" }));

  expect(onHiddenColumnsChange).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole("button", { name: "OK" }));

  expect(onHiddenColumnsChange).toHaveBeenCalledWith([]);
});

test("it should toggle columns live when columnsShowFooter is false", () => {
  const onHiddenColumnsChange = vi.fn();

  render(
    <DataTable
      rows={rows}
      columns={columns}
      hiddenColumns={[]}
      columnsOverlay="modal"
      columnsShowFooter={false}
      onHiddenColumnsChange={onHiddenColumnsChange}
    />,
  );

  fireEvent.click(screen.getAllByRole("button", { name: "Columns" })[0]!);
  fireEvent.click(screen.getByRole("checkbox", { name: "Role" }));

  expect(screen.queryByRole("button", { name: "OK" })).toBeNull();
  expect(onHiddenColumnsChange).toHaveBeenCalledWith(["role"]);
});

test("it should open column visibility in a modal when columnsOverlay is modal", () => {
  render(
    <DataTable
      rows={rows}
      columns={columns}
      hiddenColumns={[]}
      columnsOverlay="modal"
    />,
  );

  fireEvent.click(screen.getAllByRole("button", { name: "Columns" })[0]!);

  expect(screen.getByRole("checkbox", { name: "Role" })).toBeTruthy();
  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  expect(document.body.querySelector('[role="dialog"] .w-5')).not.toBeNull();
});

test("it should render toolbarActions beside search", () => {
  render(
    <DataTable
      search=""
      rows={rows}
      columns={columns}
      onSearchChange={vi.fn()}
      slots={{
        toolbarActions: <button type="button">Print</button>,
      }}
    />,
  );

  expect(screen.getByRole("button", { name: "Print" })).toBeTruthy();
  expect(screen.getByRole("textbox", { name: "Search" })).toBeTruthy();
});

test("it should keep table rows when a sibling setState rerenders the parent", () => {
  function Page() {
    const [label, setLabel] = useState("Print");

    return (
      <div>
        <button type="button" onClick={() => setLabel("Printed")}>
          {label}
        </button>
        <DataTable rows={rows} columns={columns} />
      </div>
    );
  }

  render(<Page />);
  fireEvent.click(screen.getByRole("button", { name: "Print" }));

  expect(screen.getByText("Ada Lovelace")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Printed" })).toBeTruthy();
});

test("it should filter rows from the toolbar search", () => {
  render(
    <DataTable
      rows={rows}
      search="Ada"
      columns={columns}
      onSearchChange={vi.fn()}
    />,
  );

  expect(screen.getByText("Ada Lovelace")).toBeTruthy();
  expect(screen.queryByText("Alan Turing")).toBeNull();
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

test("it should omit the expand cell border when collapsed", () => {
  const { container } = render(
    <DataTable
      rows={rows}
      expanded={[]}
      columns={columns}
      getRowId={(row) => row.id}
      slots={{
        expanded: (row) => `Detail ${row.name}`,
      }}
    />,
  );

  expect(container.querySelector("td[colspan]")?.className).toContain(
    "border-0",
  );
});

test("it should keep the expand cell border when open", () => {
  const { container } = render(
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

  expect(container.querySelector("td[colspan]")?.className).not.toContain(
    "border-0",
  );
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

test("it should not stretch the table when full is false", () => {
  render(<DataTable rows={rows} full={false} columns={columns} />);

  expect(screen.getByRole("table").className).not.toContain("min-w-full");
});

test("it should stick header cells when stickyHeader is set", () => {
  render(<DataTable rows={rows} stickyHeader columns={columns} />);

  expect(screen.getAllByRole("columnheader")[0]?.className).toContain("sticky");
  expect(screen.getAllByRole("columnheader")[0]?.className).toContain(
    "bg-dark-100",
  );
  expect(screen.getAllByRole("columnheader")[0]?.className).not.toContain(
    "overflow-hidden",
  );
  expect(screen.getAllByRole("columnheader")[0]?.style.top).toBe("0px");
  expect(screen.getByRole("table").className).toContain("border-separate");
  expect(screen.getByRole("table").parentElement?.className).not.toContain(
    "overflow-x-auto",
  );
});

test("it should box sticky header overflow on the table wrapper", () => {
  render(
    <DataTable
      rows={rows}
      columns={columns}
      stickyHeader="boxed"
      classes={{ wrapper: "max-h-96" }}
    />,
  );

  expect(screen.getAllByRole("columnheader")[0]?.className).toContain("sticky");
  expect(screen.getByRole("table").parentElement?.className).toContain(
    "overflow-auto",
  );
  expect(screen.getByRole("table").parentElement?.className).toContain(
    "max-h-96",
  );
});

test("it should box sticky header overflow from classes.root", () => {
  render(
    <DataTable
      rows={rows}
      columns={columns}
      stickyHeader="boxed"
      classes={{ root: "max-h-96" }}
    />,
  );

  expect(screen.getAllByRole("columnheader")[0]?.className).toContain("sticky");
  expect(screen.getByRole("table").parentElement?.className).toContain(
    "overflow-auto",
  );
  expect(screen.getByRole("table").parentElement?.className).toContain(
    "max-h-96",
  );
});

test("it should pin built-in pagination to the end", () => {
  const { container } = render(
    <DataTable page={1} rows={rows} pageCount={2} columns={columns} />,
  );

  expect(container.querySelector(".sm\\:justify-end")).toBeTruthy();
  expect(container.querySelector(".sm\\:justify-between")).toBeNull();
});

test("it should spread per-page and pagination across the footer", () => {
  const { container } = render(
    <DataTable
      page={1}
      rows={rows}
      perPage={10}
      pageCount={2}
      columns={columns}
    />,
  );

  expect(container.querySelector(".sm\\:justify-between")).toBeTruthy();
});

test("it should sort rows when sorting is controlled", () => {
  render(
    <DataTable
      rows={rows}
      columns={columns}
      sorting={{ id: "role", desc: true }}
    />,
  );

  const bodyRows = screen.getAllByRole("row").slice(1);

  expect(bodyRows[0]?.textContent).toContain("Alan Turing");
  expect(bodyRows[1]?.textContent).toContain("Ada Lovelace");
});

test("it should call onSearchChange from the toolbar search", () => {
  const onSearchChange = vi.fn();

  render(
    <DataTable
      search=""
      rows={rows}
      columns={columns}
      onSearchChange={onSearchChange}
    />,
  );

  fireEvent.change(screen.getByRole("textbox", { name: "Search" }), {
    target: { value: "Ada" },
  });

  expect(onSearchChange).toHaveBeenCalledWith("Ada");
});

test("it should call onPerPageChange from the built-in Select", async () => {
  const onPageChange = vi.fn();
  const onPerPageChange = vi.fn();

  render(
    <DataTable
      page={2}
      rows={rows}
      perPage={10}
      pageCount={3}
      columns={columns}
      onPageChange={onPageChange}
      onPerPageChange={onPerPageChange}
    />,
  );

  fireEvent.click(screen.getByRole("combobox").closest(".group\\/field")!);

  await waitFor(() => {
    expect(screen.getByRole("option", { name: "25" })).toBeTruthy();
  });

  fireEvent.click(screen.getByRole("option", { name: "25" }));

  expect(onPageChange).toHaveBeenCalledWith(1);
  expect(onPerPageChange).toHaveBeenCalledWith(25);
});

test("it should mark the controlled page as current", () => {
  render(<DataTable page={2} rows={rows} pageCount={3} columns={columns} />);

  expect(
    screen.getByRole("button", { name: "Page 2" }).getAttribute("aria-current"),
  ).toBe("page");
});
