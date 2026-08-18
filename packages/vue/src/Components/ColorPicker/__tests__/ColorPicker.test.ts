// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { ColorPicker } from "@/Components/ColorPicker";

test("it should render the saturation area", () => {
  const wrapper = mount(ColorPicker, {
    props: { defaultValue: "#ea1212" },
  });

  expect(
    wrapper.find('[aria-label="Saturation and brightness"]').exists(),
  ).toBe(true);
  expect(wrapper.find('[aria-label="Hue"]').exists()).toBe(true);
});

test("it should show the formatted value", () => {
  const wrapper = mount(ColorPicker, {
    props: { defaultValue: "#ea1212" },
  });

  expect(wrapper.text()).toContain("#ea1212");
});

test("it should serialize rgba when format is rgba", () => {
  const wrapper = mount(ColorPicker, {
    props: { format: "rgba", defaultValue: "#ea1212" },
  });

  expect(wrapper.text()).toContain("rgba(234, 18, 18, 1)");
});

test("it should commit a preset swatch immediately without footer", async () => {
  const wrapper = mount(ColorPicker, {
    props: {
      defaultValue: "#000000",
      swatches: ["#ea1212", "#2563eb"],
    },
  });

  const swatch = wrapper.find('[aria-label="#ea1212"]');

  await swatch.trigger("click");

  expect(wrapper.emitted("change")?.[0]).toEqual(["#ea1212"]);
});

test("it should show footer actions when showFooter is set", () => {
  const wrapper = mount(ColorPicker, { props: { showFooter: true } });

  expect(wrapper.text()).toContain("Cancel");
  expect(wrapper.text()).toContain("Apply");
});

test("it should commit draft value on Apply", async () => {
  const wrapper = mount(ColorPicker, {
    props: {
      showFooter: true,
      swatches: ["#ea1212"],
      defaultValue: "#000000",
    },
  });

  await wrapper.find('[aria-label="#ea1212"]').trigger("click");
  expect(wrapper.emitted("change")).toBeFalsy();

  const apply = wrapper
    .findAll("button")
    .find((node) => node.text() === "Apply");

  await apply?.trigger("click");
  expect(wrapper.emitted("change")?.[0]).toEqual(["#ea1212"]);
});
