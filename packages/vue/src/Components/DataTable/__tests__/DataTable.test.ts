// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { DataTable } from "@/Components/DataTable";
import type { DataTableColumn } from "@/Components/DataTable/dataTable.types";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
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

const mountedWrappers: Array<ReturnType<typeof mount<typeof DataTable>>> = [];

function mountDataTable(
  options: Parameters<typeof mount<typeof DataTable>>[1] = {},
) {
  const wrapper = mount(DataTable, options);

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render headers and cells from columns and rows", () => {
  const wrapper = mountDataTable({
    props: { rows, columns },
  });

  expect(wrapper.text()).toContain("Role");
  expect(wrapper.text()).toContain("Name");
  expect(wrapper.text()).toContain("Alan Turing");
  expect(wrapper.text()).toContain("Ada Lovelace");
  expect(wrapper.find("table").exists()).toBe(true);
});

test("it should apply the bordered variant on the table wrapper", () => {
  const wrapper = mountDataTable({
    props: { rows, columns, variant: "bordered" },
  });

  expect(wrapper.find("table").element.parentElement?.className).toContain(
    "ring-1",
  );
});

test("it should emit update:sorting when a sortable header is clicked", async () => {
  const wrapper = mountDataTable({
    props: { rows, columns },
  });

  await wrapper.find("th button").trigger("click");

  expect(wrapper.emitted("update:sorting")?.[0]).toEqual([
    { id: "role", desc: false },
  ]);
});

test("it should set aria-sort when sorting is controlled", () => {
  const wrapper = mountDataTable({
    props: {
      rows,
      columns,
      sorting: { desc: true, id: "role" },
    },
  });

  expect(wrapper.find("th[aria-sort]").attributes("aria-sort")).toBe(
    "descending",
  );
});

test("it should emit update:selection when a row is selected", async () => {
  const wrapper = mountDataTable({
    props: {
      rows,
      columns,
      selection: [],
      getRowId: (row: User) => row.id,
    },
  });

  const rowCheckbox = wrapper
    .findAll('input[type="checkbox"]')
    .find((input) => input.attributes("aria-label") === "Select row");

  await rowCheckbox?.setValue(true);

  expect(wrapper.emitted("update:selection")?.[0]).toEqual([["1"]]);
});

test("it should emit update:page when a page button is clicked", async () => {
  const wrapper = mountDataTable({
    props: {
      rows,
      page: 1,
      columns,
      pageCount: 4,
    },
  });

  await wrapper.find("button[aria-label='Page 2']").trigger("click");

  expect(wrapper.emitted("update:page")?.[0]).toEqual([2]);
});

test("it should show the empty slot when there are no rows", () => {
  const wrapper = mountDataTable({
    props: { columns, rows: [] },
    slots: { empty: "No users" },
  });

  expect(wrapper.text()).toContain("No users");
});

test("it should mark the table busy when loading", () => {
  const wrapper = mountDataTable({
    props: { rows, columns, loading: true },
  });

  expect(
    wrapper.find("table").element.parentElement?.getAttribute("aria-busy"),
  ).toBe("true");
});
