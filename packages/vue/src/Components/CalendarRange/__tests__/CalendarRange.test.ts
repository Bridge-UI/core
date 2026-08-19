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
  expect(
    document.body.querySelectorAll('[aria-label="Select month"]'),
  ).toHaveLength(1);
  expect(
    document.body.querySelectorAll('[aria-label="Select end month"]'),
  ).toHaveLength(1);
});

test("it should keep end month one month ahead of start", () => {
  mountCalendarRange({
    props: {
      onViewDateChange: () => {},
      viewDate: new Date(2021, 4, 1),
    },
  });

  expect(
    document.body.querySelector('[aria-label="Select month"]')?.textContent,
  ).toContain("May");
  expect(
    document.body.querySelector('[aria-label="Select end month"]')?.textContent,
  ).toContain("June");
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

test("it should highlight the start month when opening from the end month selector", async () => {
  mountCalendarRange({
    props: {
      onViewDateChange: () => {},
      viewDate: new Date(2021, 4, 1),
    },
  });

  document.body
    .querySelector('[aria-label="Select end month"]')
    ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(
    document.body.querySelector('[aria-label="Select month"]'),
  ).not.toBeNull();
  expect(
    document.body.querySelector('[aria-label="Select end month"]'),
  ).not.toBeNull();

  const monthButtons = Array.from(
    document.body.querySelectorAll("button[aria-pressed]"),
  );
  const june = monthButtons.find((node) =>
    /june/i.test(node.textContent ?? ""),
  );
  const may = monthButtons.find((node) => /may/i.test(node.textContent ?? ""));

  expect(may?.getAttribute("aria-pressed")).toBe("true");
  expect(june?.getAttribute("aria-pressed")).toBe("false");
});

test("it should apply the selected month to the start calendar from either selector", async () => {
  const onViewDateChange = vi.fn();

  mountCalendarRange({
    props: {
      onViewDateChange,
      viewDate: new Date(2021, 4, 1),
    },
  });

  document.body
    .querySelector('[aria-label="Select end month"]')
    ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  const august = Array.from(document.body.querySelectorAll("button")).find(
    (node) => /august/i.test(node.textContent ?? ""),
  );

  august?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(onViewDateChange).toHaveBeenCalled();
  const next = onViewDateChange.mock.calls.at(-1)?.[0] as Date;
  expect(next.getMonth()).toBe(7);
});

test("it should keep end month over the end calendar when horizontal", () => {
  mountCalendarRange({
    props: {
      orientation: "horizontal",
      onViewDateChange: () => {},
      viewDate: new Date(2021, 4, 1),
    },
  });

  expect(document.body.querySelector('[role="separator"]')).not.toBeNull();
  expect(
    document.body.querySelector('[aria-label="Select end month"]'),
  ).not.toBeNull();
});

test("it should move end month below the start panel when vertical", () => {
  const wrapper = mountCalendarRange({
    props: {
      orientation: "vertical",
      onViewDateChange: () => {},
      viewDate: new Date(2021, 4, 1),
    },
  });

  const header = wrapper.element.firstElementChild;
  expect(header?.querySelector('[aria-label="Select end month"]')).toBeNull();
  expect(
    document.body.querySelectorAll('[aria-label="Select end month"]'),
  ).toHaveLength(1);
});

test("it should not change month when selecting an outside day on the start panel", async () => {
  mountCalendarRange();

  document.body
    .querySelector('[aria-label="Select year"]')
    ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  Array.from(document.body.querySelectorAll("button"))
    .find((node) => node.textContent === "2021")
    ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  Array.from(document.body.querySelectorAll("button"))
    .find((node) => /may/i.test(node.textContent ?? ""))
    ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(
    document.body
      .querySelector('[aria-label="Select month"]')
      ?.textContent?.toLowerCase(),
  ).toContain("may");

  const aprilThirtieth = Array.from(
    document.body.querySelectorAll("button"),
  ).find(
    (node) =>
      node.textContent === "30" && node.className.includes("text-dark-400"),
  );

  expect(aprilThirtieth).toBeTruthy();
  aprilThirtieth?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(
    document.body
      .querySelector('[aria-label="Select month"]')
      ?.textContent?.toLowerCase(),
  ).toContain("may");
  expect(
    document.body
      .querySelector('[aria-label="Select end month"]')
      ?.textContent?.toLowerCase(),
  ).toContain("june");
});
