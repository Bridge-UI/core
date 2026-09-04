// ** External Imports
import { CircleAlert } from "@lucide/vue";
import { mount } from "@vue/test-utils";
import { isString } from "es-toolkit/compat";
import { expect, test } from "vitest";
import { computed, defineComponent, h, provide } from "vue";

// ** Local Imports
import { Button, useButton, type ButtonOwnProps } from "@/Components/Button";
import { BUTTON_GROUP_INJECTION_KEY } from "@/Components/ButtonGroup/buttonGroupInjectionKey";

const libDefaults = {
  size: "md",
  as: "button",
  rounded: "md",
  color: "primary",
  variant: "solid",
} satisfies Partial<ButtonOwnProps>;

function mountUseButton(props: Partial<ButtonOwnProps> = {}) {
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

  expect(isString(rootBind.value.class)).toBe(true);
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

test("it should apply black high-contrast solid classes", () => {
  const { rootBind } = mountUseButton({ color: "black" });

  expect(rootBind.value.class).toContain("bg-black");
  expect(rootBind.value.class).toContain("text-white");
  expect(rootBind.value.class).toContain("dark:bg-white");
});

test("it should not include full width class when density is mini", () => {
  const { rootBind } = mountUseButton({
    full: true,
    density: "mini",
    icon: CircleAlert,
  });

  expect(rootBind.value.class).not.toContain("w-full");
});

test("it should set aria-pressed and selected classes when selected", () => {
  const { rootBind } = mountUseButton({ selected: true, variant: "outline" });

  expect(rootBind.value["aria-pressed"]).toBe(true);
  expect(rootBind.value.class).toContain("bg-primary-400/25");
});

test("it should render start icon when startIcon is set and not loading", () => {
  const wrapper = mount(Button, {
    slots: { default: "Label" },
    props: { startIcon: CircleAlert },
  });

  expect(wrapper.find("button svg").exists()).toBe(true);
});

test("it should keep start icon and label in the DOM when loading", () => {
  const wrapper = mount(Button, {
    slots: { default: "Label" },
    props: { loading: true, startIcon: CircleAlert },
  });

  expect(wrapper.text()).toContain("Label");
  expect(wrapper.find("span.invisible").exists()).toBe(true);
  expect(wrapper.find("svg.animate-spin").exists()).toBe(true);
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
    slots: { default: "AB" },
    props: { density: "mini" },
  });

  expect(wrapper.text()).toContain("AB");
  expect(wrapper.findAll("svg").length).toBe(0);
});

test("it should render mini icon when density is mini and icon is set", () => {
  const wrapper = mount(Button, {
    props: { density: "mini", icon: CircleAlert },
  });

  expect(wrapper.text()).toBe("");
  expect(wrapper.find("svg").exists()).toBe(true);
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

test("it should not force flat variant on mini buttons inside a ButtonGroup", () => {
  let result!: ReturnType<typeof useButton>;

  const Consumer = defineComponent({
    setup() {
      result = useButton({ density: "mini", icon: CircleAlert }, libDefaults);

      return () => h("div");
    },
  });

  const Wrapper = defineComponent({
    setup() {
      provide(
        BUTTON_GROUP_INJECTION_KEY,
        computed(() => {
          return {};
        }),
      );

      return () => h(Consumer);
    },
  });

  mount(Wrapper);

  expect(result.rootBind.value.class).toContain("h-auto");
  expect(result.rootBind.value.class).toContain("min-h-7");
  expect(result.rootBind.value.class).toContain("bg-primary-500");
  expect(result.rootBind.value.class.split(/\s+/).includes("h-7")).toBe(false);
});

test("it should keep mini height when ButtonGroup density is mini", () => {
  let result!: ReturnType<typeof useButton>;

  const Consumer = defineComponent({
    setup() {
      result = useButton({ density: "mini", icon: CircleAlert }, libDefaults);

      return () => h("div");
    },
  });

  const Wrapper = defineComponent({
    setup() {
      provide(
        BUTTON_GROUP_INJECTION_KEY,
        computed(() => {
          return { density: "mini" as const };
        }),
      );

      return () => h(Consumer);
    },
  });

  mount(Wrapper);

  expect(result.rootBind.value.class.split(/\s+/).includes("h-7")).toBe(true);
  expect(result.rootBind.value.class.split(/\s+/).includes("h-auto")).toBe(
    false,
  );
});

test("it should inherit appearance from ButtonGroup context", () => {
  let result!: ReturnType<typeof useButton>;

  const Consumer = defineComponent({
    setup() {
      result = useButton({}, libDefaults);

      return () => h("div");
    },
  });

  const Wrapper = defineComponent({
    setup() {
      provide(
        BUTTON_GROUP_INJECTION_KEY,
        computed(() => {
          return { size: "sm" as const, variant: "outline" as const };
        }),
      );

      return () => h(Consumer);
    },
  });

  mount(Wrapper);

  expect(result.merged.value.size).toBe("sm");
  expect(result.merged.value.color).toBe("primary");
  expect(result.merged.value.variant).toBe("outline");
});

test("it should let button props override ButtonGroup context", () => {
  let result!: ReturnType<typeof useButton>;

  const Consumer = defineComponent({
    setup() {
      result = useButton({ size: "lg", color: "error" }, libDefaults);

      return () => h("div");
    },
  });

  const Wrapper = defineComponent({
    setup() {
      provide(
        BUTTON_GROUP_INJECTION_KEY,
        computed(() => {
          return {
            size: "sm" as const,
            color: "dark" as const,
            variant: "outline" as const,
          };
        }),
      );

      return () => h(Consumer);
    },
  });

  mount(Wrapper);

  expect(result.merged.value.size).toBe("lg");
  expect(result.merged.value.color).toBe("error");
  expect(result.merged.value.variant).toBe("outline");
});
