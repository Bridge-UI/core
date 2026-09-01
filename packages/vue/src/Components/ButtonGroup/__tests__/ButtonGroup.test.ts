// ** External Imports
import { mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Button } from "@/Components/Button";
import { ButtonGroup, ButtonGroupText } from "@/Components/ButtonGroup";

afterEach(() => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }
});

const mountedWrappers: Array<ReturnType<typeof mount>> = [];

function mountButtonGroup(options: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(ButtonGroup, {
    ...options,
    slots: {
      default: () => [
        h(Button, null, { default: () => "Copy" }),
        h(Button, null, { default: () => "Paste" }),
      ],
      ...(options.slots ?? {}),
    },
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render a group with role group", () => {
  const wrapper = mountButtonGroup({
    props: { "aria-label": "Export" },
  });

  expect(wrapper.find('[role="group"]').exists()).toBe(true);
  expect(wrapper.find('[role="group"]').attributes("aria-label")).toBe(
    "Export",
  );
});

test("it should apply horizontal orientation by default", () => {
  const wrapper = mountButtonGroup();
  const root = wrapper.find('[data-slot="button-group"]');

  expect(root.classes()).toContain("flex-row");
  expect(root.classes()).toContain("gap-px");
});

test("it should apply vertical orientation when orientation is vertical", () => {
  const wrapper = mountButtonGroup({
    props: { orientation: "vertical" },
  });

  expect(wrapper.find('[data-slot="button-group"]').classes()).toContain(
    "flex-col",
  );
});

test("it should apply dark divider color by default", () => {
  const wrapper = mountButtonGroup();

  expect(wrapper.find('[data-slot="button-group"]').classes()).toContain(
    "bg-dark-200",
  );
});

test("it should apply primary divider color when color is primary", () => {
  const wrapper = mountButtonGroup({
    props: { color: "primary" },
  });

  expect(wrapper.find('[data-slot="button-group"]').classes()).toContain(
    "bg-primary-200",
  );
});

test("it should stretch to full width when full is set", () => {
  const wrapper = mountButtonGroup({
    props: { full: true },
  });

  expect(wrapper.find('[data-slot="button-group"]').classes()).toContain(
    "w-full",
  );
});

test("it should merge class with root classes", () => {
  const wrapper = mountButtonGroup({
    props: { class: "mt-4" },
  });

  expect(wrapper.find('[data-slot="button-group"]').classes()).toContain(
    "mt-4",
  );
});

test("it should forward additional attributes to the root element", () => {
  const wrapper = mountButtonGroup({
    props: {
      id: "export-group",
      "data-testid": "button-group",
    },
  });

  const root = wrapper.find("#export-group");

  expect(root.exists()).toBe(true);
  expect(root.attributes("data-testid")).toBe("button-group");
});

test("it should apply user class after classes.root (tailwind-merge)", () => {
  const wrapper = mountButtonGroup({
    props: {
      class: "mt-8",
      classes: { root: "mt-2" },
    },
  });

  const root = wrapper.find('[data-slot="button-group"]');

  expect(root.classes()).toContain("mt-8");
  expect(root.classes()).not.toContain("mt-2");
});

test("it should render ButtonGroupText as a span by default", () => {
  const wrapper = mount(ButtonGroup, {
    slots: {
      default: () => [
        h(ButtonGroupText, null, { default: () => "USD" }),
        h(Button, null, { default: () => "Pay" }),
      ],
    },
  });

  mountedWrappers.push(wrapper);

  expect(wrapper.find("span").text()).toBe("USD");
});

test("it should render ButtonGroupText as a label when as is label", () => {
  const wrapper = mount(ButtonGroup, {
    slots: {
      default: () => [
        h(
          ButtonGroupText,
          { as: "label", for: "amount" },
          { default: () => "USD" },
        ),
        h(Button, null, { default: () => "Pay" }),
      ],
    },
  });

  mountedWrappers.push(wrapper);

  const text = wrapper.find("label");

  expect(text.text()).toBe("USD");
  expect(text.attributes("for")).toBe("amount");
});
