// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { CalendarRange } from "@/Components/CalendarRange";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
  document.body.innerHTML = "";
});

const mountedWrappers: Array<ReturnType<typeof mount>> = [];

function mountCalendarRange(optionsArg: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(CalendarRange, {
    attachTo: document.body,
    ...optionsArg,
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render a shared year selector and dual date panels", () => {
  mountCalendarRange({
    props: {
      defaultValue: [new Date(2021, 4, 1), new Date(2021, 4, 10)],
    },
  });

  expect(
    document.body.querySelectorAll('[aria-label="Select year"]'),
  ).toHaveLength(1);
});

test("it should keep end month one month ahead of start", () => {
  mountCalendarRange({
    props: {
      onViewDateChange: () => {},
      viewDate: new Date(2021, 4, 1),
    },
  });

  expect(document.body.textContent).toContain("May");
  expect(document.body.textContent).toContain("June");
});

test("it should emit change when a range is selected", async () => {
  const onChange = vi.fn();

  mountCalendarRange({
    props: {
      onChange,
      onViewDateChange: () => {},
      viewDate: new Date(2021, 4, 1),
    },
  });

  const days = Array.from(document.body.querySelectorAll("button")).filter(
    (node) => node.textContent === "10",
  );

  days[0]?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  const days15 = Array.from(document.body.querySelectorAll("button")).filter(
    (node) => node.textContent === "15",
  );

  days15[0]?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onChange).toHaveBeenCalled();
});
