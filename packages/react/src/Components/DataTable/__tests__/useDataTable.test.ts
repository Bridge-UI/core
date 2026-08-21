// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

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
