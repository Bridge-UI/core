// ** External Imports
import { mount } from "@vue/test-utils";
import { CircleAlert } from "lucide-vue-next";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  Button,
  useButton,
  type ButtonOwnProps,
  type ButtonProps,
} from "@/Components/Button";

const libDefaults = {
  size: "md",
  as: "button",
  rounded: "md",
  color: "primary",
  variant: "solid",
} satisfies Partial<ButtonOwnProps>;

function mountUseButton(props: ButtonProps = {}) {
  let result!: ReturnType<typeof useButton>;

  const Wrapper = defineComponent({
    setup() {
      result = useButton(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should merge default color and variant", () => {
  const { merged } = mountUseButton();

  expect(merged.value.color).toBe("primary");
  expect(merged.value.variant).toBe("solid");
});

test("it should override color when prop is passed", () => {
  const { merged } = mountUseButton({ color: "error" });

  expect(merged.value.color).toBe("error");
});

test("it should reflect as anchor in merged props", () => {
  const { merged } = mountUseButton({ as: "a", href: "#" });

  expect(merged.value.as).toBe("a");
});

test("it should be disabled when disabled prop is true", () => {
  const { merged } = mountUseButton({ disabled: true });

  expect(merged.value.disabled).toBe(true);
});

test("it should set loading on merged when loading prop is true", () => {
  const { merged } = mountUseButton({ loading: true });

  expect(merged.value.loading).toBe(true);
});

test("it should compute root class as a non-empty string", () => {
  const { rootBind } = mountUseButton();

  expect(typeof rootBind.value.class).toBe("string");
  expect(rootBind.value.class.length).toBeGreaterThan(0);
});

test("it should shrink-wrap width when full is false", () => {
  const { rootBind } = mountUseButton();

  expect(rootBind.value.class).toContain("w-fit");
  expect(rootBind.value.class).not.toContain("w-full");
});

test("it should include full width class when full is true", () => {
  const { rootBind } = mountUseButton({ full: true });

  expect(rootBind.value.class).toContain("w-full");
  expect(rootBind.value.class).not.toContain("w-fit");
});

test("it should merge class into root bind", () => {
  const { rootBind } = mountUseButton({ class: "custom-button" });

  expect(rootBind.value.class).toContain("custom-button");
});

test("it should expose rootBind for additional attributes", () => {
  const { rootBind } = mountUseButton({
    id: "submit-btn",
    "data-testid": "button",
  });

  expect(rootBind.value.id).toBe("submit-btn");
  expect(rootBind.value["data-testid"]).toBe("button");
});

test("it should apply class after classes.root in root bind", () => {
  const { rootBind } = mountUseButton({
    class: "p-4",
    classes: { root: "p-2" },
  });

  expect(rootBind.value.class).toContain("p-4");
  expect(rootBind.value.class).not.toContain("p-2");
});

test("it should include aria-disabled styles for non-button elements", () => {
  const { rootBind } = mountUseButton({ as: "a", href: "#" });

  expect(rootBind.value.class).toContain("aria-disabled:opacity-80");
});

test("it should use mini size classes when density is mini", () => {
  const { merged, rootBind } = mountUseButton({
    density: "mini",
    icon: CircleAlert,
  });

  expect(merged.value.density).toBe("mini");
  expect(rootBind.value.class).toContain("w-7");
  expect(rootBind.value.class).not.toContain("w-full");
});

test("it should default to flat variant when density is mini and variant is omitted", () => {
  const { rootBind } = mountUseButton({
    density: "mini",
    icon: CircleAlert,
  });

  expect(rootBind.value.class).toContain("text-primary-600");
  expect(rootBind.value.class).not.toContain("bg-primary-500");
});

test("it should honor explicit variant when density is mini", () => {
  const { rootBind } = mountUseButton({
    density: "mini",
    variant: "solid",
    icon: CircleAlert,
  });

  expect(rootBind.value.class).toContain("bg-primary-500");
});

test("it should not include full width class when density is mini", () => {
  const { rootBind } = mountUseButton({
    full: true,
    density: "mini",
    icon: CircleAlert,
  });

  expect(rootBind.value.class).not.toContain("w-full");
});

test("it should render start icon when startIcon is set and not loading", () => {
  const wrapper = mount(Button, {
    props: { startIcon: CircleAlert },
    slots: { default: "Label" },
  });

  expect(wrapper.find("button svg").exists()).toBe(true);
});

test("it should hide start icon when loading", () => {
  const wrapper = mount(Button, {
    props: { loading: true, startIcon: CircleAlert },
    slots: { default: "Label" },
  });

  expect(wrapper.find("svg.animate-spin").exists()).toBe(true);
  expect(wrapper.text()).not.toContain("Label");
});

test("it should render text prop when default slot is not used", () => {
  const wrapper = mount(Button, { props: { text: "Label" } });

  expect(wrapper.text()).toContain("Label");
});

test("it should prefer text prop over default slot", () => {
  const wrapper = mount(Button, {
    props: { text: "From prop" },
    slots: { default: "From slot" },
  });

  expect(wrapper.text()).toContain("From prop");
  expect(wrapper.text()).not.toContain("From slot");
});

test("it should show default slot instead of icon when mini and slot is provided", () => {
  const wrapper = mount(Button, {
    props: { density: "mini" },
    slots: { default: "AB" },
  });

  expect(wrapper.text()).toContain("AB");
  expect(wrapper.findAll("svg").length).toBe(0);
});

test("it should render mini icon when density is mini and icon is set", () => {
  const wrapper = mount(Button, {
    props: { density: "mini", icon: CircleAlert },
  });

  expect(wrapper.find("svg").exists()).toBe(true);
  expect(wrapper.text()).toBe("");
});

test("it should render as button by default", () => {
  const wrapper = mount(Button, { slots: { default: "Click" } });

  expect(wrapper.find("button").exists()).toBe(true);
});

test("it should render as anchor when as is a", () => {
  const wrapper = mount(Button, {
    slots: { default: "Link" },
    props: { as: "a", href: "#" },
  });

  expect(wrapper.find("a").exists()).toBe(true);
  expect(wrapper.find("button").exists()).toBe(false);
});
