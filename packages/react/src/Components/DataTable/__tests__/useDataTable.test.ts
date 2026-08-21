// ** External Imports
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import type { DataTableColumn } from "@/Components/DataTable/dataTable.types";
import { useDataTable } from "@/Components/DataTable/hooks/useDataTable";

const libDefaults = {
  size: "md",
  full: true,
  rounded: "lg",
  loading: false,
  striped: false,
  variant: "plain",
  hoverable: false,
  stickyHeader: false,
  paginationAlign: "end",
  loadingVariant: "overlay",
  selectionMode: "multiple",
} as const;

type User = { id: string; name: string };

const columns: DataTableColumn<User>[] = [
  { id: "name", header: "Name", cell: (row) => row.name },
];

afterEach(() => {
  cleanup();
});

test("it should keep row views stable when rerendered with the same data", () => {
  const props = { columns, rows: [{ id: "1", name: "Ada" }] };
  const { result, rerender } = renderHook(
    (next: typeof props) => {
      return useDataTable(next, libDefaults);
    },
    { initialProps: props },
  );

  const firstRows = result.current.rowViews;
  const firstBind = result.current.getCellBind;
  const firstHeaders = result.current.headerViews;

  rerender(props);

  expect(result.current.rowViews).toBe(firstRows);
  expect(result.current.getCellBind).toBe(firstBind);
  expect(result.current.headerViews).toBe(firstHeaders);
});

test("it should expose table defaults from useDataTable", () => {
  const { result } = renderHook(() =>
    useDataTable({ columns, rows: [{ id: "1", name: "Ada" }] }, libDefaults),
  );

  expect(result.current.showEmpty).toBe(false);
  expect(result.current.rowViews).toHaveLength(1);
  expect(result.current.showPagination).toBe(false);
  expect(result.current.merged.variant).toBe("plain");
  expect(result.current.paginationVariant).toBe("text");
  expect(result.current.headerViews[0]?.id).toBe("name");
  expect(result.current.merged.selectionMode).toBe("multiple");
});

test("it should enable selection views when selection is controlled", () => {
  const { result } = renderHook(() =>
    useDataTable(
      {
        columns,
        selection: ["1"],
        rows: [{ id: "1", name: "Ada" }],
      },
      libDefaults,
    ),
  );

  expect(result.current.selectionEnabled).toBe(true);
  expect(result.current.selectAllState.checked).toBe(true);
  expect(result.current.headerViews[0]?.isSelection).toBe(true);
});

test("it should map bordered chrome to outlined pagination", () => {
  const { result } = renderHook(() =>
    useDataTable(
      {
        columns,
        page: 1,
        pageCount: 3,
        variant: "bordered",
        rows: [{ id: "1", name: "Ada" }],
      },
      libDefaults,
    ),
  );

  expect(result.current.serverPaged).toBe(true);
  expect(result.current.showPagination).toBe(true);
  expect(result.current.paginationVariant).toBe("outlined");
});

test("it should slice rows when page and perPage are set without totals", () => {
  const { result } = renderHook(() =>
    useDataTable(
      {
        page: 2,
        columns,
        perPage: 1,
        rows: [
          { id: "1", name: "Ada" },
          { id: "2", name: "Alan" },
        ],
      },
      libDefaults,
    ),
  );

  expect(result.current.clientPaged).toBe(true);
  expect(result.current.rowViews).toHaveLength(1);
  expect(result.current.rowViews[0]?.original.name).toBe("Alan");
  expect(result.current.resolvedPageCount).toBe(2);
});

test("it should derive page count from totalCount and perPage", () => {
  const { result } = renderHook(() =>
    useDataTable(
      {
        page: 1,
        columns,
        perPage: 10,
        totalCount: 23,
        rows: [{ id: "1", name: "Ada" }],
      },
      libDefaults,
    ),
  );

  expect(result.current.serverPaged).toBe(true);
  expect(result.current.showPerPage).toBe(true);
  expect(result.current.resolvedPageCount).toBe(3);
});

test("it should expose sticky expand visibility and summary views", () => {
  const { result } = renderHook(() =>
    useDataTable(
      {
        expanded: [],
        hiddenColumns: ["role"],
        rows: [{ id: "1", name: "Ada" }],
        slots: {
          expanded: (row) => row.name,
        },
        columns: [
          {
            id: "name",
            width: 120,
            header: "Name",
            sticky: "start",
            cell: (row) => row.name,
            summary: (items) => String(items.length),
          },
          { id: "role", header: "Role", cell: (row) => row.name },
        ],
      },
      libDefaults,
    ),
  );

  expect(result.current.visibilityEnabled).toBe(true);
  expect(result.current.headerViews[1]?.sticky).toBe("start");
  expect(result.current.summaryCells?.[1]?.content).toBe("1");
  expect(result.current.headerViews[1]?.stickyStyle?.left).toBe(48);
  expect(result.current.headerViews.some((header) => header.isExpand)).toBe(
    true,
  );
  expect(
    result.current.headerViews.some((header) => header.id === "role"),
  ).toBe(false);
});

type Person = { id: string; name: string; role: string };

const people: Person[] = [
  { id: "1", name: "Ada", role: "Engineer" },
  { id: "2", name: "Alan", role: "Researcher" },
];

