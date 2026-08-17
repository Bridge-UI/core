// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { DateTimeRangePicker } from "@/Components/DateTimeRangePicker";

test("it should render the calendar and time panels", () => {
  const wrapper = mount(DateTimeRangePicker, {
    props: {
      defaultValue: [
        new Date(2021, 4, 21, 14, 30),
        new Date(2021, 4, 25, 17, 0),
      ],
    },
  });

  expect(wrapper.find('[aria-label="Select year"]').exists()).toBe(true);
  expect(wrapper.findAll("button").length).toBeGreaterThan(48);
  expect(wrapper.find(".min-w-72").exists()).toBe(true);
});

test("it should commit immediately without footer", async () => {
  const wrapper = mount(DateTimeRangePicker, {
    props: {
      defaultValue: [
        new Date(2021, 4, 1, 14, 30),
        new Date(2021, 4, 10, 17, 0),
      ],
    },
  });

  const day = wrapper.findAll("button").find((node) => node.text() === "21");

  await day?.trigger("click");

  expect(wrapper.emitted("change")).toBeTruthy();
});

test("it should show footer actions when showFooter is set", () => {
  const wrapper = mount(DateTimeRangePicker, { props: { showFooter: true } });

  expect(wrapper.text()).toContain("Cancel");
  expect(wrapper.text()).toContain("Apply");
});

test("it should commit draft value on Apply", async () => {
  const wrapper = mount(DateTimeRangePicker, {
    props: {
      showFooter: true,
      defaultValue: [
        new Date(2021, 4, 1, 14, 30),
        new Date(2021, 4, 10, 17, 0),
      ],
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
