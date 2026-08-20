// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { useDataTable } from "@/Components/DataTable/composables/useDataTable";
import type { DataTableColumn } from "@/Components/DataTable/dataTable.types";

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

function mountUseDataTable(
  props: Parameters<typeof useDataTable<User>>[0] = { columns },
  models: Parameters<typeof useDataTable<User>>[2] = {
    page: ref(undefined),
    sorting: ref(undefined),
    selection: ref(undefined),
  },
) {
  let result!: ReturnType<typeof useDataTable<User>>;

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
  expect(result.paginationVariant.value).toBe("text");
  expect(result.headerViews.value[0]?.id).toBe("name");
  expect(result.tableProps.value.variant).toBe("plain");
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
      sorting: ref(undefined),
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
      sorting: ref(undefined),
      selection: ref(undefined),
    },
  );

  expect(result.serverPaged.value).toBe(true);
  expect(result.showPagination.value).toBe(true);
  expect(result.paginationVariant.value).toBe("outlined");
});
