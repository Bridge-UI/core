// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/Table";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
});

const mountedWrappers: Array<ReturnType<typeof mount<typeof Table>>> = [];

function sampleSlots(numeric = false) {
  return {
    default: () => [
      h(TableCaption, null, { default: () => "Team roster" }),
      h(TableHeader, null, {
        default: () =>
          h(TableRow, null, {
            default: () => [
              h(TableHead, null, { default: () => "Name" }),
              h(TableHead, { numeric }, { default: () => "Score" }),
            ],
          }),
      }),
      h(TableBody, null, {
        default: () => [
          h(TableRow, null, {
            default: () => [
              h(TableCell, null, { default: () => "Ada Lovelace" }),
              h(TableCell, { numeric }, { default: () => "12" }),
            ],
          }),
          h(TableRow, null, {
            default: () => [
              h(TableCell, null, { default: () => "Alan Turing" }),
              h(TableCell, { numeric }, { default: () => "9" }),
            ],
          }),
        ],
      }),
      h(TableFooter, null, {
        default: () =>
          h(TableRow, null, {
            default: () => [
              h(TableCell, null, { default: () => "Total" }),
              h(TableCell, { numeric }, { default: () => "21" }),
            ],
          }),
      }),
    ],
  };
}

function mountTable(options: Parameters<typeof mount<typeof Table>>[1] = {}) {
  const wrapper = mount(Table, {
    ...options,
    slots: options.slots ?? sampleSlots(),
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render a semantic table with caption and cells", () => {
  const wrapper = mountTable();

  expect(wrapper.text()).toContain("Total");
  expect(wrapper.text()).toContain("Alan Turing");
  expect(wrapper.text()).toContain("Team roster");
  expect(wrapper.text()).toContain("Ada Lovelace");
  expect(wrapper.find("table").exists()).toBe(true);
  expect(wrapper.find("th").attributes("scope")).toBe("col");
});

test("it should apply the bordered variant on the wrapper", () => {
  const wrapper = mountTable({ props: { variant: "bordered" } });

  expect(wrapper.find("div").classes()).toContain("ring-1");
});

test("it should apply the ghost variant on the wrapper", () => {
  const wrapper = mountTable({ props: { variant: "ghost" } });

  expect(wrapper.find("div").classes()).not.toContain("ring-1");
  expect(wrapper.find("div").classes()).toContain("rounded-lg");
  expect(wrapper.find("th").classes()).toContain("after:w-px");
});

test("it should apply rounded none on the wrapper", () => {
  const wrapper = mountTable({ props: { rounded: "none" } });

  expect(wrapper.find("div").classes()).toContain("rounded-none");
  expect(wrapper.find("div").classes()).not.toContain("rounded-lg");
});

test("it should stripe and hover body rows only", () => {
  const wrapper = mountTable({ props: { striped: true, hoverable: true } });
  const bodyRow = wrapper.find("tbody tr");
  const headerRow = wrapper.find("thead tr");
  const footerRow = wrapper.find("tfoot tr");

  expect(
    bodyRow.classes().some((name) => name.includes("even:bg-dark-100")),
  ).toBe(true);
  expect(
    bodyRow.classes().some((name) => name.includes("hover:bg-dark-500")),
  ).toBe(true);
  expect(
    headerRow.classes().some((name) => name.includes("even:bg-dark-50")),
  ).toBe(false);
  expect(
    footerRow.classes().some((name) => name.includes("hover:bg-dark-500")),
  ).toBe(false);
});

test("it should stick header cells when stickyHeader is set", () => {
  const wrapper = mountTable({ props: { stickyHeader: true } });

  expect(wrapper.find("th").classes()).toContain("sticky");
  expect(wrapper.find("td").classes()).not.toContain("sticky");
  expect(wrapper.find("th").classes()).toContain("bg-dark-100");
  expect(wrapper.find("thead").classes()).toContain("z-20");
  expect(wrapper.find("table").classes()).toContain("border-separate");
  expect(wrapper.find("div").classes()).not.toContain("overflow-x-auto");
});

test("it should align numeric cells to the end with tabular nums", () => {
  const wrapper = mountTable({ slots: sampleSlots(true) });
  const numericHead = wrapper.findAll("th")[1];
  const numericCell = wrapper.find("tbody td:last-child");

  expect(numericCell.classes()).toContain("text-end");
  expect(numericHead?.classes()).toContain("text-end");
  expect(numericCell.classes()).toContain("tabular-nums");
  expect(numericHead?.classes()).toContain("tabular-nums");
});

test("it should keep the table full width by default", () => {
  const wrapper = mountTable();

  expect(wrapper.find("table").classes()).toContain("w-max");
  expect(wrapper.find("div").classes()).toContain("overflow-x-auto");
  expect(wrapper.find("table").classes()).toContain("sm:min-w-full");
});

test("it should omit full width when full is false", () => {
  const wrapper = mountTable({ props: { full: false } });

  expect(wrapper.find("table").classes()).not.toContain("w-max");
  expect(wrapper.find("table").classes()).not.toContain("sm:min-w-full");
});
