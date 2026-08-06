// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { DateTimePicker } from "@/Components/DateTimePicker";

test("it should render the calendar and time panel", () => {
  const wrapper = mount(DateTimePicker, {
    props: { defaultValue: new Date(2021, 4, 21, 14, 30) },
  });

  expect(wrapper.find('[aria-label="Select year"]').exists()).toBe(true);
  expect(wrapper.findAll("button").length).toBeGreaterThan(24);
});

test("it should commit immediately without footer", async () => {
  const wrapper = mount(DateTimePicker, {
    props: { defaultValue: new Date(2021, 4, 1, 14, 30) },
  });

  const day = wrapper.findAll("button").find((node) => node.text() === "21");

  await day?.trigger("click");

  expect(wrapper.emitted("change")).toBeTruthy();
});

test("it should show footer actions when showFooter is set", () => {
  const wrapper = mount(DateTimePicker, { props: { showFooter: true } });

  expect(wrapper.text()).toContain("Cancel");
  expect(wrapper.text()).toContain("Apply");
});

test("it should commit draft value on Apply", async () => {
  const wrapper = mount(DateTimePicker, {
    props: {
      showFooter: true,
      defaultValue: new Date(2021, 4, 1, 14, 30),
    },
  });

  const day = wrapper.findAll("button").find((node) => node.text() === "21");

  await day?.trigger("click");
  expect(wrapper.emitted("change")).toBeFalsy();

  const apply = wrapper
    .findAll("button")
    .find((node) => node.text() === "Apply");

  await apply?.trigger("click");
  expect(wrapper.emitted("change")).toBeTruthy();
});
