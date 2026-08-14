// ** External Imports
import { User } from "@lucide/vue";
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { h } from "vue";

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

function mountToggleGroup(
  options: Parameters<typeof mount<typeof ToggleGroup>>[1] = {},
) {
  const wrapper = mount(ToggleGroup, {
    ...options,
    props: {
      "aria-label": "Options",
      ...(options.props ?? {}),
    },
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render a radio button with aria attributes", () => {
  const wrapper = mountToggleGroup({
    props: { modelValue: "a" },
    slots: {
      default: () => [
        h(ToggleItem, { value: "a" }, { default: () => "Alpha" }),
      ],
    },
  });

  const toggle = wrapper.find('[role="radio"]');

  expect(toggle.attributes("tabindex")).toBe("0");
  expect(toggle.attributes("aria-checked")).toBe("true");
});

test("it should render a leading icon when startIcon is set", () => {
  const wrapper = mountToggleGroup({
    props: { modelValue: "a" },
    slots: {
      default: () => [
        h(ToggleItem, {
          value: "a",
          startIcon: User,
          "aria-label": "User",
        }),
      ],
    },
  });

  expect(wrapper.find("svg").exists()).toBe(true);
  expect(wrapper.find('[role="radio"]').classes().join(" ")).toContain("gap-");
});

test("it should stretch when the group is full", () => {
  const wrapper = mountToggleGroup({
    props: { full: true, modelValue: "a" },
    slots: {
      default: () => [
        h(ToggleItem, { value: "a" }, { default: () => "Alpha" }),
        h(ToggleItem, { value: "b" }, { default: () => "Beta" }),
      ],
    },
  });

  expect(wrapper.find('[role="radiogroup"]').classes()).toContain("w-full");
  expect(wrapper.find('[role="radio"]').classes()).toContain("flex-1");
});
