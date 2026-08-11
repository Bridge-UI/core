// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { CalendarDate } from "@/Components/CalendarDate";

test("it should render weekday labels by default", () => {
  const wrapper = mount(CalendarDate, {
    props: { viewDate: new Date(2021, 4, 1) },
  });

  expect(wrapper.text().toLowerCase()).toMatch(/sun/);
});

test("it should hide weekdays when hideWeekdays is set", () => {
  const wrapper = mount(CalendarDate, {
    props: { hideWeekdays: true, viewDate: new Date(2021, 4, 1) },
  });

  expect(wrapper.text().toLowerCase()).not.toMatch(/sun/);
});

test("it should hide outside days when hideOutsideDays is set", () => {
  const wrapper = mount(CalendarDate, {
    props: { hideOutsideDays: true, viewDate: new Date(2021, 4, 1) },
  });

  const darkOutside = wrapper
    .findAll("button")
    .filter((node) => node.classes().includes("text-dark-400"));

  expect(darkOutside).toHaveLength(0);
  expect(wrapper.findAll("button").some((node) => node.text() === "1")).toBe(
    true,
  );
  expect(wrapper.findAll("button").some((node) => node.text() === "31")).toBe(
    true,
  );
});

test("it should emit change when a day is selected", async () => {
  const wrapper = mount(CalendarDate, {
    props: { viewDate: new Date(2021, 4, 1) },
  });

  const day = wrapper.findAll("button").find((node) => node.text() === "21");

  await day?.trigger("click");

  const emitted = wrapper.emitted("change");

  expect(emitted).toBeTruthy();
  const value = emitted?.[0]?.[0] as Date;

  expect(value.getFullYear()).toBe(2021);
  expect(value.getMonth()).toBe(4);
  expect(value.getDate()).toBe(21);
});

test("it should mark the selected day", () => {
  const wrapper = mount(CalendarDate, {
    props: {
      value: new Date(2021, 4, 21),
      viewDate: new Date(2021, 4, 1),
    },
  });

  const day = wrapper.findAll("button").find((node) => node.text() === "21");

  expect(day?.attributes("aria-pressed")).toBe("true");
});

test("it should disable dates before minDate", () => {
  const wrapper = mount(CalendarDate, {
    props: {
      viewDate: new Date(2021, 4, 1),
      minDate: new Date(2021, 4, 20),
    },
  });

  const before = wrapper.findAll("button").find((node) => node.text() === "10");
  const allowed = wrapper
    .findAll("button")
    .find((node) => node.text() === "21");

  expect(before?.attributes("disabled")).toBeDefined();
  expect(allowed?.attributes("disabled")).toBeUndefined();
});
