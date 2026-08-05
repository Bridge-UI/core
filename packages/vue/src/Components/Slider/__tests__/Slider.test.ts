// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core";

// ** Local Imports
import { Slider } from "@/Components/Slider";

test("it should render a slider thumb with role slider", () => {
  const wrapper = mount(Slider, {
    props: { label: "Volume" },
  });

  expect(wrapper.find('[role="slider"]').exists()).toBe(true);
});

test("it should render label corner and description chrome", () => {
  const wrapper = mount(Slider, {
    props: {
      corner: "%",
      label: "Opacity",
      description: "Adjust transparency",
    },
  });

  expect(wrapper.text()).toContain("Opacity");
  expect(wrapper.text()).toContain("%");
  expect(wrapper.text()).toContain("Adjust transparency");
});

test("it should render two thumbs when range is enabled", () => {
  const wrapper = mount(Slider, {
    props: { range: true, defaultValue: [20, 80] },
  });

  expect(wrapper.findAll('[role="slider"]')).toHaveLength(2);
});

test("it should emit change when using keyboard arrows", async () => {
  const wrapper = mount(Slider, {
    props: { modelValue: 40, label: "Volume" },
  });

  await wrapper
    .find('[role="slider"]')
    .trigger("keydown", { key: "ArrowRight" });

  expect(wrapper.emitted("change")).toEqual([[41]]);
});

test("it should respect min max and step on keyboard", async () => {
  const wrapper = mount(Slider, {
    props: {
      min: 0,
      max: 100,
      step: 10,
      modelValue: 20,
      label: "Volume",
    },
  });

  await wrapper
    .find('[role="slider"]')
    .trigger("keydown", { key: "ArrowRight" });

  expect(wrapper.emitted("change")).toEqual([[30]]);
});

test("it should hide tooltip when showTooltip is false", async () => {
  const wrapper = mount(Slider, {
    attachTo: document.body,
    props: { label: "Volume", defaultValue: 50, showTooltip: false },
  });

  await wrapper.find('[role="slider"]').trigger("focus");

  expect(document.body.querySelector('[role="tooltip"]')).toBeNull();

  wrapper.unmount();
  resetLayerStackForTests();
});

test("it should render stop labels", () => {
  const wrapper = mount(Slider, {
    props: {
      showStops: true,
      label: "Rating",
      stops: [
        { value: 0, label: "Low" },
        { value: 100, label: "High" },
      ],
    },
  });

  expect(wrapper.text()).toContain("Low");
  expect(wrapper.text()).toContain("High");
});

test("it should show error message when invalid", () => {
  const wrapper = mount(Slider, {
    props: {
      error: true,
      label: "Volume",
      errorMessage: "Value is required",
    },
  });

  expect(wrapper.text()).toContain("Value is required");
});

test("it should render start and end slots from BaseField", () => {
  const wrapper = mount(Slider, {
    props: { label: "Volume" },
    slots: {
      end: "<span data-testid='slider-end'>%</span>",
      start: "<span data-testid='slider-start'>$</span>",
    },
  });

  expect(wrapper.find("[data-testid='slider-start']").exists()).toBe(true);
  expect(wrapper.find("[data-testid='slider-end']").exists()).toBe(true);
});

test("it should emit update:modelValue when value changes", async () => {
  const wrapper = mount(Slider, {
    props: { modelValue: 10, label: "Volume" },
  });

  await wrapper
    .find('[role="slider"]')
    .trigger("keydown", { key: "ArrowRight" });

  expect(wrapper.emitted("update:modelValue")).toEqual([[11]]);
});
