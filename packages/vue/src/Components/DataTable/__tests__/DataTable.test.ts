// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { DataTable } from "@/Components/DataTable";
import type { DataTableColumn } from "@/Components/DataTable/dataTable.types";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
  resetLayerStackForTests();
  document.body.innerHTML = "";
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

  expect(wrapper.text()).toContain("Name");
  expect(wrapper.text()).toContain("Role");
  expect(wrapper.text()).toContain("Alan Turing");
  expect(wrapper.text()).toContain("Ada Lovelace");
  expect(wrapper.find('[role="table"]').exists()).toBe(true);
});

test("it should apply the bordered variant on the table wrapper", () => {
  const wrapper = mountDataTable({
    props: { rows, columns, variant: "bordered" },
  });

  expect(
    wrapper.find('[role="table"]').element.parentElement?.className,
  ).toContain("ring-1");
});

test("it should emit update:sorting when a sortable header is clicked", async () => {
  const wrapper = mountDataTable({
    props: { rows, columns },
  });

  await wrapper.find('[role="columnheader"] button').trigger("click");

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

  expect(
    wrapper.find('[role="columnheader"][aria-sort]').attributes("aria-sort"),
  ).toBe("descending");
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

  expect(wrapper.find('[role="table"]').attributes("aria-busy")).toBe("true");
});

test("it should emit a replaced selection in single mode", async () => {
  const wrapper = mountDataTable({
    props: {
      rows,
      columns,
      selection: ["1"],
      selectionMode: "single",
      getRowId: (row: User) => row.id,
    },
  });

  expect(
    wrapper
      .find('input[type="checkbox"][aria-label="Select all rows"]')
      .exists(),
  ).toBe(false);

  const radios = wrapper.findAll(
    'input[type="radio"][aria-label="Select row"]',
  );

  await radios[1]?.setValue(true);

  expect(wrapper.emitted("update:selection")?.[0]).toEqual([["2"]]);
});

const filterColumns: DataTableColumn<User>[] = [
  { id: "name", header: "Name", cell: (row) => row.name },
  {
    id: "role",
    header: "Role",
    cell: (row) => row.role,
    filters: [
      { label: "Engineer", value: "Engineer" },
      { label: "Researcher", value: "Researcher" },
    ],
  },
];

test("it should emit update:filters when a column filter is applied", async () => {
  const wrapper = mountDataTable({
    attachTo: document.body,
    props: { rows, filters: {}, columns: filterColumns },
  });

  await wrapper.get('[aria-label="Filter column"]').trigger("click");
  await flushPromises();

  const option = document.body.querySelector(
    'input[type="checkbox"]',
  ) as null | HTMLInputElement;

  option?.click();
  await flushPromises();

  const ok = Array.from(document.body.querySelectorAll("button")).find(
    (button) => button.textContent?.trim() === "OK",
  );

  ok?.click();
  await flushPromises();

  expect(wrapper.emitted("update:filters")?.[0]).toEqual([
    { role: ["Engineer"] },
  ]);
});

test("it should hide non-matching rows when a client filter is set", () => {
  const wrapper = mountDataTable({
    props: {
      rows,
      columns: filterColumns,
      filters: { role: ["Engineer"] },
    },
  });

  expect(wrapper.text()).toContain("Ada Lovelace");
  expect(wrapper.text()).not.toContain("Alan Turing");
});

test("it should keep server-paged rows unfiltered locally", () => {
  const wrapper = mountDataTable({
    props: {
      rows,
      page: 1,
      pageCount: 2,
      columns: filterColumns,
      filters: { role: ["Engineer"] },
    },
  });

  expect(wrapper.text()).toContain("Alan Turing");
  expect(wrapper.text()).toContain("Ada Lovelace");
});

