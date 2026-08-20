// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import type { DataTableColumn } from "@/Components/DataTable/dataTable.types";
import { useDataTable } from "@/Components/DataTable/hooks/useDataTable";

const libDefaults = {
  size: "md",
  full: true,
  loading: false,
  striped: false,
  variant: "plain",
  hoverable: false,
  stickyHeader: false,
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
  expect(result.current.paginationVariant).toBe("text");
  expect(result.current.headerViews[0]?.id).toBe("name");
  expect(result.current.tableProps.variant).toBe("plain");
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
