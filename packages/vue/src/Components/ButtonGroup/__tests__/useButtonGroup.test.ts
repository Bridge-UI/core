// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useButtonGroup,
  type ButtonGroupOwnProps,
  type ButtonGroupProps,
} from "@/Components/ButtonGroup";

const libDefaults = {
  full: false,
  color: "dark",
  separator: true,
  orientation: "horizontal",
} satisfies Partial<ButtonGroupOwnProps>;

function mountUseButtonGroup(props: Partial<ButtonGroupProps> = {}) {
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

test("it should merge default orientation", () => {
  const { merged } = mountUseButtonGroup();

  expect(merged.value.full).toBe(false);
  expect(merged.value.color).toBe("dark");
  expect(merged.value.separator).toBe(true);
  expect(merged.value.orientation).toBe("horizontal");
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

test("it should expose inherited attrs on rootBind", () => {
  const { rootBind } = mountUseButtonGroup({
    id: "export-group",
    "data-testid": "button-group",
  });

  expect(rootBind.value.id).toBe("export-group");
  expect(rootBind.value["data-testid"]).toBe("button-group");
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

test("it should set group role and data-slot on rootBind", () => {
  const { rootBind } = mountUseButtonGroup();

  expect(rootBind.value.role).toBe("group");
  expect(rootBind.value["data-slot"]).toBe("button-group");
});

test("it should apply full width classes when full is set", () => {
  const { rootBind } = mountUseButtonGroup({ full: true });

  expect(rootBind.value.class).toContain("w-full");
});

test("it should include nested group spacing classes on rootBind", () => {
  const { rootBind } = mountUseButtonGroup();

  expect(rootBind.value.class).toContain(
    "has-[>[data-slot=button-group]]:gap-2",
  );
});

test("it should draw a hairline on the default orientation", () => {
  const { rootBind } = mountUseButtonGroup();

  expect(rootBind.value.class).toContain("before:w-px");
  expect(rootBind.value.class).not.toContain("-ms-px");
  expect(rootBind.value.class).not.toContain("gap-px");
  expect(rootBind.value.class).toContain("before:bg-dark-200");
});

test("it should overlap adjacent children when separator is false", () => {
  const { rootBind } = mountUseButtonGroup({ separator: false });

  expect(rootBind.value.class).toContain("-ms-px");
  expect(rootBind.value.class).not.toContain("before:w-px");
});

test("it should color the hairline when color is set", () => {
  const { rootBind } = mountUseButtonGroup({ color: "primary" });

  expect(rootBind.value.class).toContain("before:bg-primary-200");
});

test("it should apply a vertical hairline when orientation is vertical", () => {
  const { rootBind } = mountUseButtonGroup({ orientation: "vertical" });

  expect(rootBind.value.class).toContain("before:h-px");
});
