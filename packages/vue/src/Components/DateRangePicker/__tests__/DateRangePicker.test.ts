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
