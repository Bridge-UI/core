// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { CalendarYear } from "@/Components/CalendarYear";

test("it should render a page of years", () => {
  const wrapper = mount(CalendarYear, {
    props: { pageSize: 15, modelValue: 2021 },
  });

  expect(wrapper.findAll("button")).toHaveLength(15);
});

test("it should emit change when a year is selected", async () => {
  const wrapper = mount(CalendarYear, { props: { modelValue: 2021 } });

  const year = wrapper.findAll("button").find((node) => node.text() === "2020");

  await year?.trigger("click");

  expect(wrapper.emitted("change")?.[0]?.[0]).toBe(2020);
  expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toBe(2020);
});

test("it should mark the selected year", () => {
  const wrapper = mount(CalendarYear, { props: { modelValue: 2021 } });

  const year = wrapper.findAll("button").find((node) => node.text() === "2021");

  expect(year?.attributes("aria-pressed")).toBe("true");
});
