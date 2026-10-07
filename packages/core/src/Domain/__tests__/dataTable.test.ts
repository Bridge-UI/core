// ** External Imports
import { describe, expect, test, vi } from "vitest";

// ** Local Imports
import {
  DATATABLE_CHROME_COLUMN_WIDTH_PX,
  DATATABLE_EXPAND_COLUMN_ID,
  DATATABLE_PER_PAGE_OPTIONS,
  DATATABLE_SELECTION_COLUMN_ID,
  DATATABLE_STICKY_WIDTH_PX,
  DEFAULT_DATATABLE_PER_PAGE,
  filterDataTableFilterOptions,
  flattenDataTableFilterOptionValues,
  getDataTableAriaSort,
  getDataTableColumnAccessor,
  getDataTableColumnCssWidth,
  getDataTableColumnFilterValues,
  getDataTableColumnSearch,
  getDataTableColumnTrack,
  getDataTableColumnWidthPx,
  getDataTableDefaultCellContent,
  getDataTableFooterLayout,
  getDataTableGridTemplate,
  getDataTableHiddenColumnIds,
  getDataTablePaginationSlotProps,
  getDataTablePerPageOptions,
  getDataTablePerPageSelectOptions,
  getDataTableResetHiddenColumnIds,
  getDataTableResolvedPageCount,
  getDataTableResolvedPerPage,
  getDataTableSelectAllState,
  getDataTableSelectionTotal,
  getDataTableSortIcon,
  getDataTableSortLabel,
  getDataTableStickyInsets,
  getDataTableStickyPing,
  isDataTableClientPaged,
  isDataTableColumnFilterable,
  isDataTableColumnFiltered,
  isDataTableColumnSearchable,
  isDataTableColumnSearched,
  isDataTableCursorPaged,
  isDataTableExpandEnabled,
  isDataTablePagingAmbiguous,
  isDataTablePerPageEnabled,
  isDataTableSearchEnabled,
  isDataTableSelectionEnabled,
  isDataTableSelectionMultiple,
  isDataTableServerPaged,
  isDataTableStickyHeader,
  isDataTableStickyHeaderBoxed,
  isDataTableVisibilityEnabled,
  matchDataTableSearch,
  resolveDataTableRowId,
  rowMatchesDataTableColumnSearch,
  rowMatchesDataTableToolbarSearch,
  rowSelectionToIds,
  selectionToRowSelection,
  setDataTableColumnFilter,
  setDataTableColumnSearch,
  setDataTableFilterDraftAll,
  setDataTableRowSelection,
  sliceDataTablePage,
  toggleDataTableColumnVisibility,
  toggleDataTableFilterDraft,
  toggleDataTablePageSelection,
  toggleDataTableRowExpansion,
  toggleDataTableRowSelection,
  toggleDataTableSorting,
} from "@/Domain/dataTable";

describe("getDataTableFooterLayout", () => {
  test("it should use the wide breakpoint for three clusters", () => {
    expect(
      getDataTableFooterLayout({
        showPager: true,
        showPerPage: true,
        showSelected: true,
      }),
    ).toEqual({ breakpoint: "wide", justify: "between" });
  });

  test("it should use the compact breakpoint for two clusters", () => {
    expect(
      getDataTableFooterLayout({
        showPager: true,
        showPerPage: true,
        showSelected: false,
      }),
    ).toEqual({ justify: "between", breakpoint: "compact" });
  });

  test("it should pin a single pager cluster to the end", () => {
    expect(
      getDataTableFooterLayout({
        showPager: true,
        showPerPage: false,
        showSelected: false,
      }),
    ).toEqual({ justify: "end", breakpoint: null });
  });

  test("it should pin a single selection summary to the start", () => {
    expect(
      getDataTableFooterLayout({
        showPager: false,
        showPerPage: false,
        showSelected: true,
      }),
    ).toEqual({ breakpoint: null, justify: "start" });
  });
});

describe("getDataTableSelectionTotal", () => {
  test("it should prefer totalCount over the filtered count", () => {
    expect(
      getDataTableSelectionTotal({ totalCount: 68, filteredCount: 10 }),
    ).toBe(68);
    expect(getDataTableSelectionTotal({ filteredCount: 10 })).toBe(10);
  });
});

