// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  DATATABLE_PAGINATION_VARIANT,
  DATATABLE_SELECTION_COLUMN_ID,
  getDataTableAriaSort,
  getDataTableColumnAccessor,
  getDataTablePaginationVariant,
  getDataTableSelectAllState,
  getDataTableSortIcon,
  isDataTableSelectionEnabled,
  isDataTableServerPaged,
  resolveDataTableRowId,
  rowSelectionToIds,
  selectionToRowSelection,
  toggleDataTablePageSelection,
  toggleDataTableRowSelection,
  toggleDataTableSorting,
} from "@/Domain/dataTable";

describe("getDataTablePaginationVariant", () => {
  test("it should map table chrome to pagination variants", () => {
    expect(getDataTablePaginationVariant("ghost")).toBe("ghost");
    expect(getDataTablePaginationVariant("plain")).toBe("text");
    expect(getDataTablePaginationVariant(undefined)).toBe("text");
    expect(getDataTablePaginationVariant("unknown")).toBe("text");
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
    expect(isDataTableServerPaged(undefined, 4)).toBe(false);
    expect(isDataTableServerPaged(1, undefined)).toBe(false);
    expect(isDataTableServerPaged(1, 4)).toBe(true);
  });
});

describe("isDataTableSelectionEnabled", () => {
  test("it should enable when ids or a handler are present", () => {
    expect(isDataTableSelectionEnabled(undefined, false)).toBe(false);
    expect(isDataTableSelectionEnabled([], false)).toBe(true);
    expect(isDataTableSelectionEnabled(undefined, true)).toBe(true);
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
    expect(toggleDataTableRowSelection(["a"], "b", true)).toEqual(["a", "b"]);
    expect(toggleDataTableRowSelection(["a"], "a", true)).toEqual(["a"]);
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
