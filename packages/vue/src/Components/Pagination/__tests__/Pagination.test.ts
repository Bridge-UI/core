// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Pagination } from "@/Components/Pagination";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
});

const mountedWrappers: Array<ReturnType<typeof mount<typeof Pagination>>> = [];

function mountPagination(
  options: Parameters<typeof mount<typeof Pagination>>[1] = {},
) {
  const wrapper = mount(Pagination, options);

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render numbered pages with a current page", () => {
  const wrapper = mountPagination({
    props: { count: 5, modelValue: 2 },
    attrs: { "aria-label": "Pagination" },
  });

  expect(wrapper.find("nav[aria-label='Pagination']").exists()).toBe(true);
  expect(wrapper.find("button[aria-label='Page 1']").exists()).toBe(true);
  expect(
    wrapper.find("button[aria-label='Page 2']").attributes("aria-current"),
  ).toBe("page");
});

test("it should emit change and update:modelValue when a page is clicked", async () => {
  const wrapper = mountPagination({
    props: { count: 5, modelValue: 1 },
  });

  await wrapper.find("button[aria-label='Page 3']").trigger("click");

  expect(wrapper.emitted("change")?.[0]).toEqual([3]);
  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([3]);
});

test("it should collapse long ranges with ellipsis", () => {
  const wrapper = mountPagination({
    props: {
      count: 12,
      modelValue: 5,
      siblingCount: 1,
      boundaryCount: 1,
    },
  });

  expect(wrapper.text()).toContain("…");
  expect(wrapper.find("button[aria-label='Page 1']").exists()).toBe(true);
  expect(wrapper.find("button[aria-label='Page 12']").exists()).toBe(true);
  expect(wrapper.find("button[aria-label='Page 2']").exists()).toBe(false);
});

test("it should support simple prev/next mode", async () => {
  const wrapper = mountPagination({
    props: {
      hasNext: true,
      mode: "simple",
      hasPrevious: false,
    },
  });

  expect(wrapper.find("button[aria-label^='Page ']").exists()).toBe(false);

  const previous = wrapper.find("button[aria-label='Previous']");
  const next = wrapper.find("button[aria-label='Next']");

  expect(previous.attributes("disabled")).toBeDefined();

  await next.trigger("click");
  expect(wrapper.emitted("next")).toHaveLength(1);

  await previous.trigger("click");
  expect(wrapper.emitted("previous")).toBeUndefined();
});

test("it should apply visual variants", async () => {
  const wrapper = mountPagination({
    props: { count: 3, modelValue: 1, variant: "outlined" },
  });

  expect(wrapper.find("ul").classes()).toContain("rounded-md");
  expect(wrapper.find("li").classes()).toContain("contents");
  expect(wrapper.find("button[aria-label='Previous']").classes()).toContain(
    "ml-0",
  );
  expect(wrapper.find("button[aria-label='Next']").classes()).toContain(
    "-ml-px",
  );
  expect(wrapper.find("button[aria-label='Next']").classes()).toContain(
    "rounded-r-md",
  );
  expect(wrapper.find("button[aria-label='Previous']").classes()).toContain(
    "rounded-l-md",
  );
  expect(wrapper.find("button[aria-label='Previous']").classes()).toContain(
    "cursor-pointer",
  );

  await wrapper.setProps({ variant: "ghost" });
  expect(wrapper.find("ul").classes()).toContain("gap-1");
  expect(wrapper.find("button[aria-label='Next']").classes()).toContain("w-9");

  await wrapper.setProps({ variant: "text" });
  expect(wrapper.find("ul").classes()).toContain("border-t");
  expect(wrapper.find("button[aria-label='Next']").classes()).toContain(
    "border-t-2",
  );
});