describe("getDataTableAriaSort", () => {
  test("it should return none when unsorted or another column is active", () => {
    expect(getDataTableAriaSort(null, "name")).toBe("none");
    expect(getDataTableAriaSort({ id: "role", desc: false }, "name")).toBe(
      "none",
    );
  });

  test("it should return ascending or descending for the active column", () => {
    expect(getDataTableAriaSort({ id: "name", desc: true }, "name")).toBe(
      "descending",
    );
    expect(getDataTableAriaSort({ id: "name", desc: false }, "name")).toBe(
      "ascending",
    );
  });
});

describe("getDataTableSortIcon", () => {
  test("it should map aria-sort to a chevron icon", () => {
    expect(getDataTableSortIcon("none")).toBe("chevronUpDown");
    expect(getDataTableSortIcon("ascending")).toBe("chevronUp");
    expect(getDataTableSortIcon("descending")).toBe("chevronDown");
  });
});

describe("getDataTableSortLabel", () => {
  test("it should map aria-sort to the next sort action", () => {
    expect(getDataTableSortLabel("none")).toBe("Sort ascending");
    expect(getDataTableSortLabel("ascending")).toBe("Sort descending");
    expect(getDataTableSortLabel("descending")).toBe("Cancel sorting");
  });
});

describe("toggleDataTableSorting", () => {
  test("it should cycle unsorted to asc to desc to unsorted", () => {
    expect(toggleDataTableSorting(null, "name")).toEqual({
      id: "name",
      desc: false,
    });
    expect(toggleDataTableSorting({ id: "role", desc: true }, "name")).toEqual({
      id: "name",
      desc: false,
    });
    expect(toggleDataTableSorting({ id: "name", desc: false }, "name")).toEqual(
      { id: "name", desc: true },
    );
    expect(toggleDataTableSorting({ id: "name", desc: true }, "name")).toBe(
      null,
    );
  });
});

describe("isDataTableServerPaged", () => {
  test("it should require page plus pageCount or totalCount", () => {
    expect(isDataTableServerPaged(1, 4)).toBe(true);
    expect(isDataTableServerPaged(1, undefined, 40)).toBe(true);
    expect(isDataTableServerPaged(1, undefined)).toBe(false);
    expect(isDataTableServerPaged(undefined, 4)).toBe(false);
  });

  test("it should be server-paged in cursor paging", () => {
    expect(isDataTableServerPaged(1, undefined, undefined, true)).toBe(true);
    expect(isDataTableServerPaged(undefined, undefined, undefined, true)).toBe(
      true,
    );
  });
});

describe("isDataTableCursorPaged", () => {
  test("it should detect a bound cursor or cursor props", () => {
    expect(isDataTableCursorPaged({})).toBe(false);
    expect(isDataTableCursorPaged({ cursor: null })).toBe(true);
    expect(isDataTableCursorPaged({ prevCursor: "a" })).toBe(true);
    expect(isDataTableCursorPaged({ nextCursor: null })).toBe(true);
    expect(isDataTableCursorPaged({ hasCursorHandler: true })).toBe(true);
    expect(isDataTableCursorPaged({ hasCursorHandler: false })).toBe(false);
  });
});

describe("isDataTablePagingAmbiguous", () => {
  test("it should flag cursor props mixed with numbered server paging", () => {
    expect(isDataTablePagingAmbiguous(1, 4, undefined, true)).toBe(true);
    expect(isDataTablePagingAmbiguous(1, undefined, 40, true)).toBe(true);
    expect(isDataTablePagingAmbiguous(1, undefined, undefined, true)).toBe(
      false,
    );
    expect(isDataTablePagingAmbiguous(1, 4, undefined, false)).toBe(false);
  });
});

