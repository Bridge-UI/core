// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { CalendarMonth } from "@/Components/CalendarMonth";

test("it should render twelve months", () => {
  const wrapper = mount(CalendarMonth, { props: { year: 2021 } });

  expect(wrapper.findAll("button")).toHaveLength(12);
});

test("it should emit change when a month is selected", async () => {
  const wrapper = mount(CalendarMonth, { props: { year: 2021 } });

  const may = wrapper
    .findAll("button")
    .find((node) => /may/i.test(node.text()));

  await may?.trigger("click");

  expect(wrapper.emitted("change")?.[0]?.[0]).toBe(4);
});

test("it should mark the selected month", () => {
  const wrapper = mount(CalendarMonth, { props: { value: 4, year: 2021 } });

  const may = wrapper
    .findAll("button")
    .find((node) => /may/i.test(node.text()));

  expect(may?.attributes("aria-pressed")).toBe("true");
});
