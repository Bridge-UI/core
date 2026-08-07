// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { TimeRangePicker } from "@/Components/TimeRangePicker";

test("it should render dual time panels", () => {
  const wrapper = mount(TimeRangePicker, {
    props: {
      defaultValue: [
        new Date(2021, 4, 21, 9, 30),
        new Date(2021, 4, 21, 17, 0),
      ],
    },
  });

  expect(wrapper.findAll("button").length).toBeGreaterThan(48);
});

test("it should commit immediately without footer", async () => {
  const wrapper = mount(TimeRangePicker, {
    props: {
      defaultValue: [
        new Date(2021, 4, 21, 9, 30),
        new Date(2021, 4, 21, 17, 0),
      ],
    },
  });

  const hour = wrapper.findAll("button").find((node) => node.text() === "10");

  await hour?.trigger("click");

  expect(wrapper.emitted("change")).toBeTruthy();
});

test("it should show footer actions when showFooter is set", () => {
  const wrapper = mount(TimeRangePicker, { props: { showFooter: true } });

  expect(wrapper.text()).toContain("Cancel");
  expect(wrapper.text()).toContain("Apply");
});

test("it should commit draft value on Apply", async () => {
  const wrapper = mount(TimeRangePicker, {
    props: {
      showFooter: true,
      defaultValue: [
        new Date(2021, 4, 21, 9, 30),
        new Date(2021, 4, 21, 17, 0),
      ],
    },
  });

  const hour = wrapper.findAll("button").find((node) => node.text() === "10");

  await hour?.trigger("click");
  expect(wrapper.emitted("change")).toBeFalsy();

  const apply = wrapper
    .findAll("button")
    .find((node) => node.text() === "Apply");

  await apply?.trigger("click");
  expect(wrapper.emitted("change")).toBeTruthy();
});
