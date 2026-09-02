// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { DataTablePagination } from "@/Components/DataTable";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
});

const mountedWrappers: Array<
  ReturnType<typeof mount<typeof DataTablePagination>>
> = [];

function mountDataTablePagination(
  options: Parameters<typeof mount<typeof DataTablePagination>>[1] = {},
) {
  const wrapper = mount(DataTablePagination, options);

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render first and last controls without page numbers", async () => {
  const wrapper = mountDataTablePagination({
    props: { count: 7, modelValue: 1 },
  });

  expect(wrapper.find("button[aria-label^='Page ']").exists()).toBe(false);
  expect(
    wrapper.find("button[aria-label='First page']").attributes("disabled"),
  ).toBeDefined();
  expect(
    wrapper.find("button[aria-label='Last page']").attributes("disabled"),
  ).toBeUndefined();

  await wrapper.find("button[aria-label='Last page']").trigger("click");

  expect(wrapper.emitted("change")?.[0]).toEqual([7]);
  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([7]);
});
