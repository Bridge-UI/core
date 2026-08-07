// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { TimePicker } from "@/Components/TimePicker";

test("it should render the time panel", () => {
  const wrapper = mount(TimePicker, {
    props: { defaultValue: new Date(2021, 4, 21, 14, 30) },
  });

  expect(wrapper.findAll("button").length).toBeGreaterThan(24);
});

test("it should commit immediately without footer", async () => {
  const wrapper = mount(TimePicker, {
    props: { defaultValue: new Date(2021, 4, 21, 14, 30) },
  });

  const hour = wrapper.findAll("button").find((node) => node.text() === "15");

  await hour?.trigger("click");

  expect(wrapper.emitted("change")).toBeTruthy();
});

test("it should show footer actions when showFooter is set", () => {
  const wrapper = mount(TimePicker, { props: { showFooter: true } });

  expect(wrapper.text()).toContain("Cancel");
  expect(wrapper.text()).toContain("Apply");
});

test("it should commit draft value on Apply", async () => {
  const wrapper = mount(TimePicker, {
    props: {
      showFooter: true,
      defaultValue: new Date(2021, 4, 21, 14, 30),
    },
  });

  const hour = wrapper.findAll("button").find((node) => node.text() === "15");

  await hour?.trigger("click");
  expect(wrapper.emitted("change")).toBeFalsy();

  const apply = wrapper
    .findAll("button")
    .find((node) => node.text() === "Apply");

  await apply?.trigger("click");
  expect(wrapper.emitted("change")).toBeTruthy();
});
