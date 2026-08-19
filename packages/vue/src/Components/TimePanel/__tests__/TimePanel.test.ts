// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { TimePanel } from "@/Components/TimePanel";

test("it should render hour and minute columns", () => {
  const wrapper = mount(TimePanel, {
    props: { value: new Date(2021, 4, 21, 14, 30) },
  });

  expect(wrapper.findAll("button").length).toBeGreaterThan(24);
});

test("it should emit change when an hour is selected", async () => {
  const wrapper = mount(TimePanel, {
    props: { value: new Date(2021, 4, 21, 14, 30) },
  });

  const hour = wrapper.find('button[aria-label="Hour 15"]');

  await hour.trigger("click");

  expect(wrapper.emitted("change")).toBeTruthy();
});

test("it should mark the selected hour", () => {
  const wrapper = mount(TimePanel, {
    props: { value: new Date(2021, 4, 21, 14, 30) },
  });

  const hour = wrapper.find('button[aria-label="Hour 14"]');

  expect(hour.attributes("aria-pressed")).toBe("true");
});

test("it should render AM/PM when ampm is set", () => {
  const wrapper = mount(TimePanel, {
    props: {
      ampm: true,
      value: new Date(2021, 4, 21, 14, 30),
    },
  });

  expect(wrapper.text()).toContain("AM");
  expect(wrapper.text()).toContain("PM");
});

test("it should render seconds when showSeconds is set", () => {
  const withoutSeconds = mount(TimePanel, {
    props: { value: new Date(2021, 4, 21, 14, 30, 45) },
  });

  const withSeconds = mount(TimePanel, {
    props: {
      showSeconds: true,
      value: new Date(2021, 4, 21, 14, 30, 45),
    },
  });

  expect(withSeconds.findAll("button").length).toBe(
    withoutSeconds.findAll("button").length + 60,
  );
});