test("it should pin a sticky start column", () => {
  const wrapper = mountDataTable({
    props: {
      rows,
      columns: [
        {
          id: "name",
          width: 120,
          header: "Name",
          sticky: "start",
          cell: (row: User) => row.name,
        },
        { id: "role", header: "Role", cell: (row: User) => row.role },
      ],
    },
  });

  const nameHeader = wrapper
    .findAll('[role="columnheader"]')
    .find((header) => header.text().includes("Name"));

  expect((nameHeader?.element as HTMLElement).style.left).toBe("0px");
});

test("it should truncate ellipsis cells", () => {
  const wrapper = mountDataTable({
    props: {
      rows,
      columns: [
        {
          id: "name",
          header: "Name",
          ellipsis: true,
          cell: (row: User) => row.name,
        },
      ],
    },
  });

  expect(wrapper.get(".text-ellipsis").text()).toBe("Ada Lovelace");
});

test("it should hide columns listed in hiddenColumns", () => {
  const wrapper = mountDataTable({
    props: { rows, columns, hiddenColumns: ["role"] },
  });

  expect(wrapper.text()).toContain("Name");
  expect(wrapper.text()).not.toContain("Role");
  expect(wrapper.text()).not.toContain("Engineer");
});

test("it should emit update:hiddenColumns from the columns menu", async () => {
  const wrapper = mountDataTable({
    attachTo: document.body,
    props: { rows, columns, hiddenColumns: [] },
  });

  await wrapper.get('[aria-haspopup="menu"]').trigger("click");
  await flushPromises();

  const option = Array.from(
    document.body.querySelectorAll('input[type="checkbox"]'),
  ).find((input) => {
    return (input.closest("div")?.parentElement?.textContent ?? "").includes(
      "Role",
    );
  }) as undefined | HTMLInputElement;

  option?.click();
  await flushPromises();

  expect(wrapper.emitted("update:hiddenColumns")?.[0]).toEqual([["role"]]);
});

test("it should emit update:expanded when a row is expanded", async () => {
  const wrapper = mountDataTable({
    slots: {
      expanded: ({ row }: { row: User }) => `Detail ${row.name}`,
    },
    props: {
      rows,
      columns,
      expanded: [],
      getRowId: (row: User) => row.id,
    },
  });

  await wrapper.get('[aria-label="Expand row"]').trigger("click");

  expect(wrapper.emitted("update:expanded")?.[0]).toEqual([["1"]]);
});

test("it should render expanded slot content", () => {
  const wrapper = mountDataTable({
    slots: {
      expanded: ({ row }: { row: User }) => `Detail ${row.name}`,
    },
    props: {
      rows,
      columns,
      expanded: ["1"],
      getRowId: (row: User) => row.id,
    },
  });

  expect(wrapper.text()).toContain("Detail Ada Lovelace");
});

test("it should render a summary footer", () => {
  const wrapper = mountDataTable({
    props: {
      rows,
      columns: [
        { id: "name", header: "Name", cell: (row: User) => row.name },
        {
          id: "role",
          header: "Role",
          cell: (row: User) => row.role,
          summary: (items: User[]) => `${items.length} roles`,
        },
      ],
    },
  });

  expect(wrapper.text()).toContain("2 roles");
});

test("it should render accessor text when cell is omitted", () => {
  const wrapper = mountDataTable({
    props: { rows, columns: [{ id: "name", header: "Name" }] },
  });

  expect(wrapper.text()).toContain("Ada Lovelace");
});

test("it should let an item slot override the column cell", () => {
  const wrapper = mountDataTable({
    slots: {
      "item.name": ({ row }: { row: User }) => `Slot ${row.name}`,
    },
    props: {
      rows,
      columns: [
        {
          id: "name",
          header: "Name",
          cell: (row: User) => `Cell ${row.name}`,
        },
      ],
    },
  });

  expect(wrapper.text()).toContain("Slot Ada Lovelace");
  expect(wrapper.text()).not.toContain("Cell Ada Lovelace");
});
