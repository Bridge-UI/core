// ** External Imports
import { CircleAlert } from "@lucide/vue";
import { mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Button } from "@/Components/Button";
import { ButtonGroup } from "@/Components/ButtonGroup";

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
  expect(root.classes().join(" ")).toContain("before:w-px");
});

test("it should apply vertical orientation when orientation is vertical", () => {
  const wrapper = mountButtonGroup({
    props: { orientation: "vertical" },
  });

  expect(wrapper.find('[data-slot="button-group"]').classes()).toContain(
    "flex-col",
  );
});

test("it should draw a hairline between children by default", () => {
  const wrapper = mountButtonGroup();
  const className = wrapper
    .find('[data-slot="button-group"]')
    .classes()
    .join(" ");

  expect(className).toContain("before:w-px");
  expect(className).toContain("before:inset-y-0");
  expect(className).not.toContain("-ms-px");
  expect(className).not.toContain("gap-px");
  expect(className).toContain("before:bg-white/25");
});

test("it should overlap adjacent children when separator is false", () => {
  const wrapper = mountButtonGroup({
    props: { separator: false },
  });
  const className = wrapper
    .find('[data-slot="button-group"]')
    .classes()
    .join(" ");

  expect(className).toContain("-ms-px");
  expect(className).toContain("border-e-0");
  expect(className).not.toContain("before:w-px");
});

test("it should color the hairline from the group variant", () => {
  const wrapper = mountButtonGroup({
    props: { variant: "outline" },
  });
  const className = wrapper
    .find('[data-slot="button-group"]')
    .classes()
    .join(" ");

  expect(className).toContain("before:bg-primary-600");
});

test("it should color the hairline when color is set", () => {
  const wrapper = mountButtonGroup({
    props: { color: "error", variant: "outline" },
  });
  const className = wrapper
    .find('[data-slot="button-group"]')
    .classes()
    .join(" ");

  expect(className).toContain("before:bg-error-600");
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

test("it should render nested groups as clustered children", () => {
  const wrapper = mount(ButtonGroup, {
    props: { "aria-label": "Editor" },
    slots: {
      default: () => [
        h(ButtonGroup, null, {
          default: () => [h(Button, null, { default: () => "Bold" })],
        }),
        h(ButtonGroup, null, {
          default: () => [h(Button, null, { default: () => "Undo" })],
        }),
      ],
    },
  });

  mountedWrappers.push(wrapper);

  expect(wrapper.findAll('[data-slot="button-group"]').length).toBe(3);
});

test("it should apply group variant to nested buttons", () => {
  const wrapper = mountButtonGroup({
    props: { variant: "outline" },
  });

  expect(wrapper.find("button").classes().join(" ")).toContain(
    "border-primary-600",
  );
});

test("it should apply group size to nested buttons", () => {
  const wrapper = mountButtonGroup({
    props: { size: "sm", variant: "outline" },
  });

  expect(wrapper.find("button").classes().join(" ")).toContain("px-3");
});

test("it should let a nested button override the group size", () => {
  const wrapper = mount(ButtonGroup, {
    props: { size: "sm", variant: "outline" },
    slots: {
      default: () => [h(Button, { size: "lg" }, { default: () => "Copy" })],
    },
  });

  mountedWrappers.push(wrapper);

  const className = wrapper.find("button").classes().join(" ");

  expect(className).toContain("py-2.5");
  expect(className).not.toContain("px-3");
});

test("it should keep button color when group color is unset", () => {
  const wrapper = mountButtonGroup({
    props: { variant: "outline" },
  });

  expect(wrapper.find("button").classes().join(" ")).toContain(
    "text-primary-600",
  );
});

test("it should apply group color to nested buttons when color is set", () => {
  const wrapper = mountButtonGroup({
    props: { color: "error", variant: "outline" },
  });

  expect(wrapper.find("button").classes().join(" ")).toContain(
    "text-error-600",
  );
});

test("it should inherit size through a nested group", () => {
  const wrapper = mount(ButtonGroup, {
    props: { size: "sm" },
    slots: {
      default: () => [
        h(
          ButtonGroup,
          { variant: "outline" },
          {
            default: () => [h(Button, null, { default: () => "Bold" })],
          },
        ),
      ],
    },
  });

  mountedWrappers.push(wrapper);

  const className = wrapper.find("button").classes().join(" ");

  expect(className).toContain("px-3");
  expect(className).toContain("border-primary-600");
});

test("it should draw the parent variant divider inside nested groups", () => {
  const wrapper = mount(ButtonGroup, {
    props: { variant: "outline", "aria-label": "Editor" },
    slots: {
      default: () => [
        h(
          ButtonGroup,
          {},
          {
            default: () => [
              h(Button, null, { default: () => "Bold" }),
              h(Button, null, { default: () => "Italic" }),
            ],
          },
        ),
      ],
    },
  });

  mountedWrappers.push(wrapper);

  const groups = wrapper.findAll('[data-slot="button-group"]');

  expect(groups[1]?.classes().join(" ")).toContain("before:bg-primary-600");
});

test("it should keep the group variant on mini buttons and stretch their height", () => {
  const wrapper = mount(ButtonGroup, {
    slots: {
      default: () => [
        h(Button, null, { default: () => "Save" }),
        h(Button, {
          density: "mini",
          icon: CircleAlert,
          "aria-label": "More",
        }),
      ],
    },
  });

  mountedWrappers.push(wrapper);

  const className = wrapper
    .find('button[aria-label="More"]')
    .classes()
    .join(" ");

  expect(className).toContain("h-auto");
  expect(className).toContain("bg-primary-500");
  expect(className).toContain("border-transparent");
  expect(className).not.toContain("h-7");
});
