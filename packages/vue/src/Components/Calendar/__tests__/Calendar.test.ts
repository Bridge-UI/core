// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Calendar } from "@/Components/Calendar";

test("it should render year and month selectors", () => {
  const wrapper = mount(Calendar, {
    props: { viewDate: new Date(2021, 4, 1) },
  });

  expect(wrapper.find('[aria-label="Select year"]').exists()).toBe(true);
  expect(wrapper.find('[aria-label="Select month"]').exists()).toBe(true);
});

test("it should open the month panel", async () => {
  const wrapper = mount(Calendar, {
    props: { viewDate: new Date(2021, 4, 1) },
  });

  await wrapper.find('[aria-label="Select month"]').trigger("click");

  expect(
    wrapper.findAll("button").some((node) => /january/i.test(node.text())),
  ).toBe(true);
});

test("it should open the year panel", async () => {
  const wrapper = mount(Calendar, {
    props: { viewDate: new Date(2021, 4, 1) },
  });

  await wrapper.find('[aria-label="Select year"]').trigger("click");

  expect(wrapper.findAll("button").some((node) => node.text() === "2021")).toBe(
    true,
  );
});

test("it should emit change when a day is selected", async () => {
  const wrapper = mount(Calendar, {
    props: { viewDate: new Date(2021, 4, 1) },
  });

  const day = wrapper.findAll("button").find((node) => node.text() === "21");

  await day?.trigger("click");

  expect(wrapper.emitted("change")).toBeTruthy();
});

test("it should hide year selector when hideYears is set", () => {
  const wrapper = mount(Calendar, {
    props: { hideYears: true, viewDate: new Date(2021, 4, 1) },
  });

  expect(wrapper.find('[aria-label="Select year"]').exists()).toBe(false);
});
