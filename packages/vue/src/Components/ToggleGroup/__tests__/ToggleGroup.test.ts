// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { h } from "vue";

// ** Core Imports
import type { ToggleGroupValue } from "@bridge-ui/core/Domain";

// ** Local Imports
import { ToggleGroup } from "@/Components/ToggleGroup";
import { ToggleItem } from "@/Components/ToggleItem";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
});

const mountedWrappers: Array<ReturnType<typeof mount<typeof ToggleGroup>>> = [];

function basicToggleSlots() {
  return [
    h(ToggleItem, { value: "react" }, { default: () => "React" }),
    h(ToggleItem, { value: "vue" }, { default: () => "Vue" }),
    h(
      ToggleItem,
      { disabled: true, value: "svelte" },
      { default: () => "Svelte" },
    ),
  ];
}

function mountToggleGroup(
  options: Parameters<typeof mount<typeof ToggleGroup>>[1] = {},
) {
  const wrapper = mount(ToggleGroup, {
    ...options,
    props: {
      "aria-label": "Library",
      ...(options.props ?? {}),
      "onUpdate:modelValue": (value: ToggleGroupValue) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render a radiogroup with selected radio", () => {
  const wrapper = mountToggleGroup({
    props: { modelValue: "react" },
    slots: { default: basicToggleSlots },
  });

  expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true);

  const react = wrapper
    .findAll('[role="radio"]')
    .find((item) => item.text() === "React");
  const vue = wrapper
    .findAll('[role="radio"]')
    .find((item) => item.text() === "Vue");

  expect(react?.attributes("aria-checked")).toBe("true");
  expect(vue?.attributes("aria-checked")).toBe("false");
});

test("it should change selection when a toggle is clicked", async () => {
  const wrapper = mountToggleGroup({
    props: { modelValue: "react" },
    slots: { default: basicToggleSlots },
  });

  const vue = wrapper
    .findAll('[role="radio"]')
    .find((item) => item.text() === "Vue");

  await vue?.trigger("click");

  expect(wrapper.emitted("change")?.[0]).toEqual(["vue"]);
  expect(vue?.attributes("aria-checked")).toBe("true");
});

test("it should not select a disabled toggle", async () => {
  const wrapper = mountToggleGroup({
    props: { modelValue: "react" },
    slots: { default: basicToggleSlots },
  });

  const svelte = wrapper
    .findAll('[role="radio"]')
    .find((item) => item.text() === "Svelte");

  await svelte?.trigger("click");

  expect(wrapper.emitted("change")).toBeUndefined();

  const react = wrapper
    .findAll('[role="radio"]')
    .find((item) => item.text() === "React");

  expect(react?.attributes("aria-checked")).toBe("true");
});

test("it should apply soft selected classes for solid success color", () => {
  const wrapper = mountToggleGroup({
    props: { color: "success", modelValue: "vue" },
    slots: {
      default: () => [
        h(ToggleItem, { value: "react" }, { default: () => "React" }),
        h(ToggleItem, { value: "vue" }, { default: () => "Vue" }),
      ],
    },
  });

  const vue = wrapper
    .findAll('[role="radio"]')
    .find((item) => item.text() === "Vue");

  expect(vue?.classes().join(" ")).toContain("bg-success-500/15");
});

test("it should allow multiple selections when multiple is set", async () => {
  const wrapper = mountToggleGroup({
    props: { multiple: true, modelValue: ["react"] },
    slots: {
      default: () => [
        h(ToggleItem, { value: "react" }, { default: () => "React" }),
        h(ToggleItem, { value: "vue" }, { default: () => "Vue" }),
      ],
    },
  });

  expect(wrapper.find('[role="group"]').exists()).toBe(true);

  const react = wrapper
    .findAll('[role="button"]')
    .find((item) => item.text() === "React");
  const vue = wrapper
    .findAll('[role="button"]')
    .find((item) => item.text() === "Vue");

  expect(react?.attributes("aria-pressed")).toBe("true");

  await vue?.trigger("click");

  expect(wrapper.emitted("change")?.[0]).toEqual([["react", "vue"]]);
  expect(vue?.attributes("aria-pressed")).toBe("true");

  await react?.trigger("click");

  expect(wrapper.emitted("change")?.[1]).toEqual([["vue"]]);
});
