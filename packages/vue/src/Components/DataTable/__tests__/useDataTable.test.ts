// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import {
  useDataTable,
  type DataTableModels,
} from "@/Components/DataTable/composables/useDataTable";
import type { DataTableColumn } from "@/Components/DataTable/dataTable.types";

const libDefaults = {
  size: "md",
  full: true,
  rounded: "lg",
  loading: false,
  striped: false,
  variant: "plain",
  hoverable: false,
  stickyHeader: false,
  filterOverlay: "auto",
  columnsOverlay: "auto",
  paginationAlign: "end",
  loadingVariant: "overlay",
  selectionMode: "multiple",
} as const;

type User = { id: string; name: string };

const columns: DataTableColumn<User>[] = [
  { id: "name", header: "Name", cell: (row) => row.name },
];

function createModels(
  overrides: Partial<DataTableModels> = {},
): DataTableModels {
  return {
    page: ref(undefined),
    search: ref(undefined),
    perPage: ref(undefined),
    filters: ref(undefined),
    sorting: ref(undefined),
    expanded: ref(undefined),
    selection: ref(undefined),
    columnSearch: ref(undefined),
    hiddenColumns: ref(undefined),
    ...overrides,
  };
}

function mountUseDataTable<T>(
  props: Parameters<typeof useDataTable<T>>[0],
  models: DataTableModels = createModels(),
) {
  let result!: ReturnType<typeof useDataTable<T>>;

  const Wrapper = defineComponent({
    setup() {
      result = useDataTable(props, libDefaults, models);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return { result };
}

test("it should expose table defaults from useDataTable", () => {
  const { result } = mountUseDataTable({
    columns,
    rows: [{ id: "1", name: "Ada" }],
  });

  expect(result.showEmpty.value).toBe(false);
  expect(result.rowViews.value).toHaveLength(1);
  expect(result.showPagination.value).toBe(false);
  expect(result.merged.value.variant).toBe("plain");
  expect(result.paginationVariant.value).toBe("text");
  expect(result.headerViews.value[0]?.id).toBe("name");
  expect(result.merged.value.selectionMode).toBe("multiple");
});

test("it should enable selection views when selection is controlled", () => {
  const { result } = mountUseDataTable(
    {
      columns,
      rows: [{ id: "1", name: "Ada" }],
    },
    {
      page: ref(undefined),
      selection: ref(["1"]),
      search: ref(undefined),
      perPage: ref(undefined),
      filters: ref(undefined),
      sorting: ref(undefined),
      expanded: ref(undefined),
      columnSearch: ref(undefined),
      hiddenColumns: ref(undefined),
    },
  );

  expect(result.selectionEnabled.value).toBe(true);
  expect(result.selectAllState.value.checked).toBe(true);
  expect(result.headerViews.value[0]?.isSelection).toBe(true);
});

test("it should map bordered chrome to outlined pagination", () => {
  const { result } = mountUseDataTable(
    {
      columns,
      pageCount: 3,
      variant: "bordered",
      rows: [{ id: "1", name: "Ada" }],
    },
    {
      page: ref(1),
      search: ref(undefined),
      perPage: ref(undefined),
      filters: ref(undefined),
      sorting: ref(undefined),
      expanded: ref(undefined),
      selection: ref(undefined),
      columnSearch: ref(undefined),
      hiddenColumns: ref(undefined),
    },
  );

  expect(result.serverPaged.value).toBe(true);
  expect(result.showPagination.value).toBe(true);
  expect(result.paginationVariant.value).toBe("outlined");
});

test("it should slice rows when page and perPage are set without totals", () => {
  const { result } = mountUseDataTable(
    {
      columns,
      rows: [
        { id: "1", name: "Ada" },
        { id: "2", name: "Alan" },
      ],
    },
    {
      page: ref(2),
      perPage: ref(1),
      search: ref(undefined),
      filters: ref(undefined),
      sorting: ref(undefined),
      expanded: ref(undefined),
      selection: ref(undefined),
      columnSearch: ref(undefined),
      hiddenColumns: ref(undefined),
    },
  );

  expect(result.clientPaged.value).toBe(true);
  expect(result.rowViews.value).toHaveLength(1);
  expect(result.rowViews.value[0]?.original.name).toBe("Alan");
  expect(result.resolvedPageCount.value).toBe(2);
});

test("it should derive page count from totalCount and perPage", () => {
  const { result } = mountUseDataTable(
    {
      columns,
      totalCount: 23,
      rows: [{ id: "1", name: "Ada" }],
    },
    {
      page: ref(1),
      perPage: ref(10),
      search: ref(undefined),
      filters: ref(undefined),
      sorting: ref(undefined),
      expanded: ref(undefined),
      selection: ref(undefined),
      columnSearch: ref(undefined),
      hiddenColumns: ref(undefined),
    },
  );

  expect(result.serverPaged.value).toBe(true);
  expect(result.showPerPage.value).toBe(true);
  expect(result.resolvedPageCount.value).toBe(3);
  expect(String(result.paginationBind.value.class)).toContain("flex-col");
  expect(String(result.paginationBind.value.class)).toContain("sm:flex-row");
});

test("it should expose sticky expand visibility and summary views", () => {
  const { result } = mountUseDataTable(
    {
      rows: [{ id: "1", name: "Ada" }],
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
    {
      page: ref(undefined),
      search: ref(undefined),
      perPage: ref(undefined),
      filters: ref(undefined),
      sorting: ref(undefined),
      expanded: ref(undefined),
      selection: ref(undefined),
      hiddenColumns: ref(["role"]),
      columnSearch: ref(undefined),
    },
  );

  expect(result.visibilityEnabled.value).toBe(true);
  expect(result.headerViews.value[0]?.sticky).toBe("start");
  expect(result.headerViews.value[0]?.stickyStyle?.left).toBe(0);
  expect(result.headerViews.value.some((header) => header.id === "role")).toBe(
    false,
  );
  expect(result.summaryCells.value?.[0]?.content).toBe("1");
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
  const { result } = mountUseDataTable(
    { rows: people, columns: peopleColumns },
    createModels({ sorting: ref({ id: "name", desc: true }) }),
  );

  expect(result.rowViews.value).toHaveLength(2);
  expect(result.rowViews.value[0]?.original.name).toBe("Alan");
  expect(result.rowViews.value[1]?.original.name).toBe("Ada");
});

test("it should write sorting from onToggleSort", () => {
  const models = createModels();
  const { result } = mountUseDataTable(
    { rows: people, columns: peopleColumns },
    models,
  );

  result.onToggleSort("name");

  expect(models.sorting.value).toEqual({ id: "name", desc: false });
});

test("it should filter row views from the filters binding", () => {
  const { result } = mountUseDataTable(
    { rows: people, columns: peopleColumns },
    createModels({ filters: ref({ role: ["Engineer"] }) }),
  );

  expect(result.rowViews.value).toHaveLength(1);
  expect(result.rowViews.value[0]?.original.name).toBe("Ada");
});

test("it should write filters and reset page from onCommitColumnFilter", () => {
  const models = createModels({ page: ref(2), filters: ref({}) });
  const { result } = mountUseDataTable(
    { rows: people, columns: peopleColumns },
    models,
  );

  result.onCommitColumnFilter("role", ["Engineer"], "");

  expect(models.page.value).toBe(1);
  expect(models.filters.value).toEqual({ role: ["Engineer"] });
});

test("it should filter row views from the search binding", () => {
  const { result } = mountUseDataTable(
    { rows: people, columns: peopleColumns },
    createModels({ search: ref("Alan") }),
  );

  expect(result.showSearch.value).toBe(true);
  expect(result.rowViews.value).toHaveLength(1);
  expect(result.rowViews.value[0]?.original.name).toBe("Alan");
});

test("it should write search and reset page from onChangeSearch", () => {
  const models = createModels({ page: ref(2), search: ref("") });
  const { result } = mountUseDataTable(
    { rows: people, columns: peopleColumns },
    models,
  );

  result.onChangeSearch("Ada");

  expect(models.page.value).toBe(1);
  expect(models.search.value).toBe("Ada");
});

test("it should write perPage and reset page from onChangePerPage", () => {
  const models = createModels({ page: ref(2), perPage: ref(10) });
  const { result } = mountUseDataTable(
    { rows: people, pageCount: 3, columns: peopleColumns },
    models,
  );

  result.onChangePerPage(25);

  expect(models.page.value).toBe(1);
  expect(result.showPerPage.value).toBe(true);
  expect(models.perPage.value).toBe(25);
});

test("it should write page from paginationSlotProps", () => {
  const models = createModels({ page: ref(1) });
  const { result } = mountUseDataTable(
    { rows: people, pageCount: 4, columns: peopleColumns },
    models,
  );

  result.paginationSlotProps.value.onPageChange(3);

  expect(models.page.value).toBe(3);
  expect(result.paginationSlotProps.value.page).toBe(3);
});

test("it should hide columns from the hiddenColumns binding", () => {
  const { result } = mountUseDataTable(
    { rows: people, columns: peopleColumns },
    createModels({ hiddenColumns: ref(["role"]) }),
  );

  expect(result.visibilityEnabled.value).toBe(true);
  expect(result.visibilityItems.value[1]?.hidden).toBe(true);
  expect(result.headerViews.value.some((header) => header.id === "role")).toBe(
    false,
  );
});

test("it should write hiddenColumns from onToggleColumnVisibility", () => {
  const models = createModels({ hiddenColumns: ref([]) });
  const { result } = mountUseDataTable(
    { rows: people, columns: peopleColumns },
    models,
  );

  result.onToggleColumnVisibility("role", true);

  expect(models.hiddenColumns.value).toEqual(["role"]);
});