const peopleColumns: DataTableColumn<Person>[] = [
  { id: "name", header: "Name", sortable: true, cell: (row) => row.name },
  {
    id: "role",
    header: "Role",
    sortable: true,
    cell: (row) => row.role,
    filters: [
      { label: "Engineer", value: "Engineer" },
      { label: "Researcher", value: "Researcher" },
    ],
  },
];

test("it should sort row views from the sorting binding", () => {
  const { result } = renderHook(() =>
    useDataTable(
      {
        rows: people,
        columns: peopleColumns,
        sorting: { id: "name", desc: true },
      },
      libDefaults,
    ),
  );

  expect(result.current.rowViews).toHaveLength(2);
  expect(result.current.rowViews[0]?.original.name).toBe("Alan");
  expect(result.current.rowViews[1]?.original.name).toBe("Ada");
});

test("it should emit onSortingChange from onToggleSort", () => {
  const onSortingChange = vi.fn();
  const { result } = renderHook(() =>
    useDataTable(
      {
        rows: people,
        onSortingChange,
        columns: peopleColumns,
      },
      libDefaults,
    ),
  );

  act(() => {
    result.current.onToggleSort("name");
  });

  expect(onSortingChange).toHaveBeenCalledWith({ id: "name", desc: false });
});

test("it should filter row views from the filters binding", () => {
  const { result } = renderHook(() =>
    useDataTable(
      {
        rows: people,
        columns: peopleColumns,
        filters: { role: ["Engineer"] },
      },
      libDefaults,
    ),
  );

  expect(result.current.rowViews).toHaveLength(1);
  expect(result.current.rowViews[0]?.original.name).toBe("Ada");
});

test("it should emit onFiltersChange from onCommitColumnFilter", () => {
  const onFiltersChange = vi.fn();
  const { result } = renderHook(() =>
    useDataTable(
      {
        filters: {},
        rows: people,
        onFiltersChange,
        columns: peopleColumns,
      },
      libDefaults,
    ),
  );

  act(() => {
    result.current.onCommitColumnFilter("role", ["Engineer"], "");
  });

  expect(onFiltersChange).toHaveBeenCalledWith({ role: ["Engineer"] });
});

test("it should filter row views from the search binding", () => {
  const { result } = renderHook(() =>
    useDataTable(
      {
        rows: people,
        search: "Alan",
        columns: peopleColumns,
        onSearchChange: vi.fn(),
      },
      libDefaults,
    ),
  );

  expect(result.current.showSearch).toBe(true);
  expect(result.current.rowViews).toHaveLength(1);
  expect(result.current.rowViews[0]?.original.name).toBe("Alan");
});

test("it should emit search and reset page from onChangeSearch", () => {
  const onPageChange = vi.fn();
  const onSearchChange = vi.fn();
  const { result } = renderHook(() =>
    useDataTable(
      {
        page: 2,
        search: "",
        rows: people,
        onPageChange,
        onSearchChange,
        columns: peopleColumns,
      },
      libDefaults,
    ),
  );

  act(() => {
    result.current.onChangeSearch("Ada");
  });

  expect(onPageChange).toHaveBeenCalledWith(1);
  expect(onSearchChange).toHaveBeenCalledWith("Ada");
});

test("it should emit perPage and reset page from onChangePerPage", () => {
  const onPageChange = vi.fn();
  const onPerPageChange = vi.fn();
  const { result } = renderHook(() =>
    useDataTable(
      {
        page: 2,
        perPage: 10,
        rows: people,
        pageCount: 3,
        onPageChange,
        onPerPageChange,
        columns: peopleColumns,
      },
      libDefaults,
    ),
  );

  act(() => {
    result.current.onChangePerPage(25);
  });

  expect(result.current.showPerPage).toBe(true);
  expect(onPageChange).toHaveBeenCalledWith(1);
  expect(onPerPageChange).toHaveBeenCalledWith(25);
});

test("it should emit onPageChange from paginationSlotProps", () => {
  const onPageChange = vi.fn();
  const { result } = renderHook(() =>
    useDataTable(
      {
        page: 1,
        rows: people,
        pageCount: 4,
        onPageChange,
        columns: peopleColumns,
      },
      libDefaults,
    ),
  );

  act(() => {
    result.current.paginationSlotProps.onPageChange(3);
  });

  expect(result.current.paginationSlotProps.page).toBe(1);
  expect(onPageChange).toHaveBeenCalledWith(3);
});

test("it should hide columns from the hiddenColumns binding", () => {
  const { result } = renderHook(() =>
    useDataTable(
      {
        rows: people,
        columns: peopleColumns,
        hiddenColumns: ["role"],
      },
      libDefaults,
    ),
  );

  expect(result.current.visibilityEnabled).toBe(true);
  expect(result.current.visibilityItems[1]?.hidden).toBe(true);
  expect(
    result.current.headerViews.some((header) => header.id === "role"),
  ).toBe(false);
});

test("it should emit onHiddenColumnsChange from onToggleColumnVisibility", () => {
  const onHiddenColumnsChange = vi.fn();
  const { result } = renderHook(() =>
    useDataTable(
      {
        rows: people,
        hiddenColumns: [],
        onHiddenColumnsChange,
        columns: peopleColumns,
      },
      libDefaults,
    ),
  );

  act(() => {
    result.current.onToggleColumnVisibility("role", true);
  });

  expect(onHiddenColumnsChange).toHaveBeenCalledWith(["role"]);
});
