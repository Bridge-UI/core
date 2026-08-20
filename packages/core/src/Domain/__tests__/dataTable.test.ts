// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  DATATABLE_CHROME_COLUMN_WIDTH_PX,
  DATATABLE_EXPAND_COLUMN_ID,
  DATATABLE_PAGINATION_VARIANT,
  DATATABLE_SELECTION_COLUMN_ID,
  DATATABLE_STICKY_WIDTH_PX,
  getDataTableAriaSort,
  getDataTableColumnAccessor,
  getDataTableColumnFilterValues,
  getDataTableColumnTrack,
  getDataTableColumnWidthPx,
  getDataTableDefaultCellContent,
  getDataTableGridTemplate,
  getDataTablePaginationVariant,
  getDataTableSelectAllState,
  getDataTableSortIcon,
  getDataTableStickyInsets,
  isDataTableColumnFilterable,
  isDataTableColumnFiltered,
  isDataTableExpandEnabled,
  isDataTableSelectionEnabled,
  isDataTableSelectionMultiple,
  isDataTableServerPaged,
  isDataTableVisibilityEnabled,
  resolveDataTableRowId,
  rowSelectionToIds,
  selectionToRowSelection,
  setDataTableColumnFilter,
  setDataTableRowSelection,
  toggleDataTableColumnVisibility,
  toggleDataTableFilterDraft,
  toggleDataTablePageSelection,
  toggleDataTableRowExpansion,
  toggleDataTableRowSelection,
  toggleDataTableSorting,
} from "@/Domain/dataTable";

describe("getDataTablePaginationVariant", () => {
  test("it should map table chrome to pagination variants", () => {
    expect(getDataTablePaginationVariant("plain")).toBe("text");
    expect(getDataTablePaginationVariant("ghost")).toBe("ghost");
    expect(getDataTablePaginationVariant("unknown")).toBe("text");
    expect(getDataTablePaginationVariant(undefined)).toBe("text");
    expect(getDataTablePaginationVariant("bordered")).toBe("outlined");
    expect(DATATABLE_PAGINATION_VARIANT.plain).toBe("text");
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
  test("it should require both page and pageCount", () => {
    expect(isDataTableServerPaged(1, 4)).toBe(true);
    expect(isDataTableServerPaged(1, undefined)).toBe(false);
    expect(isDataTableServerPaged(undefined, 4)).toBe(false);
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

describe("getDataTableColumnTrack", () => {
  test("it should map width and the selection column to grid tracks", () => {
    expect(getDataTableColumnTrack(120)).toBe("120px");
    expect(getDataTableColumnTrack("8rem")).toBe("8rem");
    expect(getDataTableColumnTrack(undefined, true)).toBe("3rem");
    expect(getDataTableColumnTrack(undefined)).toBe("minmax(0, 1fr)");
  });
});

describe("getDataTableGridTemplate", () => {
  test("it should join column tracks for a row", () => {
    expect(getDataTableGridTemplate([])).toBe("minmax(0, 1fr)");
    expect(
      getDataTableGridTemplate([{ isSelection: true }, {}, { width: 160 }]),
    ).toBe("3rem minmax(0, 1fr) 160px");
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

describe("toggleDataTableColumnVisibility", () => {
  test("it should hide a column and keep one visible", () => {
    expect(DATATABLE_EXPAND_COLUMN_ID).toBe("__bridge-expand");
    expect(isDataTableVisibilityEnabled([], true)).toBe(true);
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

describe("toggleDataTableFilterDraft", () => {
  test("it should toggle values or replace in single-select", () => {
    expect(toggleDataTableFilterDraft(["a"], "b", true)).toEqual(["a", "b"]);
    expect(toggleDataTableFilterDraft(["a", "b"], "a", false)).toEqual(["b"]);
    expect(toggleDataTableFilterDraft(["a"], "b", true, false)).toEqual(["b"]);
    expect(toggleDataTableFilterDraft(["a"], "a", false, false)).toEqual([]);
  });
});
