// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  DATATABLE_EXPAND_COLUMN_ID,
  DATATABLE_SELECTION_COLUMN_ID,
} from "@/Domain/dataTable";
import {
  getDataTableBodyInsets,
  getDataTableColumnLayoutStyle,
  getDataTableViewAlign,
  resolveDataTableHeaderViews,
  resolveDataTableRowCells,
  resolveDataTableSummaryCells,
  resolveDataTableVisibilityItems,
  type DataTableViewColumn,
} from "@/Domain/dataTableView";

type Row = { id: string; name: string; total: number };

const columns: DataTableViewColumn<Row, string>[] = [
  { id: "name", header: "Name", sortable: true, ellipsis: true },
  {
    id: "total",
    align: "end",
    header: "Total",
    filters: [{ label: "Big", value: "big" }],
    summary: (data) => String(data.reduce((sum, row) => sum + row.total, 0)),
  },
];

const columnsById = Object.fromEntries(
  columns.map((column) => [column.id, column]),
);

const rows: Row[] = [
  { id: "1", total: 10, name: "Ana" },
  { id: "2", name: "", total: 5 },
];

describe("resolveDataTableHeaderViews", () => {
  test("it should resolve sort, filter and search state", () => {
    const [name, total] = resolveDataTableHeaderViews({
      columnsById,
      stickyHeader: false,
      filters: { total: ["big"] },
      columnIds: ["name", "total"],
      sorting: { id: "name", desc: true },
    });

    expect(name).toMatchObject({
      header: "Name",
      sortable: true,
      filterActive: false,
      ariaSort: "descending",
      sortIcon: "chevronDown",
    });
    expect(total).toMatchObject({
      align: "end",
      ariaSort: "none",
      filterable: true,
      filterActive: true,
      filterValues: ["big"],
    });
  });

  test("it should flag chrome columns", () => {
    const [selection, expand] = resolveDataTableHeaderViews({
      columnsById,
      stickyHeader: false,
      columnIds: [DATATABLE_SELECTION_COLUMN_ID, DATATABLE_EXPAND_COLUMN_ID],
    });

    expect(selection.isSelection).toBe(true);
    expect(expand.isExpand).toBe(true);
    expect(selection.header).toBeUndefined();
  });
});

describe("resolveDataTableRowCells", () => {
  const headers = resolveDataTableHeaderViews({
    columnsById,
    stickyHeader: false,
    columnIds: ["name", "total"],
  });
  const insets = getDataTableBodyInsets(headers);

  test("it should render accessor text and ellipsis tooltips", () => {
    const [name, total] = resolveDataTableRowCells({
      insets,
      columnsById,
      row: rows[0],
      columnIds: ["name", "total"],
    });

    expect(name).toMatchObject({ content: "Ana", tooltip: "Ana" });
    expect(total).toMatchObject({ content: "10", tooltip: undefined });
  });

  test("it should skip tooltips and content for empty values", () => {
    const [name] = resolveDataTableRowCells({
      insets,
      columnsById,
      row: rows[1],
      columnIds: ["name"],
    });

    expect(name).toMatchObject({ content: null, tooltip: undefined });
  });

  test("it should prefer the column cell renderer", () => {
    const [cell] = resolveDataTableRowCells({
      insets,
      row: rows[0],
      columnIds: ["name"],
      columnsById: {
        name: { id: "name", header: "Name", cell: (row) => `<${row.name}>` },
      },
    });

    expect(cell.content).toBe("<Ana>");
  });
});

describe("resolveDataTableSummaryCells", () => {
  test("it should return null without summaries", () => {
    expect(
      resolveDataTableSummaryCells({
        data: rows,
        headers: [],
        columns: [{ id: "name", header: "Name" }],
      }),
    ).toBeNull();
  });

  test("it should render summaries and keep chrome cells empty", () => {
    const headers = resolveDataTableHeaderViews({
      columnsById,
      stickyHeader: false,
      columnIds: [DATATABLE_SELECTION_COLUMN_ID, "name", "total"],
    });

    expect(
      resolveDataTableSummaryCells({ columns, headers, data: rows })?.map(
        (cell) => cell.content,
      ),
    ).toEqual([null, null, "15"]);
  });
});

describe("resolveDataTableVisibilityItems", () => {
  test("it should label items and mark hidden columns", () => {
    expect(
      resolveDataTableVisibilityItems(
        [
          { id: "name", header: "Name" },
          { id: "total", hideable: false, header: { node: true } },
        ],
        ["name"],
      ),
    ).toEqual([
      { id: "name", hidden: true, label: "Name", hideable: true },
      { id: "total", hidden: false, label: "total", hideable: false },
    ]);
  });
});

describe("getDataTableViewAlign", () => {
  test("it should center chrome columns", () => {
    expect(
      getDataTableViewAlign({
        align: "end",
        isExpand: true,
        isSelection: false,
      }),
    ).toBe("center");
    expect(getDataTableViewAlign({ isExpand: false, isSelection: false })).toBe(
      "start",
    );
  });
});

describe("getDataTableColumnLayoutStyle", () => {
  const view = { width: 120, isExpand: false, isSelection: false };

  test("it should apply the column width", () => {
    expect(getDataTableColumnLayoutStyle(view, false)).toEqual({
      width: "120px",
      maxWidth: "120px",
    });
  });

  test("it should pin sticky headers to the top", () => {
    expect(getDataTableColumnLayoutStyle(view, true, true)).toMatchObject({
      top: 0,
      zIndex: 11,
      position: "sticky",
    });
  });
});
