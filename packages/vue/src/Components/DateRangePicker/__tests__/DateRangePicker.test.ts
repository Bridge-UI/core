// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { DateRangePicker } from "@/Components/DateRangePicker";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
  document.body.innerHTML = "";
});

const mountedWrappers: Array<ReturnType<typeof mount>> = [];

function mountDateRangePicker(optionsArg: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(DateRangePicker, {
    attachTo: document.body,
    ...optionsArg,
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render a shared year selector over dual date panels", () => {
  mountDateRangePicker({
    props: {
      defaultValue: [new Date(2021, 4, 1), new Date(2021, 4, 10)],
    },
  });

  expect(
    document.body.querySelectorAll('[aria-label="Select year"]'),
  ).toHaveLength(1);
});

test("it should emit change immediately without footer", async () => {
  const onChange = vi.fn();

  mountDateRangePicker({
    props: { onChange },
  });

  const day = Array.from(document.body.querySelectorAll("button")).find(
    (node) => node.textContent === "15",
  );

  day?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).toHaveBeenCalled();
});

test("it should show footer actions when showFooter is set", () => {
  mountDateRangePicker({
    props: { showFooter: true },
  });

  expect(
    Array.from(document.body.querySelectorAll("button")).some(
      (node) => node.textContent === "Apply",
    ),
  ).toBe(true);
  expect(
    Array.from(document.body.querySelectorAll("button")).some(
      (node) => node.textContent === "Cancel",
    ),
  ).toBe(true);
});

test("it should emit a month range when granularity is month", async () => {
  const onChange = vi.fn();

  mountDateRangePicker({
    props: {
      onChange,
      granularity: "month",
      defaultValue: [new Date(2021, 4, 1), new Date(2021, 5, 1)],
    },
  });

  Array.from(document.body.querySelectorAll("button"))
    .find(
      (node) =>
        !node.getAttribute("aria-label")?.startsWith("Select") &&
        /march/i.test(node.textContent ?? ""),
    )
    ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  Array.from(document.body.querySelectorAll("button"))
    .find(
      (node) =>
        !node.getAttribute("aria-label")?.startsWith("Select") &&
        /june/i.test(node.textContent ?? ""),
    )
    ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  const range = onChange.mock.calls.at(-1)?.[0] as [Date, Date];

  expect(range[0].getDate()).toBe(1);
  expect(range[1].getDate()).toBe(1);
  expect(range[0].getMonth()).toBe(2);
  expect(range[1].getMonth()).toBe(5);
  expect(range[0].getFullYear()).toBe(2021);
  expect(range[1].getFullYear()).toBe(2021);
});

test("it should emit a year range when granularity is year", async () => {
  const onChange = vi.fn();

  mountDateRangePicker({
    props: {
      onChange,
      granularity: "year",
      defaultValue: [new Date(2021, 0, 1), new Date(2022, 0, 1)],
    },
  });

  Array.from(document.body.querySelectorAll("button"))
    .find((node) => node.textContent === "2018")
    ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  Array.from(document.body.querySelectorAll("button"))
    .find((node) => node.textContent === "2021")
    ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  const range = onChange.mock.calls.at(-1)?.[0] as [Date, Date];

  expect(range[0].getDate()).toBe(1);
  expect(range[1].getDate()).toBe(1);
  expect(range[0].getMonth()).toBe(0);
  expect(range[1].getMonth()).toBe(0);
  expect(range[0].getFullYear()).toBe(2018);
  expect(range[1].getFullYear()).toBe(2021);
});