describe("isDataTableClientPaged", () => {
  test("it should slice locally when page and perPage are set without totals", () => {
    expect(isDataTableClientPaged(1, 10, undefined)).toBe(true);
    expect(isDataTableClientPaged(1, 10, 4)).toBe(false);
    expect(isDataTableClientPaged(1, 10, undefined, 40)).toBe(false);
    expect(isDataTableClientPaged(1, undefined, undefined)).toBe(false);
  });

  test("it should not slice locally in cursor paging", () => {
    expect(isDataTableClientPaged(1, 10, undefined, undefined, true)).toBe(
      false,
    );
  });
});

describe("getDataTablePaginationSlotProps", () => {
  test("it should step the page within count in numbered paging", () => {
    const onPageChange = vi.fn();
    const onCursorChange = vi.fn();

    const props = getDataTablePaginationSlotProps({
      page: 2,
      count: 3,
      onPageChange,
      onCursorChange,
      cursorPaged: false,
    });

    expect(props).toMatchObject({
      page: 2,
      count: 3,
      cursor: null,
      hasNext: true,
      nextCursor: null,
      prevCursor: null,
      hasPrevious: true,
    });

    props.onNext();
    props.onPrevious();

    expect(onPageChange.mock.calls).toEqual([[3], [1]]);
    expect(onCursorChange).not.toHaveBeenCalled();
  });

  test("it should set the cursor to the next or previous cursor", () => {
    const onPageChange = vi.fn();
    const onCursorChange = vi.fn();

    const props = getDataTablePaginationSlotProps({
      cursor: "b",
      onPageChange,
      onCursorChange,
      nextCursor: "c",
      prevCursor: "a",
      cursorPaged: true,
    });

    expect(props).toMatchObject({
      count: 1,
      cursor: "b",
      hasNext: true,
      hasPrevious: true,
    });

    props.onNext();
    props.onPrevious();

    expect(onCursorChange.mock.calls).toEqual([["c"], ["a"]]);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  test("it should disable controls when a cursor is null", () => {
    const onCursorChange = vi.fn();

    const props = getDataTablePaginationSlotProps({
      onCursorChange,
      prevCursor: null,
      nextCursor: null,
      cursorPaged: true,
      onPageChange: vi.fn(),
    });

    expect(props.hasNext).toBe(false);
    expect(props.hasPrevious).toBe(false);

    props.onNext();
    props.onPrevious();

    expect(onCursorChange).not.toHaveBeenCalled();
  });
});

describe("isDataTablePerPageEnabled", () => {
  test("it should enable when perPage, a handler, or a slot is present", () => {
    expect(isDataTablePerPageEnabled(10, false, false)).toBe(true);
    expect(isDataTablePerPageEnabled(undefined, true, false)).toBe(true);
    expect(isDataTablePerPageEnabled(undefined, false, true)).toBe(true);
    expect(isDataTablePerPageEnabled(undefined, false, false)).toBe(false);
  });
});

describe("getDataTableResolvedPerPage", () => {
  test("it should fall back to the default for missing or invalid sizes", () => {
    expect(getDataTableResolvedPerPage(25)).toBe(25);
    expect(getDataTableResolvedPerPage(undefined)).toBe(
      DEFAULT_DATATABLE_PER_PAGE,
    );
    expect(getDataTableResolvedPerPage(0)).toBe(DEFAULT_DATATABLE_PER_PAGE);
  });
});

describe("getDataTableResolvedPageCount", () => {
  test("it should prefer pageCount then totalCount then filtered rows", () => {
    expect(
      getDataTableResolvedPageCount({ pageCount: 4, totalCount: 40 }),
    ).toBe(4);
    expect(getDataTableResolvedPageCount({ perPage: 10, totalCount: 40 })).toBe(
      4,
    );
    expect(
      getDataTableResolvedPageCount({
        perPage: 10,
        clientPaged: true,
        filteredCount: 23,
      }),
    ).toBe(3);
    expect(getDataTableResolvedPageCount({})).toBe(undefined);
  });
});

describe("getDataTablePerPageSelectOptions", () => {
  test("it should insert a custom perPage into the option list", () => {
    expect(getDataTablePerPageOptions()).toEqual([10, 25, 50, 100]);
    expect(DATATABLE_PER_PAGE_OPTIONS).toEqual([10, 25, 50, 100]);
    expect(getDataTablePerPageSelectOptions(15, [10, 25])).toEqual([
      10, 15, 25,
    ]);
  });
});

describe("sliceDataTablePage", () => {
  test("it should return the requested page of rows", () => {
    expect(sliceDataTablePage(["a", "b", "c", "d"], 2, 2)).toEqual(["c", "d"]);
    expect(sliceDataTablePage(["a", "b"], 1, 10)).toEqual(["a", "b"]);
  });
});

describe("isDataTableStickyHeader", () => {
  test("it should enable page and boxed sticky headers", () => {
    expect(isDataTableStickyHeader(true)).toBe(true);
    expect(isDataTableStickyHeader("")).toBe(true);
    expect(isDataTableStickyHeader("true")).toBe(true);
    expect(isDataTableStickyHeader("boxed")).toBe(true);
    expect(isDataTableStickyHeader(false)).toBe(false);
    expect(isDataTableStickyHeaderBoxed("boxed")).toBe(true);
    expect(isDataTableStickyHeaderBoxed(true)).toBe(false);
  });
});

describe("isDataTableSelectionEnabled", () => {
  test("it should enable when ids or a handler are present", () => {
    expect(isDataTableSelectionEnabled([], false)).toBe(true);
    expect(isDataTableSelectionEnabled(undefined, true)).toBe(true);
    expect(isDataTableSelectionEnabled(undefined, false)).toBe(false);
  });
});

describe("resolveDataTableRowId", () => {
  test("it should prefer getRowId then row.id then the index", () => {
    expect(resolveDataTableRowId({ id: 7 }, 3)).toBe("7");
    expect(resolveDataTableRowId({ name: "Ada" }, 3)).toBe("3");
    expect(resolveDataTableRowId({ id: "a" }, 0, (row) => row.id)).toBe("a");
  });
});

describe("getDataTableColumnAccessor", () => {
  test("it should use accessor or the column id", () => {
    expect(getDataTableColumnAccessor({ name: "Ada" }, { id: "name" })).toBe(
      "Ada",
    );
    expect(
      getDataTableColumnAccessor(
        { user: { name: "Ada" } },
        { id: "name", accessor: (row) => row.user.name },
      ),
    ).toBe("Ada");
  });
});

describe("getDataTableDefaultCellContent", () => {
  test("it should stringify accessors and skip empty values", () => {
    expect(getDataTableDefaultCellContent(0)).toBe("0");
    expect(getDataTableDefaultCellContent("")).toBe(null);
    expect(getDataTableDefaultCellContent(null)).toBe(null);
    expect(getDataTableDefaultCellContent("Ada")).toBe("Ada");
  });
});

describe("matchDataTableSearch", () => {
  test("it should match case-insensitive contains and ignore empty queries", () => {
    expect(matchDataTableSearch("Ada", "")).toBe(true);
    expect(matchDataTableSearch("Ada", "ad")).toBe(true);
    expect(matchDataTableSearch(null, "ad")).toBe(false);
    expect(matchDataTableSearch("Ada", "xyz")).toBe(false);
  });
});

describe("rowMatchesDataTableToolbarSearch", () => {
  const row = { name: "Ada", role: "Engineer" };
  const columns = [{ id: "name", searchable: true }, { id: "role" }];

  test("it should search searchable columns when any exist", () => {
    expect(rowMatchesDataTableToolbarSearch(row, columns, "Ada")).toBe(true);
    expect(rowMatchesDataTableToolbarSearch(row, columns, "Engineer")).toBe(
      false,
    );
  });

  test("it should search all visible columns when none are searchable", () => {
    expect(
      rowMatchesDataTableToolbarSearch(
        row,
        [{ id: "name" }, { id: "role" }],
        "Engineer",
      ),
    ).toBe(true);
  });

  test("it should skip hidden columns", () => {
    expect(
      rowMatchesDataTableToolbarSearch(row, columns, "Ada", ["name"]),
    ).toBe(false);
  });
});

describe("isDataTableSearchEnabled", () => {
  test("it should enable when search, a handler, a slot, or showSearch is set", () => {
    expect(isDataTableSearchEnabled("", false, false)).toBe(true);
    expect(isDataTableSearchEnabled(undefined, true, false)).toBe(true);
    expect(isDataTableSearchEnabled(undefined, false, true)).toBe(true);
    expect(isDataTableSearchEnabled(undefined, false, false)).toBe(false);
    expect(isDataTableSearchEnabled(undefined, false, false, true)).toBe(true);
    expect(isDataTableSearchEnabled("", false, false, false)).toBe(true);
  });
});

describe("getDataTableColumnTrack", () => {
  test("it should map width and the selection column to grid tracks", () => {
    expect(getDataTableColumnTrack(120)).toBe("120px");
    expect(getDataTableColumnTrack("8rem")).toBe("8rem");
    expect(getDataTableColumnTrack(undefined, true)).toBe("3rem");
    expect(getDataTableColumnTrack(undefined)).toBe("minmax(0, 1fr)");
    expect(getDataTableColumnTrack(undefined, false, false)).toBe(
      "max-content",
    );
  });
});

describe("getDataTableGridTemplate", () => {
  test("it should join column tracks for a row", () => {
    expect(getDataTableGridTemplate([])).toBe("minmax(0, 1fr)");
    expect(getDataTableGridTemplate([], false)).toBe("max-content");
    expect(
      getDataTableGridTemplate([{ isSelection: true }, {}, { width: 160 }]),
    ).toBe("3rem minmax(0, 1fr) 160px");
    expect(
      getDataTableGridTemplate(
        [{ isSelection: true }, {}, { width: 160 }],
        false,
      ),
    ).toBe("3rem max-content 160px");
    expect(getDataTableGridTemplate([{ isExpand: true }])).toBe("3rem");
  });
});

describe("getDataTableColumnWidthPx", () => {
  test("it should parse px rem and chrome widths", () => {
    expect(getDataTableColumnWidthPx(120)).toBe(120);
    expect(getDataTableColumnWidthPx("8rem")).toBe(128);
    expect(getDataTableColumnWidthPx("100px")).toBe(100);
    expect(getDataTableColumnWidthPx(undefined)).toBe(
      DATATABLE_STICKY_WIDTH_PX,
    );
    expect(getDataTableColumnWidthPx(undefined, true)).toBe(
      DATATABLE_CHROME_COLUMN_WIDTH_PX,
    );
  });
});

describe("getDataTableStickyInsets", () => {
  test("it should pin start and end columns with offsets", () => {
    const insets = getDataTableStickyInsets(
      [
        { isSelection: true, id: DATATABLE_SELECTION_COLUMN_ID },
        { id: "name", width: 120, sticky: "start" },
        { id: "role" },
        { width: 80, id: "actions", sticky: "end" },
      ],
      1,
    );

    expect(insets.name?.edge).toBe(true);
    expect(insets.name?.style?.left).toBe(48);
    expect(insets.role?.style).toBeUndefined();
    expect(insets.actions?.style?.right).toBe(0);
    expect(insets[DATATABLE_SELECTION_COLUMN_ID]?.style?.left).toBe(0);
  });
});

describe("getDataTableStickyPing", () => {
  test("it should hide both shadows when the grid does not overflow", () => {
    expect(getDataTableStickyPing(0, 400, 400)).toEqual({
      end: false,
      start: false,
    });
  });

  test("it should ping start after scrolling and end before the last pixel", () => {
    expect(getDataTableStickyPing(0, 800, 400)).toEqual({
      end: true,
      start: false,
    });
    expect(getDataTableStickyPing(200, 800, 400)).toEqual({
      end: true,
      start: true,
    });
    expect(getDataTableStickyPing(400, 800, 400)).toEqual({
      end: false,
      start: true,
    });
  });
});

describe("getDataTableHiddenColumnIds", () => {
  test("it should collect hidden column ids", () => {
    expect(
      getDataTableHiddenColumnIds([
        { id: "name", hidden: false },
        { id: "role", hidden: true },
      ]),
    ).toEqual(["role"]);
  });
});

describe("getDataTableResetHiddenColumnIds", () => {
  test("it should keep only columns that cannot be shown", () => {
    expect(
      getDataTableResetHiddenColumnIds([
        { id: "name", hideable: false },
        { id: "role", hideable: true },
      ]),
    ).toEqual(["name"]);
  });
});

describe("toggleDataTableColumnVisibility", () => {
  test("it should hide a column and keep one visible", () => {
    expect(DATATABLE_EXPAND_COLUMN_ID).toBe("__bridge-expand");
    expect(isDataTableVisibilityEnabled([], true)).toBe(true);
    expect(isDataTableVisibilityEnabled(undefined, false)).toBe(false);
    expect(isDataTableVisibilityEnabled(undefined, false, true)).toBe(true);
    expect(isDataTableVisibilityEnabled([], true, false)).toBe(true);
    expect(isDataTableExpandEnabled(undefined, false, true)).toBe(true);
    expect(
      toggleDataTableColumnVisibility([], "role", true, ["name", "role"]),
    ).toEqual(["role"]);
    expect(toggleDataTableColumnVisibility([], "name", true, ["name"])).toEqual(
      [],
    );
  });
});

describe("toggleDataTableRowExpansion", () => {
  test("it should add or remove an expanded row id", () => {
    expect(toggleDataTableRowExpansion([], "a", true)).toEqual(["a"]);
    expect(toggleDataTableRowExpansion(["a"], "a", false)).toEqual([]);
  });
});

describe("selectionToRowSelection", () => {
  test("it should map ids to a record", () => {
    expect(selectionToRowSelection(undefined)).toEqual({});
    expect(selectionToRowSelection(["a", "b"])).toEqual({ a: true, b: true });
  });
});

describe("rowSelectionToIds", () => {
  test("it should keep only selected ids", () => {
    expect(rowSelectionToIds({ a: true, c: true, b: false })).toEqual([
      "a",
      "c",
    ]);
  });
});

describe("getDataTableSelectAllState", () => {
  test("it should report checked and indeterminate for the page", () => {
    expect(getDataTableSelectAllState([], [])).toEqual({
      checked: false,
      indeterminate: false,
    });
    expect(getDataTableSelectAllState(["a", "b"], ["a", "b"])).toEqual({
      checked: true,
      indeterminate: false,
    });
    expect(getDataTableSelectAllState(["a", "b"], ["a"])).toEqual({
      checked: false,
      indeterminate: true,
    });
  });
});

describe("toggleDataTableRowSelection", () => {
  test("it should add or remove a row id", () => {
    expect(toggleDataTableRowSelection(["a"], "a", true)).toEqual(["a"]);
    expect(toggleDataTableRowSelection(["a"], "b", true)).toEqual(["a", "b"]);
    expect(toggleDataTableRowSelection(["a", "b"], "a", false)).toEqual(["b"]);
  });
});

describe("toggleDataTablePageSelection", () => {
  test("it should select or clear the page without dropping other ids", () => {
    expect(DATATABLE_SELECTION_COLUMN_ID).toBe("__bridge-selection");
    expect(toggleDataTablePageSelection(["z"], ["a", "b"], true)).toEqual([
      "z",
      "a",
      "b",
    ]);
    expect(
      toggleDataTablePageSelection(["z", "a", "b"], ["a", "b"], false),
    ).toEqual(["z"]);
  });
});

describe("setDataTableRowSelection", () => {
  test("it should replace the selection in single mode", () => {
    expect(setDataTableRowSelection(["a"], "b", true, "single")).toEqual(["b"]);
    expect(setDataTableRowSelection(["a"], "a", false, "single")).toEqual([]);
  });

  test("it should toggle ids in multiple mode", () => {
    expect(isDataTableSelectionMultiple(undefined)).toBe(true);
    expect(isDataTableSelectionMultiple("single")).toBe(false);
    expect(setDataTableRowSelection(["a"], "b", true)).toEqual(["a", "b"]);
    expect(setDataTableRowSelection(["a", "b"], "a", false)).toEqual(["b"]);
  });
});

describe("setDataTableColumnFilter", () => {
  test("it should set or omit a column key", () => {
    expect(
      isDataTableColumnFilterable({ filters: [{ label: "A", value: "a" }] }),
    ).toBe(true);
    expect(isDataTableColumnFilterable({ filters: [] })).toBe(false);
    expect(isDataTableColumnFilterable({ searchable: true })).toBe(true);
    expect(isDataTableColumnSearchable({ searchable: true })).toBe(true);
    expect(isDataTableColumnSearchable({ searchable: false })).toBe(false);
    expect(getDataTableColumnFilterValues({ role: ["a"] }, "role")).toEqual([
      "a",
    ]);
    expect(isDataTableColumnFiltered({ role: ["a"] }, "name")).toBe(false);
    expect(setDataTableColumnFilter({ role: ["a"] }, "name", ["b"])).toEqual({
      role: ["a"],
      name: ["b"],
    });
    expect(setDataTableColumnFilter({ role: ["a"] }, "role", [])).toEqual({});
  });
});

describe("setDataTableColumnSearch", () => {
  const columns = [{ id: "name" }, { id: "role" }];

  test("it should set or omit a column query and match rows", () => {
    expect(getDataTableColumnSearch({ name: "Ada" }, "name")).toBe("Ada");
    expect(isDataTableColumnSearched({ name: "Ada" }, "role")).toBe(false);
    expect(setDataTableColumnSearch({ name: "Ada" }, "role", "eng")).toEqual({
      name: "Ada",
      role: "eng",
    });
    expect(setDataTableColumnSearch({ name: "Ada" }, "name", "  ")).toEqual({});
    expect(
      rowMatchesDataTableColumnSearch(
        { role: "Engineer", name: "Ada Lovelace" },
        columns,
        { name: "ada" },
      ),
    ).toBe(true);
    expect(
      rowMatchesDataTableColumnSearch(
        { role: "Researcher", name: "Alan Turing" },
        columns,
        { name: "ada" },
      ),
    ).toBe(false);
    expect(
      rowMatchesDataTableColumnSearch(
        { role: "Researcher", name: "Alan Turing" },
        columns,
        { name: "ada" },
        ["name"],
      ),
    ).toBe(true);
  });
});

describe("toggleDataTableFilterDraft", () => {
  test("it should toggle values or replace in single-select", () => {
    expect(toggleDataTableFilterDraft(["a"], "b", true)).toEqual(["a", "b"]);
    expect(toggleDataTableFilterDraft(["a", "b"], "a", false)).toEqual(["b"]);
    expect(toggleDataTableFilterDraft(["a"], "b", true, false)).toEqual(["b"]);
    expect(toggleDataTableFilterDraft(["a"], "a", false, false)).toEqual([]);
  });
});

describe("filterDataTableFilterOptions", () => {
  const options = [
    { label: "Engineer", value: "Engineer" },
    {
      label: "Science",
      value: "science",
      children: [
        { label: "Researcher", value: "Researcher" },
        { label: "Mathematician", value: "Mathematician" },
      ],
    },
  ];

  test("it should filter leaves and keep matching groups", () => {
    expect(filterDataTableFilterOptions(options, "eng")).toEqual([
      { label: "Engineer", value: "Engineer" },
    ]);
    expect(
      filterDataTableFilterOptions(options, "science")[0]?.children,
    ).toHaveLength(2);
    expect(
      flattenDataTableFilterOptionValues(
        filterDataTableFilterOptions(options, "math"),
      ),
    ).toEqual(["Mathematician"]);
  });
});

describe("setDataTableFilterDraftAll", () => {
  test("it should add or remove a value set on the draft", () => {
    expect(setDataTableFilterDraftAll(["a"], ["b", "c"], true)).toEqual([
      "a",
      "b",
      "c",
    ]);
    expect(setDataTableFilterDraftAll(["a", "b"], ["b", "c"], false)).toEqual([
      "a",
    ]);
  });
});

describe("getDataTableColumnCssWidth", () => {
  test("it should resolve chrome, numeric, and CSS widths", () => {
    expect(getDataTableColumnCssWidth(undefined)).toBeUndefined();
    expect(getDataTableColumnCssWidth(120)).toBe("120px");
    expect(getDataTableColumnCssWidth("8rem")).toBe("8rem");
    expect(getDataTableColumnCssWidth(undefined, true)).toBe("3rem");
  });
});
