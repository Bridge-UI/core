// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useButtonGroup,
  useButtonGroupText,
  type ButtonGroupOwnProps,
  type ButtonGroupTextOwnProps,
} from "@/Components/ButtonGroup";

const libDefaults = {
  full: false,
  color: "dark",
  orientation: "horizontal",
} satisfies Partial<ButtonGroupOwnProps>;

const textLibDefaults = {
  as: "span",
} satisfies Partial<ButtonGroupTextOwnProps>;

function mountUseButtonGroup(props: Partial<ButtonGroupOwnProps> = {}) {
  let result!: ReturnType<typeof useButtonGroup>;

  const Wrapper = defineComponent({
    setup() {
      result = useButtonGroup(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

function mountUseButtonGroupText(props: Partial<ButtonGroupTextOwnProps> = {}) {
  let result!: ReturnType<typeof useButtonGroupText>;

  const Wrapper = defineComponent({
    setup() {
      result = useButtonGroupText(props, textLibDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should merge default color and orientation", () => {
  const { merged } = mountUseButtonGroup();

  expect(merged.value.color).toBe("dark");
  expect(merged.value.orientation).toBe("horizontal");
  expect(merged.value.full).toBe(false);
});

test("it should override color when prop is passed", () => {
  const { merged } = mountUseButtonGroup({ color: "primary" });

  expect(merged.value.color).toBe("primary");
});

test("it should override orientation when prop is passed", () => {
  const { merged } = mountUseButtonGroup({ orientation: "vertical" });

  expect(merged.value.orientation).toBe("vertical");
});

test("it should compute root class as a non-empty string", () => {
  const { rootBind } = mountUseButtonGroup();

  expect(rootBind.value.class.length).toBeGreaterThan(0);
});

test("it should merge class into root bind", () => {
  const { rootBind } = mountUseButtonGroup({ class: "mt-4" });

  expect(rootBind.value.class).toContain("mt-4");
});

test("it should apply class after classes.root in root bind", () => {
  const { rootBind } = mountUseButtonGroup({
    class: "mt-8",
    classes: { root: "mt-2" },
  });

  expect(rootBind.value.class).toContain("mt-8");
  expect(rootBind.value.class).not.toContain("mt-2");
});

test("it should apply vertical orientation classes", () => {
  const { rootBind } = mountUseButtonGroup({ orientation: "vertical" });

  expect(rootBind.value.class).toContain("flex-col");
});

test("it should apply primary color class when color is primary", () => {
  const { rootBind } = mountUseButtonGroup({ color: "primary" });

  expect(rootBind.value.class).toContain("bg-primary-200");
});

test("it should set group role and data-slot on rootBind", () => {
  const { rootBind } = mountUseButtonGroup();

  expect(rootBind.value.role).toBe("group");
  expect(rootBind.value["data-slot"]).toBe("button-group");
});

test("it should apply full width classes when full is set", () => {
  const { rootBind } = mountUseButtonGroup({ full: true });

  expect(rootBind.value.class).toContain("w-full");
});

test("it should default ButtonGroupText tag to span", () => {
  const { tag, rootBind } = mountUseButtonGroupText();

  expect(tag.value).toBe("span");
  expect(rootBind.value.class).toContain("inline-flex");
});

test("it should override ButtonGroupText tag when as is label", () => {
  const { tag } = mountUseButtonGroupText({ as: "label" });

  expect(tag.value).toBe("label");
});
