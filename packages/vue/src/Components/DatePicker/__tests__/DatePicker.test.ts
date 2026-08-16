// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { DatePicker } from "@/Components/DatePicker";

test("it should render the calendar", () => {
  const wrapper = mount(DatePicker, {
    props: { defaultValue: new Date(2021, 4, 21) },
  });

  expect(wrapper.find('[aria-label="Select year"]').exists()).toBe(true);
});

test("it should commit immediately without footer", async () => {
  const wrapper = mount(DatePicker, {
    props: { defaultValue: new Date(2021, 4, 1) },
  });

  const day = wrapper.findAll("button").find((node) => node.text() === "21");

  await day?.trigger("click");

  expect(wrapper.emitted("change")).toBeTruthy();
});

test("it should show footer actions when showFooter is set", () => {
  const wrapper = mount(DatePicker, { props: { showFooter: true } });

  expect(wrapper.text()).toContain("Cancel");
  expect(wrapper.text()).toContain("Apply");
});

test("it should commit draft value on Apply", async () => {
  const wrapper = mount(DatePicker, {
    props: {
      showFooter: true,
      defaultValue: new Date(2021, 4, 1),
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

test("it should render a custom footer slot and commit on apply", async () => {
  const wrapper = mount(DatePicker, {
    props: {
      showFooter: true,
      defaultValue: new Date(2021, 4, 1),
    },
    slots: {
      footer: (props: { apply: () => void }) => {
        return h("button", { type: "button", onClick: props.apply }, "Save");
      },
    },
  });

  expect(wrapper.text()).not.toContain("Apply");

  const day = wrapper.findAll("button").find((node) => node.text() === "21");

  await day?.trigger("click");
  expect(wrapper.emitted("change")).toBeFalsy();

  const save = wrapper.findAll("button").find((node) => node.text() === "Save");

  await save?.trigger("click");
  expect(wrapper.emitted("change")).toBeTruthy();
});
